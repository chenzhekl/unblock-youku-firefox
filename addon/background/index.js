/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (immutable) */ __webpack_exports__["a"] = loadURLDb;
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

async function loadURLDb (path) {
  const urlDbURL = browser.runtime.getURL(path)
  const response = await fetch(urlDbURL)
  const urlDbContent = await response.json()

  return urlDbContent
}


/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__proxy_manager__ = __webpack_require__(3);
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



window.manager = new __WEBPACK_IMPORTED_MODULE_0__proxy_manager__["a" /* default */]()


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_event_system__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__header_modifier__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__redirector__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__proxy__ = __webpack_require__(7);
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






const mode = {
  OFF: 'OFF',
  LITE: 'LITE',
  FULL: 'FULL'
}
/* unused harmony export mode */


const events = {
  MODE_CHANGED: 'MODE_CHANGED'
}
/* unused harmony export events */


class ProxyManager {
  constructor () {
    this.ipAddr = `220.181.111.${Math.floor(Math.random() * 254 + 1)}`
    this.defaultRedirectServer = 'www.yōukù.com/proxy'
    this.backupRedirectServer = 'bak.yōukù.com/proxy'

    this.headerModifier = new __WEBPACK_IMPORTED_MODULE_1__header_modifier__["a" /* default */](this.ipAddr)
    this.redirector = new __WEBPACK_IMPORTED_MODULE_2__redirector__["a" /* default */](this.defaultRedirectServer, this.backupRedirectServer)
    this.proxy = new __WEBPACK_IMPORTED_MODULE_3__proxy__["a" /* default */]()

    this.events = new __WEBPACK_IMPORTED_MODULE_0__common_event_system__["a" /* default */]()
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
/* harmony export (immutable) */ __webpack_exports__["a"] = ProxyManager;



/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

class EventSystem {
  constructor () {
    this.eventMap = {}
  }

  addEventListener (eventName, listener) {
    if (!(eventName in this.eventMap)) {
      this.eventMap[eventName] = new Set()
    }

    this.eventMap[eventName].add(listener)
  }

  removeEventListener (eventName, listener) {
    if (!(eventName in this.eventMap)) {
      return false
    }

    return this.eventMap[eventName].delete(listener)
  }

  clearEventListeners (eventName) {
    delete this.eventMap[eventName]
  }

  emit (eventName, ...params) {
    if (!(eventName in this.eventMap)) {
      return false
    }

    this.eventMap[eventName].forEach((listener) => {
      listener(...params)
    })

    return true
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EventSystem;



/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_url_db__ = __webpack_require__(0);
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



class HeaderModifier {
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
      const db = await Object(__WEBPACK_IMPORTED_MODULE_0__common_url_db__["a" /* loadURLDb */])('../url_db.json')
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
/* harmony export (immutable) */ __webpack_exports__["a"] = HeaderModifier;



/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__common_url_db__ = __webpack_require__(0);
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



class Redirector {
  constructor (defaultServer, backupServer) {
    this.defaultRedirectServer = defaultServer
    this.backupRedirectServer = backupServer

    this.redirector = (details) => {
      if (details.url.slice(-15) === 'crossdomain.xml') {
        return {}
      }

      let redirectURL = null

      // special treatment for play.baidu
      if (details.url.slice(0, 41) === 'http://play.baidu.com/data/music/songlink') {
        redirectURL = 'http://play.baidu.com/data/cloud/songlink' + details.url.slice(41)
        return {redirectUrl: redirectURL}
      }

      if (details.url.startsWith('http://')) {
        redirectURL = 'http://' + this.defaultRedirectServer + '/http/' + details.url.substring('http://'.length)
      } else if (details.url.startsWith('https://')) {
        redirectURL = 'http://' + this.defaultRedirectServer + '/https/' + details.url.substring('https://'.length)
      }

      if (redirectURL !== null) {
        return {redirectUrl: redirectURL}
      }
      return {}
    }
  }

  async setup () {
    if (!this.filter) {
      const db = await Object(__WEBPACK_IMPORTED_MODULE_0__common_url_db__["a" /* loadURLDb */])('../url_db.json')
      this.filter = db.redirectURLs
    }

    if (!browser.webRequest.onBeforeRequest.hasListener(this.redirector)) {
      browser.webRequest.onBeforeRequest.addListener(
        this.redirector,
        {
          urls: this.filter
        },
        ['blocking']
      )
    }
  }

  clear () {
    if (browser.webRequest.onBeforeRequest.hasListener(this.redirector)) {
      browser.webRequest.onBeforeRequest.removeListener(this.redirector)
    }
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Redirector;



/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
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

class Proxy {
  // constructor (defaultServer, backupServer) {
  //   this.defaultProxyServer = defaultServer
  //   this.backupProxyServer = backupServer
  // }

  setup () {
    browser.proxy.onProxyError.addListener(error => {
      console.error(`Proxy error: ${error.message}`)
    })
    browser.proxy.register('../pac/index.js')
  }

  clear () {
    browser.proxy.unregister()
  }
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Proxy;



/***/ })
/******/ ]);