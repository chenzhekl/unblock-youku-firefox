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

import { modes } from "../background_scripts/proxy_manager";

const runtime = browser.runtime;

window.onload = async () => {
  document.querySelector("#off").addEventListener("click", () => {
    runtime
      .sendMessage({
        target: "background",
        method: "setModeOff"
      })
      .then(() => {
        document.querySelector(".active").classList.remove("active");
        document.querySelector("#off").classList.toggle("active");
      });
  });
  document.querySelector("#lite").addEventListener("click", () => {
    runtime
      .sendMessage({
        target: "background",
        method: "setModeLite"
      })
      .then(() => {
        document.querySelector(".active").classList.remove("active");
        document.querySelector("#lite").classList.toggle("active");
      });
  });
  document.querySelector("#full").addEventListener("click", () => {
    runtime
      .sendMessage({
        target: "background",
        method: "setModeFull"
      })
      .then(() => {
        document.querySelector(".active").classList.remove("active");
        document.querySelector("#full").classList.toggle("active");
      });
  });

  const status = await browser.storage.local.get({
    mode: modes.OFF
  });

  const btn = document.querySelector(`#${status.mode.toLowerCase()}`);
  btn.classList.toggle("active");

  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.innerHTML = browser.i18n.getMessage(el.getAttribute("data-i18n"));
  });
};
