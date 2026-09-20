// BCSWomen Lovelace Colloquium — shared script for the standalone subpages.
// Currently just the countdown widget from the homepage, reused as-is on
// the 2027 page. Harmless to include on a page with no .countdown elements.

function updateCountdowns(){
  document.querySelectorAll('.countdown').forEach(function(el){
    var target = new Date(el.dataset.target).getTime();
    var now = Date.now();
    var diff = target - now;

    if(diff <= 0){
      el.classList.add('is-past');
      return;
    }

    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var minutes = Math.floor((diff % 3600000) / 60000);
    var seconds = Math.floor((diff % 60000) / 1000);

    el.querySelector('[data-unit="days"]').textContent = days;
    el.querySelector('[data-unit="hours"]').textContent = String(hours).padStart(2,'0');
    el.querySelector('[data-unit="minutes"]').textContent = String(minutes).padStart(2,'0');
    el.querySelector('[data-unit="seconds"]').textContent = String(seconds).padStart(2,'0');
  });
}
updateCountdowns();
setInterval(updateCountdowns, 1000);
