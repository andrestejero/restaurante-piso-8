(function () {
  var navWrap = document.querySelector('.catnav-wrap');
  var nav = document.getElementById('catnav');
  var buttons = Array.prototype.slice.call(document.querySelectorAll('#catnav button'));
  var sections = buttons.map(function (b) { return document.getElementById(b.dataset.target); });

  function navOffset() {
    return navWrap.offsetHeight + 8;
  }

  // Scrolls only the horizontal pill bar, never the page — keeps this
  // independent from the vertical window scroll below so they can't cancel each other.
  function centerPill(btn) {
    var target = (btn.offsetLeft + btn.offsetWidth / 2) - nav.clientWidth / 2;
    nav.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }

  function setActive(index) {
    buttons.forEach(function (b, i) { b.classList.toggle('active', i === index); });
    centerPill(buttons[index]);
  }

  buttons.forEach(function (btn, i) {
    btn.addEventListener('click', function () {
      var target = sections[i];
      if (!target) return;
      setActive(i);
      var top = target.getBoundingClientRect().top + window.scrollY - navOffset();
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  function currentSectionIndex() {
    var offset = navOffset() + 1;
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) return sections.length - 1;

    var index = 0;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].getBoundingClientRect().top - offset <= 0) index = i;
    }
    return index;
  }

  var ticking = false;
  function onScroll() {
    ticking = false;
    var index = currentSectionIndex();
    if (!buttons[index].classList.contains('active')) setActive(index);
  }

  window.addEventListener('scroll', function () {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(onScroll);
    }
  }, { passive: true });

  onScroll();

  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) entry.target.classList.add('in-view');
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.section.reveal').forEach(function (s) { revealObserver.observe(s); });
  }
})();
