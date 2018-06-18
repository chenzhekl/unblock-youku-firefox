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

import URL_DB from "../common/url_db";

export default class Redirector {
  constructor(defaultServer, backupServer) {
    this.defaultRedirectServer = defaultServer;
    this.backupRedirectServer = backupServer;

    this.redirector = details => {
      if (details.url.slice(-15) === "crossdomain.xml") {
        return {};
      }

      let redirectURL = null;

      // special treatment for play.baidu
      if (
        details.url.slice(0, 41) === "http://play.baidu.com/data/music/songlink"
      ) {
        redirectURL =
          "http://play.baidu.com/data/cloud/songlink" + details.url.slice(41);
        return { redirectUrl: redirectURL };
      }

      if (details.url.startsWith("http://")) {
        redirectURL =
          "http://" +
          this.defaultRedirectServer +
          "/http/" +
          details.url.substring("http://".length);
      } else if (details.url.startsWith("https://")) {
        redirectURL =
          "http://" +
          this.defaultRedirectServer +
          "/https/" +
          details.url.substring("https://".length);
      }

      if (redirectURL !== null) {
        return { redirectUrl: redirectURL };
      }
      return {};
    };
  }

  async setup() {
    if (!browser.webRequest.onBeforeRequest.hasListener(this.redirector)) {
      browser.webRequest.onBeforeRequest.addListener(
        this.redirector,
        {
          urls: URL_DB.redirectURLs
        },
        ["blocking"]
      );
    }
  }

  clear() {
    if (browser.webRequest.onBeforeRequest.hasListener(this.redirector)) {
      browser.webRequest.onBeforeRequest.removeListener(this.redirector);
    }
  }
}
