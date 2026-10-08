// Projects page: filters + mobile menu
(function () {
  var buttons = document.querySelectorAll('.pj-filter');
  var cards = document.querySelectorAll('.pj-card');
  var empty = document.getElementById('pjEmpty');

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.getAttribute('data-filter');
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      var shown = 0;
      cards.forEach(function (c) {
        var show = f === 'all' || c.getAttribute('data-cats').split(' ').indexOf(f) !== -1;
        c.hidden = !show;
        if (show) shown++;
      });
      empty.hidden = shown > 0;
    });
  });

  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('mainNav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('mobile-active');
      toggle.querySelector('i').className = open ? 'fas fa-times' : 'fas fa-bars';
    });
  }
})();
