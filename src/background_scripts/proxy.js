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

import { loadURLDb } from "../common/url_db";

export default class Proxy {
  constructor() {
    this.requestProxier = request => {
      if (this.bypass.includes(request.url)) {
        return {
          type: "DIRECT"
        };
      }

      return [
        {
          type: "HTTPS",
          host: "secure.uku.im",
          port: "8443"
        },
        {
          type: "HTTPS",
          host: "secure.uku.im",
          port: "993"
        }
      ];
    };
  }

  async setup() {
    if (!this.filter) {
      const urlDb = await loadURLDb("../url_db.json");
      this.filter = urlDb.redirectURLs.concat(urlDb.proxyURLs);
      this.bypass = urlDb.proxyBypassURLs;
    }

    browser.proxy.onProxyError.addListener(error => {
      console.error(`Proxy error: ${error.message}`);
    });

    if (!browser.proxy.onRequest.hasListener(this.requestProxier)) {
      browser.proxy.onRequest.addListener(this.requestProxier, {
        urls: this.filter
      });
    }
  }

  clear() {
    if (browser.proxy.onRequest.hasListener(this.requestProxier)) {
      browser.proxy.onRequest.removeListener(this.requestProxier);
    }
  }
}
