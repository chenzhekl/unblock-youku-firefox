Unblock Youku Firefox
---------------------

This is the port of the popular chrome extension [Unblock-Youku](https://github.com/uku/Unblock-Youku).

Currently in sync with Unblock Youku chrome v3.6.12.

Install
-------

[Firefox addon](https://addons.mozilla.org/en-US/firefox/addon/unblock-youku-firefox/)

Known issues
------------

Some websites may not function correctly now
============================================

See #6.

> I finally realized it's a bug of Firefox. Since Firefox doesn't provide the full path for proxy matching, the plugin is unable to find out wheter to use a proxy server for rules requiring full path (e.g. "http://v.youku.com/v_show/*"). There's nothing I can do but waiting for upstream fixes.


Use with uBlock Origin
======================

Unblock Youku may conflict with uBlock Origin on Windows. We have observed that uBlock Origin with default settings wrongly blocks connections of Bilibili which failed player loading. If you encountered similar problems, please try disabling uBlock Origin.

License
-------

This project is published under GNU Affero General Public License 3.0.
