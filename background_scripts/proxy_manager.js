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

import EventSystem from '../common/event_system'
import HeaderModifier from './header_modifier'
import Redirector from './redirector'
import Proxy from './proxy'

export const mode = {
  OFF: 'OFF',
  LITE: 'LITE',
  FULL: 'FULL'
}

export const events = {
  MODE_CHANGED: 'MODE_CHANGED'
}

export default class ProxyManager {
  constructor () {
    this.ipAddr = `220.181.111.${Math.floor(Math.random() * 254 + 1)}`
    this.defaultRedirectServer = 'www.yōukù.com/proxy'
    this.backupRedirectServer = 'bak.yōukù.com/proxy'

    this.headerModifier = new HeaderModifier(this.ipAddr)
    this.redirector = new Redirector(this.defaultRedirectServer, this.backupRedirectServer)
    this.proxy = new Proxy()

    this.events = new EventSystem()
    this.setModeOff()
  }

  setModeOff () {
    this.mode = mode.OFF
    browser.browserAction.setBadgeText({ text: 'OFF' })
    browser.browserAction.setBadgeBackgroundColor({ color: '#a50000' })
    browser.browserAction.setIcon({ path: { 19: 'icons/icon19gray.png' } })
    browser.browserAction.setTitle({ title: 'Unblock Youku has been turned off.' })

    this.resetAll()

    this.events.emit(events.MODE_CHANGED, this.mode)
  }

  async setModeLite () {
    this.mode = mode.LITE
    browser.browserAction.setBadgeText({ text: 'LITE' })
    browser.browserAction.setBadgeBackgroundColor({ color: '#0079a5' })
    browser.browserAction.setIcon({ path: { 19: 'icons/icon19.png' } })
    browser.browserAction.setTitle({ title: 'Unblock Youku is running in the lite mode.' })

    this.resetAll()
    await this.headerModifier.setup()
    await this.redirector.setup()

    this.events.emit(events.MODE_CHANGED, this.mode)
  }

  async setModeFull () {
    this.mode = mode.FULL
    browser.browserAction.setBadgeText({ text: 'FULL' })
    browser.browserAction.setBadgeBackgroundColor({ color: '#339b1d' })
    browser.browserAction.setIcon({ path: { 19: 'icons/icon19.png' } })
    browser.browserAction.setTitle({ title: 'Unblock Youku is running in the full mode.' })

    this.resetAll()
    await this.headerModifier.setup()
    this.proxy.setup()

    this.events.emit(events.MODE_CHANGED, this.mode)
  }

  resetAll () {
    this.headerModifier.clear()
    this.redirector.clear()
    this.proxy.clear()
  }
}
