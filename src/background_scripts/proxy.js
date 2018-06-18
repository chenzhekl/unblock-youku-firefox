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

export default class Proxy {
  constructor() {
    this.requestProxier = request => {
      if (URL_DB.proxyBypassURLs.includes(request.url)) {
        return { type: "DIRECT" };
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

    this.errorHandler = error => {
      console.error(`Proxy error: ${error.message}`);
    };
  }

  async setup() {
    if (!browser.proxy.onError.hasListener(this.errorHandler)) {
      browser.proxy.onError.addListener(this.errorHandler);
    }

    if (!browser.proxy.onRequest.hasListener(this.requestProxier)) {
      browser.proxy.onRequest.addListener(this.requestProxier, {
        urls: URL_DB.proxyURLs
      });
    }
  }

  clear() {
    if (browser.proxy.onError.hasListener(this.errorHandler)) {
      browser.proxy.onError.removeListener(this.errorHandler);
    }

    if (browser.proxy.onRequest.hasListener(this.requestProxier)) {
      browser.proxy.onRequest.removeListener(this.requestProxier);
    }
  }
}
