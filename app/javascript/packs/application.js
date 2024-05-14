/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb

import "core-js/stable";
import "regenerator-runtime/runtime";
import Tooltip from "tooltip.js";

jQuery(() => {
  M.AutoInit();
  Array.from(document.querySelectorAll("[data-tooltip]")).forEach((elem) => {
    new Tooltip(elem, {placement: "bottm-left", title: elem.dataset.tooltip});
  });
});

// Forward to home page if user is logged out
const logoutTimeoutId = setInterval(() => {
  // Ingnore on log in page
  if (window.location.pathname === "/users/sign_in") {
    return;
  }

  fetch("/logged_in.json")
    .then((response) => response.json())
    .then((data) => {
      const {logged_in} = data || {};
      if (!logged_in) {
        window.location = "/";
      }
    });
}, 1000 * 60 * 30);

const terminationEvent = "onpagehide" in self ? "pagehide" : "unload";
addEventListener(
  terminationEvent,
  (event) => {
    window.clearInterval(logoutTimeoutId);
  },
  {capture: true}
);
