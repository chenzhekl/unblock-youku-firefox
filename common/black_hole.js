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

function string_starts_with (str, substr) {
  'use strict'
  return str.slice(0, substr.length) === substr
}

function _parse_url (url_str) {
  'use strict'
  var protocol = null
  if (string_starts_with(url_str, 'http://')) {
    url_str = url_str.slice('http://'.length)
    protocol = 'http'
  } else if (string_starts_with(url_str, 'https://')) {
    url_str = url_str.slice('https://'.length)
    protocol = 'https'
  } else {
    console.error('URL does not start with http:// or https://')
    return null
  }

  var path_idx = url_str.indexOf('/')
  if (path_idx < 0) {
    path_idx = url_str.length
    url_str += '/'
  }
  var colon_idx = url_str.indexOf(':')  // the colon before the optional port number

  var sep_idx = path_idx
  if (colon_idx >= 0 && colon_idx < path_idx) {
    sep_idx = colon_idx
  }

  return {
    protocol: protocol,
    // the parameter in FindProxyForURL only doesn't contain port numbers
    hostname: url_str.slice(0, sep_idx),
    portpath: url_str.slice(sep_idx)
  }
}

function gen_url_map (protocol, white_ulist, proxy_ulist) {
  'use strict'
  var url_map = {
    white: {
      any: []
    },
    proxy: {
      any: []
    }
  }

  function add_patterns (map_obj, ulist) {
    var i, uobj, hostname, portpath
    var key, val
    for (i = 0; i < ulist.length; i++) {
      uobj = _parse_url(ulist[i])
      if (uobj === null) {
        console.error('Invalid URL pattern: ' + ulist[i])
        continue
      }

      if (uobj.protocol === protocol) {
        hostname = uobj.hostname
        portpath = uobj.portpath
        if (hostname.indexOf('*') >= 0) {
          if (hostname.slice(1).indexOf('*') >= 0) {  // * is only allowed to be the first char
            console.error('Invalid wildcard URL pattern: ' + ulist[i])
            continue
          } else {
            key = 'any'
            val = hostname + portpath  // host:port/path
          }
        } else {
          if (!map_obj.hasOwnProperty(hostname)) {
            map_obj[hostname] = []
          }
          key = hostname
          val = portpath  // only :port/path
        }

        val = val.replace(/[\-\[\]\/\{\}\(\)\+\?\.\\\^\$\|]/g, '\\$&')
        val = val.replace(/\*/g, '.*')
        val = val.replace(/^\.\*/i, '[^\/]*')  // if starts with *; should not be possible for :port or /path

        if (val.slice(-2) === '.*') {
          val = val.slice(0, -2)
          val = new RegExp('^' + val, 'i')
        } else {
          val = new RegExp('^' + val + '$', 'i')
        }

        map_obj[key].push(val)
      }  // if
    }  // for
  }

  add_patterns(url_map.white, white_ulist)
  add_patterns(url_map.proxy, proxy_ulist)

  return url_map
}

function urls2pac (url_whitelist, url_list,
                   proxy_server_1, proxy_protocol_1,
                   proxy_server_2, proxy_protocol_2) {
  'use strict'

  if (typeof proxy_protocol_1 === 'undefined') {
    proxy_protocol_1 = 'PROXY'
  } else {
    proxy_protocol_1 = proxy_protocol_1.replace(/:/g, '')
    proxy_protocol_1 = proxy_protocol_1.replace(/\//g, '')
    proxy_protocol_1 = proxy_protocol_1.toUpperCase()
    if (proxy_protocol_1 === 'HTTP') {
      proxy_protocol_1 = 'PROXY'
    }
  }

  var _proxy_str = proxy_protocol_1 + ' ' + proxy_server_1 + '; '

  if (typeof proxy_server_2 !== 'undefined') {
    if (typeof proxy_protocol_2 === 'undefined') {
      proxy_protocol_2 = 'PROXY'
    }
    proxy_protocol_2 = proxy_protocol_2.replace(/:/g, '')
    proxy_protocol_2 = proxy_protocol_2.replace(/\//g, '')
    proxy_protocol_2 = proxy_protocol_2.toUpperCase()
    if (proxy_protocol_2 === 'HTTP') {
      proxy_protocol_2 = 'PROXY'
    }

    _proxy_str += proxy_protocol_2 + ' ' + proxy_server_2 + '; '
  }

  _proxy_str += 'DIRECT;'

  var _http_map = gen_url_map('http', url_whitelist, url_list)
  var _https_map = gen_url_map('https', url_whitelist, url_list)
  var _proxy_str = _proxy_str

  function _check_regex_list (regex_list, str) {
    if (str.slice(0, 4) === ':80/') { str = str.slice(3) }
    for (var i = 0; i < regex_list.length; i++) {
      if (regex_list[i].test(str)) { return true }
    }
    return false
  }

  function _check_patterns (patterns, hostname, full_url, prot_len) {
    if (patterns.hasOwnProperty(hostname)) {
      if (_check_regex_list(patterns[hostname],
          full_url.slice(prot_len + hostname.length)))  // check only :port/path
      { return true }
    }
    if (_check_regex_list(patterns.any,  // try our best to speed up the checking for non-proxied urls
        full_url.slice(prot_len)))  // check hostname:port/path
    { return true }
    return false
  }

  function _find_proxy (url_map, host, url, prot_len) {
    if (_check_patterns(url_map.white, host, url, prot_len)) { return 'DIRECT' }
    if (_check_patterns(url_map.proxy, host, url, prot_len)) { return _proxy_str }
    return 'DIRECT'
  }

  function FindProxyForURL (url, host) {  // host doesn't contain port
    var prot = url.slice(0, 6)
    if (prot === 'http:/') { return _find_proxy(_http_map, host, url, 7) }  // 'http://'.length
    else if (prot === 'https:') { return _find_proxy(_https_map, host, url, 8) }  // 'https://'.length
    return 'DIRECT'
  }

  return FindProxyForURL
}

const findProxyForURL = urls2pac(
  urlDb.proxyBypassURLs, urlDb.redirectURLs.concat(urlDb.proxyURLs),
  'secure.uku.im:8443', 'HTTPS',
  'secure.uku.im:993', 'HTTPS'
)

function FindProxyForURL (url, host) {
  return findProxyForURL(`${url}/`, host)
}
