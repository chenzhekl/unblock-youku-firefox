/*
 * Copyright (C) 2012 - 2016  Bo Zhu  http://zhuzhu.org
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
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

function stringStartsWith (str, substr) {
  return str.slice(0, substr.length) === substr
}

function parseUrl (urlStr) {
  let protocol = null
  if (stringStartsWith(urlStr, 'http://')) {
    urlStr = urlStr.slice('http://'.length)
    protocol = 'http'
  } else if (stringStartsWith(urlStr, 'https://')) {
    urlStr = urlStr.slice('https://'.length)
    protocol = 'https'
  } else {
    console.error('URL does not start with http:// or https://')
    return null
  }

  let pathIdx = urlStr.indexOf('/')
  if (pathIdx < 0) {
    pathIdx = urlStr.length
    urlStr += '/'
  }
  const colonIdx = urlStr.indexOf(':')

  let sepIdx = pathIdx
  if (colonIdx >= 0 && colonIdx < pathIdx) {
    sepIdx = colonIdx
  }

  return {
    protocol: protocol,
    // the parameter in FindProxyForURL only doesn't contain port numbers
    hostname: urlStr.slice(0, sepIdx),
    portpath: urlStr.slice(sepIdx)
  }
}

function genUrlMap (protocol, whiteUlist, proxyUlist) {
  const urlMap = {
    white: {
      any: []
    },
    proxy: {
      any: []
    }
  }

  function addPatterns (mapObj, ulist) {
    let i, uobj, hostname, portpath
    let key, val
    for (i = 0; i < ulist.length; i++) {
      uobj = parseUrl(ulist[i])
      if (uobj === null) {
        console.error('Invalid URL pattern: ' + ulist[i])
        continue
      }

      if (uobj.protocol === protocol) {
        hostname = uobj.hostname
        portpath = uobj.portpath
        if (hostname.indexOf('*') >= 0) {
          if (hostname.slice(1).indexOf('*') >= 0) {
            console.error('Invalid wildcard URL pattern: ' + ulist[i])
            continue
          } else {
            key = 'any'
            val = hostname + portpath
          }
        } else {
          if (!mapObj.hasOwnProperty(hostname)) {
            mapObj[hostname] = []
          }
          key = hostname
          val = portpath
        }

        val = val.replace(/[-[\]/{}()+?.\\^$|]/g, '\\$&')
        val = val.replace(/\*/g, '.*')
        val = val.replace(/^\.\*/i, '[^/]*')

        if (val.slice(-2) === '.*') {
          val = val.slice(0, -2)
          val = new RegExp('^' + val, 'i')
        } else {
          val = new RegExp('^' + val + '$', 'i')
        }

        mapObj[key].push(val)
      }
    }
  }

  addPatterns(urlMap.white, whiteUlist)
  addPatterns(urlMap.proxy, proxyUlist)

  return urlMap
}

function urls2pac (urlWhitelist, urlList,
  proxyServer1, proxyProtocol1,
  proxyServer2, proxyProtocol2) {
  if (typeof proxyProtocol1 === 'undefined') {
    proxyProtocol1 = 'PROXY'
  } else {
    proxyProtocol1 = proxyProtocol1.replace(/:/g, '')
    proxyProtocol1 = proxyProtocol1.replace(/\//g, '')
    proxyProtocol1 = proxyProtocol1.toUpperCase()
    if (proxyProtocol1 === 'HTTP') {
      proxyProtocol1 = 'PROXY'
    }
  }

  let proxyStr = proxyProtocol1 + ' ' + proxyServer1 + '; '

  if (typeof proxyServer2 !== 'undefined') {
    if (typeof proxyProtocol2 === 'undefined') {
      proxyProtocol2 = 'PROXY'
    }
    proxyProtocol2 = proxyProtocol2.replace(/:/g, '')
    proxyProtocol2 = proxyProtocol2.replace(/\//g, '')
    proxyProtocol2 = proxyProtocol2.toUpperCase()
    if (proxyProtocol2 === 'HTTP') {
      proxyProtocol2 = 'PROXY'
    }

    proxyStr += proxyProtocol2 + ' ' + proxyServer2 + '; '
  }

  proxyStr += 'DIRECT'

  const httpMap = genUrlMap('http', urlWhitelist, urlList)
  const httpsMap = genUrlMap('https', urlWhitelist, urlList)

  function checkRegexList (regexList, str) {
    if (str.slice(0, 4) === ':80/') { str = str.slice(3) }
    for (let i = 0; i < regexList.length; i++) {
      if (regexList[i].test(str)) { return true }
    }
    return false
  }

  function checkPatterns (patterns, hostname, fullUrl, protoLen) {
    if (patterns.hasOwnProperty(hostname)) {
      if (checkRegexList(patterns[hostname], fullUrl.slice(protoLen + hostname.length))) {
        return true
      }
    }
    if (checkRegexList(patterns.any, fullUrl.slice(protoLen))) {
      return true
    }
    return false
  }

  function findProxy (urlMap, host, url, protoLen) {
    if (checkPatterns(urlMap.white, host, url, protoLen)) {
      return 'DIRECT'
    }
    if (checkPatterns(urlMap.proxy, host, url, protoLen)) {
      return proxyStr
    }
    return 'DIRECT'
  }

  function findProxyForURL (url, host) {
    const prot = url.slice(0, 6)
    if (prot === 'http:/') {
      return findProxy(httpMap, host, url, 7)
    } else if (prot === 'https:') {
      return findProxy(httpsMap, host, url, 8)
    }
    return 'DIRECT'
  }

  return findProxyForURL
}

const findProxyForURL = urls2pac(
  // eslint-disable-next-line
  urlDb.proxyBypassURLs, urlDb.redirectURLs.concat(urlDb.proxyURLs),
  'secure.uku.im:8443', 'HTTPS',
  'secure.uku.im:993', 'HTTPS'
)

// eslint-disable-next-line
function FindProxyForURL (url, host) {
  return findProxyForURL(`${url}/`, host)
}
