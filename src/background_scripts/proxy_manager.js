/*
 * Copyright (C) 2017 Zhe Chen
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import HeaderModifier from "./header_modifier";
import Redirector from "./redirector";
import Proxy from "./proxy";

export const modes = {
  OFF: "OFF",
  LITE: "LITE",
  FULL: "FULL"
};

export default class ProxyManager {
  constructor() {
    this.ipAddr = `220.181.111.${Math.floor(Math.random() * 254 + 1)}`;
    this.defaultRedirectServer = "www.yōukù.com/proxy";
    this.backupRedirectServer = "bak.yōukù.com/proxy";

    this.headerModifier = new HeaderModifier(this.ipAddr);
    this.redirector = new Redirector(
      this.defaultRedirectServer,
      this.backupRedirectServer
    );
    this.proxy = new Proxy();

    browser.storage.local
      .get({
        mode: modes.OFF
      })
      .then(
        status => {
          switch (status.mode) {
            case modes.OFF:
              this.setModeOff();
              break;
            case modes.LITE:
              this.setModeLite();
              break;
            case modes.FULL:
              this.setModeFull();
              break;
          }
        },
        () => {
          this.setModeOff();
        }
      );

    this.handleMessage = this.handleMessage.bind(this);
    const onMessage = browser.runtime.onMessage;
    if (!onMessage.hasListener(this.handleMessage)) {
      onMessage.addListener(this.handleMessage);
    }
  }

  handleMessage(message, sender, sendResponse) {
    if (message.target !== "background") {
      return;
    }

    switch (message.method) {
      case "setModeOff":
        this.setModeOff();
        return Promise.resolve(true);
      case "setModeLite":
        this.setModeLite();
        return Promise.resolve(true);
      case "setModeFull":
        this.setModeFull();
        return Promise.resolve(true);
    }

    return Promise.reject(false);
  }

  setModeOff() {
    this.mode = modes.OFF;
    if (browser.browserAction.setBadgeText) {
      browser.browserAction.setBadgeText({ text: "OFF" });
      browser.browserAction.setBadgeBackgroundColor({ color: "#a50000" });
      browser.browserAction.setIcon({ path: { 19: "icons/icon19gray.png" } });
    }
    browser.browserAction.setTitle({ title: "Unblock Youku (OFF)" });

    browser.storage.local.set({ mode: modes.OFF });

    this.resetAll();
  }

  async setModeLite() {
    this.mode = modes.LITE;
    if (browser.browserAction.setBadgeText) {
      browser.browserAction.setBadgeText({ text: "LITE" });
      browser.browserAction.setBadgeBackgroundColor({ color: "#0079a5" });
      browser.browserAction.setIcon({ path: { 19: "icons/icon19.png" } });
    }
    browser.browserAction.setTitle({ title: "Unblock Youku (LITE)" });

    browser.storage.local.set({ mode: modes.LITE });

    this.resetAll();
    await this.headerModifier.setup();
    await this.redirector.setup();
  }

  async setModeFull() {
    this.mode = modes.FULL;
    if (browser.browserAction.setBadgeText) {
      browser.browserAction.setBadgeText({ text: "FULL" });
      browser.browserAction.setBadgeBackgroundColor({ color: "#339b1d" });
      browser.browserAction.setIcon({ path: { 19: "icons/icon19.png" } });
    }
    browser.browserAction.setTitle({ title: "Unblock Youku (FULL)" });

    browser.storage.local.set({ mode: modes.FULL });

    this.resetAll();
    await this.headerModifier.setup();
    this.proxy.setup();
  }

  resetAll() {
    this.headerModifier.clear();
    this.redirector.clear();
    this.proxy.clear();
  }
}
