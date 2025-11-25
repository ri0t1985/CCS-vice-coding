document.addEventListener("DOMContentLoaded", function () {
  if (document.querySelector("footer.site-footer")) return;

  var footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.setAttribute("role", "contentinfo");

  footer.innerHTML = [
    '<div class="footer-content">',
    '  <div class="footer-section">',
    '    <h3>CCS Woerden</h3>',
    '    <p>Stationsplein 1<br>3445 AC Woerden<br>The Netherlands</p>',
    '  </div>',
    '  <div class="footer-section">',
    '    <h3>Contact</h3>',
    '    <p>Email: info@ccs.example<br>Phone: +31 30 123 4567</p>',
    '  </div>',
    '  <div class="footer-section">',
    '    <h3>Opening Hours</h3>',
    '    <p>Mon–Fri: 09:00–17:00<br>Sat–Sun: Closed</p>',
    '  </div>',
    '</div>',
    '<div class="footer-bottom">',
    '  <p>© ' + new Date().getFullYear() + ' CCS — Fruit Shop Demo</p>',
    '</div>'
  ].join("");

  document.body.appendChild(footer);
});


