/* eslint-disable */

/*
 * No jQuery in my code!
 * No leaks in my code!
 * Saves us also more data by not importing jQuery
 * -TTtie 2018
 */

(function() {
  function a(b, c) {
    if (!this instanceof a) throw new Error("cn_cll_fnc");
    this.b = b;
    this.c = c;
  };
  a.prototype.apply = function() {
    var b = this;
    d(b.b)("click", function(a) {
      a.preventDefault();
      e(b.b)(f);
      e(b.c)(f);
    })
  };
  var g = function(a, b) {
      return a.bind(b);
    },
    b = document,
    c = b.querySelector.bind(b),
    d = function(a) {
      return g(a.addEventListener, a);
    },
    e = function(a) {
      var b = a.classList;
      return g(b.toggle, b);
    },
    f = "is-active";
  d(b)("DOMContentLoaded", function() {
    var n = new a(c(".navbar-burger"), c("#navbarMenuHeroA"));
    n.apply();
  })
})()
