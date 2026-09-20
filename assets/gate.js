/* BCSWomen Lovelace Colloquium — shared-password splash screen.
 *
 * READ THIS BEFORE RELYING ON IT.
 *
 * This is a "do not disturb" sign, not a lock. GitHub Pages serves static
 * files with no server behind them, so every check below runs in the
 * visitor's own browser, where they control everything. Specifically:
 *
 *   - The hash sits in this file, which anyone can open. A short password
 *     falls to an offline dictionary attack in seconds.
 *   - Disabling JavaScript skips the gate entirely.
 *   - The page HTML is already on the wire before this runs; the gate hides
 *     it visually, it does not withhold it.
 *   - The repository is public, so all of this content is readable on
 *     GitHub regardless of what happens here.
 *
 * It exists to stop casual visitors and search engines landing on a draft.
 * Never put anything genuinely confidential behind it. If that changes, the
 * site needs hosting that can authenticate server-side.
 */
(function () {
  'use strict';

  // SHA-256 of "username:password". Regenerate with:
  //   python3 -c "import hashlib;print(hashlib.sha256('user:pass'.encode()).hexdigest())"
  var CREDENTIAL_HASH =
    '11dcd583de419621be45e60d12464af16531f821198ab7a38cca851d65d11fe4';

  // sessionStorage, not localStorage: the gate re-arms when the browser
  // closes, so a shared or library machine is not left standing open.
  var STORAGE_KEY = 'lovelace-gate-unlocked';
  var HIDE_STYLE_ID = 'gate-hide-content';
  var OVERLAY_ID = 'gate-overlay';

  function isUnlocked() {
    try {
      return sessionStorage.getItem(STORAGE_KEY) === '1';
    } catch (err) {
      // Private browsing can throw on access. Fail closed.
      return false;
    }
  }

  function remember() {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch (err) {
      // Storage unavailable — the visitor re-enters it on the next page.
    }
  }

  if (isUnlocked()) {
    return;
  }

  // Hide the page as early as possible. This runs in <head>, before <body>
  // exists, so it targets body's children and spares the overlay we add
  // later — hiding <body> itself would hide the gate along with it.
  var hideStyle = document.createElement('style');
  hideStyle.id = HIDE_STYLE_ID;
  hideStyle.textContent =
    'body > *:not(#' + OVERLAY_ID + '){display:none !important;}' +
    'body{background:#F6F4EF !important;}';
  document.head.appendChild(hideStyle);

  var GATE_CSS = [
    '#' + OVERLAY_ID + '{position:fixed;inset:0;z-index:2147483647;',
    'display:flex;align-items:center;justify-content:center;padding:24px;',
    "background:#F6F4EF;color:#1B1F3B;font-family:'Inter',system-ui,sans-serif;}",
    '#' + OVERLAY_ID + ' .gate-card{width:100%;max-width:420px;}',
    '#' + OVERLAY_ID + ' .gate-eyebrow{font-size:13px;letter-spacing:.08em;',
    'text-transform:uppercase;color:#5B3E8C;margin:0 0 10px;}',
    '#' + OVERLAY_ID + " h1{font-family:'Fraunces',Georgia,serif;font-weight:500;",
    'font-size:clamp(26px,5vw,34px);line-height:1.15;margin:0 0 12px;}',
    '#' + OVERLAY_ID + ' .gate-intro{margin:0 0 24px;font-size:15px;line-height:1.55;',
    'color:rgba(27,31,59,0.75);}',
    '#' + OVERLAY_ID + ' label{display:block;font-size:13px;font-weight:600;',
    'margin:0 0 6px;}',
    '#' + OVERLAY_ID + ' input{width:100%;padding:11px 13px;margin:0 0 16px;',
    'font:inherit;font-size:16px;color:#1B1F3B;background:#fff;',
    'border:1px solid rgba(27,31,59,0.22);border-radius:8px;}',
    '#' + OVERLAY_ID + ' input:focus{outline:2px solid #5B3E8C;outline-offset:1px;',
    'border-color:#5B3E8C;}',
    '#' + OVERLAY_ID + ' button{width:100%;padding:12px 16px;font:inherit;',
    'font-weight:600;color:#fff;background:#1B1F3B;border:0;border-radius:999px;',
    'cursor:pointer;}',
    '#' + OVERLAY_ID + ' button:hover{background:#5B3E8C;}',
    '#' + OVERLAY_ID + ' button[disabled]{opacity:.6;cursor:default;}',
    '#' + OVERLAY_ID + ' .gate-error{min-height:20px;margin:12px 0 0;font-size:14px;',
    'color:#E4536D;}',
    '#' + OVERLAY_ID + ' .gate-note{margin:26px 0 0;padding-top:16px;font-size:13px;',
    'line-height:1.5;color:rgba(27,31,59,0.6);border-top:1px solid rgba(27,31,59,0.14);}'
  ].join('');

  function toHex(buffer) {
    return Array.prototype.map
      .call(new Uint8Array(buffer), function (b) {
        return b.toString(16).padStart(2, '0');
      })
      .join('');
  }

  function checkCredentials(username, password) {
    var encoded = new TextEncoder().encode(username + ':' + password);
    return crypto.subtle.digest('SHA-256', encoded).then(function (digest) {
      return toHex(digest) === CREDENTIAL_HASH;
    });
  }

  function unlock() {
    remember();
    var style = document.getElementById(HIDE_STYLE_ID);
    if (style) {
      style.remove();
    }
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
      overlay.remove();
    }
  }

  function buildGate() {
    var style = document.createElement('style');
    style.textContent = GATE_CSS;
    document.head.appendChild(style);

    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    overlay.innerHTML = [
      '<div class="gate-card">',
      '<p class="gate-eyebrow">Work in progress</p>',
      '<h1>BCSWomen Lovelace Colloquium</h1>',
      '<p class="gate-intro">This site is still being drafted. Enter the ',
      'shared details to take a look.</p>',
      '<form id="gate-form" novalidate>',
      '<label for="gate-username">Username</label>',
      '<input id="gate-username" name="username" type="text" autocomplete="off" ',
      'autocapitalize="none" autocorrect="off" spellcheck="false" required>',
      '<label for="gate-password">Password</label>',
      '<input id="gate-password" name="password" type="password" ',
      'autocomplete="current-password" required>',
      '<button type="submit">View the site</button>',
      '<p class="gate-error" role="alert" aria-live="polite"></p>',
      '</form>',
      '<p class="gate-note">A shared password that keeps the draft out of ',
      'search results and away from passers-by. It is not security — please ',
      "don't put anything confidential on these pages.</p>",
      '</div>'
    ].join('');
    document.body.appendChild(overlay);

    var form = overlay.querySelector('#gate-form');
    var usernameField = overlay.querySelector('#gate-username');
    var passwordField = overlay.querySelector('#gate-password');
    var errorLine = overlay.querySelector('.gate-error');
    var submit = overlay.querySelector('button');

    usernameField.focus();

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      errorLine.textContent = '';
      submit.disabled = true;

      checkCredentials(usernameField.value.trim(), passwordField.value)
        .then(function (ok) {
          if (ok) {
            unlock();
            return;
          }
          submit.disabled = false;
          errorLine.textContent = 'That username and password did not match.';
          passwordField.value = '';
          passwordField.focus();
        })
        .catch(function () {
          submit.disabled = false;
          // crypto.subtle needs a secure context: https, or localhost.
          errorLine.textContent =
            'This browser could not check the password. Open the site over https.';
        });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildGate);
  } else {
    buildGate();
  }
})();
