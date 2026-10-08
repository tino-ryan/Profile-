// Services section: tutoring booking builder -> prefilled WhatsApp message
(function () {
  var form = document.getElementById('apexForm');
  if (!form) return;

  var WA = 'https://wa.me/27686567064?text=';
  var cta = document.getElementById('apexCta');
  var priceEl = document.getElementById('apexPrice');
  var syllabus = form.querySelector('.apex-syllabus');

  function value(name) {
    var el = form.querySelector('input[name="' + name + '"]:checked');
    return el ? el.value : '';
  }

  function update() {
    var grade = value('grade');
    var matric = grade === '12';
    syllabus.hidden = !matric;

    var price = matric ? 'R150' : 'R125';
    priceEl.textContent = price;

    var gradeText = matric ? 'Matric (' + value('syllabus') + ')' : 'Grade ' + grade;
    var msg =
      "Hi Tino, I'd like to book tutoring.\n" +
      'Grade: ' + gradeText + '\n' +
      'Subject: ' + value('subject') + '\n' +
      'Where: ' + (value('mode') === 'online' ? 'Online' : 'In person') + '\n' +
      'Price shown: from ' + price + '/hour';
    cta.href = WA + encodeURIComponent(msg);
  }

  form.addEventListener('change', update);
  form.addEventListener('submit', function (e) { e.preventDefault(); });
  update();
})();
