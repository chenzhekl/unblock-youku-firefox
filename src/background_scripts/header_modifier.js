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

import { loadURLDb } from '../common/url_db'

export default class HeaderModifier {
  constructor (ipAddr) {
    this.headerModifier = (details) => {
      details.requestHeaders.push({
        name: 'X-Forwarded-For',
        value: ipAddr
      }, {
        name: 'Client-IP',
        value: ipAddr
      })

      return { requestHeaders: details.requestHeaders }
    }
  }

  async setup () {
    if (!this.filter) {
      const db = await loadURLDb('../url_db.json')
      this.filter = db.headerURLs
    }

    if (!browser.webRequest.onBeforeSendHeaders.hasListener(this.headerModifier)) {
      browser.webRequest.onBeforeSendHeaders.addListener(
        this.headerModifier,
        {
          urls: this.filter
        },
        ['requestHeaders', 'blocking']
      )
    }
  }

  clear () {
    if (browser.webRequest.onBeforeSendHeaders.hasListener(this.headerModifier)) {
      browser.webRequest.onBeforeSendHeaders.removeListener(this.headerModifier)
    }
  }
}
