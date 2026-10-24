/* Claim page for the Smart Cooking Oil Collection Box.
   Everything is simulated in the browser and kept in localStorage. */
(function (root) {
  'use strict';

  var SCOCB = root.SCOCB;
  var i18n = SCOCB.i18n;
  var t = i18n.t;
  var data = SCOCB.data;

  var ACCOUNTS_KEY = 'scocb.accounts';
  var CLAIMED_KEY = 'scocb.claimed';

  var VERIFY_DELAY_MS = 700;
  var EXPIRY_MS = 15 * 60 * 1000;
  var RESEND_SECONDS = 30;
  var SMS_DELAY_MS = 500;
  var SMS_VISIBLE_MS = 9000;
  var ML_PER_POINT = 10;
  var POINTS_PER_VOUCHER = 1000;
  var VOUCHER_RM = 5;
  var PHONE_PATTERN = /^(\+?60|0)?1\d{8,9}$/;

  /* Storage. Falls back to memory when localStorage is blocked, so the demo
     still works in private tabs. */

  var memory = {};
  var storage = {
    get: function (key, fallback) {
      try {
        var raw = root.localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) {
        return memory[key] !== undefined ? memory[key] : fallback;
      }
    },
    set: function (key, value) {
      memory[key] = value;
      try {
        root.localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
        /* kept in memory only */
      }
    }
  };

  /* Elements */

  function $(id) {
    return document.getElementById(id);
  }

  var views = {
    verify: $('view-verify'),
    info: $('view-info'),
    summary: $('view-summary'),
    otp: $('view-otp'),
    success: $('view-success'),
    status: $('view-status')
  };

  var state = {
    view: 'verify',
    status: null, // 'rejected' | 'claimed' | 'expired' | 'invalid'
    deposit: null,
    phone: '',
    code: '',
    voucherResult: null,
    factKey: null
  };

  /* Parsing and verifying the QR link */

  function parseInt10(value, pattern) {
    return typeof value === 'string' && pattern.test(value) ? parseInt(value, 10) : NaN;
  }

  function readParams(search) {
    var p = new URLSearchParams(search);
    var names = ['box', 'ml', 'pur', 'fill', 'tk', 'ts'];
    var any = names.some(function (n) {
      return p.has(n);
    });
    if (!any) return { empty: true };

    var boxId = (p.get('box') || '').trim().toUpperCase();
    var ml = parseInt10(p.get('ml'), /^\d{1,6}$/);
    var fill = parseInt10(p.get('fill'), /^\d{1,3}$/);
    var pur = p.get('pur');
    var tk = (p.get('tk') || '').trim().toUpperCase();
    var tsRaw = p.get('ts');
    var ts = tsRaw === null ? null : parseInt10(tsRaw, /^\d{9,11}$/);

    var valid =
      Object.prototype.hasOwnProperty.call(data.boxes, boxId) &&
      ml >= ML_PER_POINT &&
      fill <= 100 &&
      (pur === 'ok' || pur === 'water') &&
      /^[A-Z0-9]{4,32}$/.test(tk) &&
      (ts === null || !isNaN(ts));

    if (!valid) return { invalid: true };

    return {
      boxId: boxId,
      box: data.boxes[boxId],
      ml: ml,
      fill: fill,
      pur: pur,
      tk: tk,
      ts: ts
    };
  }

  function resolveState(search) {
    var d = readParams(search);
    if (d.empty) return { view: 'info' };
    if (d.invalid) return { view: 'status', status: 'invalid' };
    if (d.ts !== null && Date.now() - d.ts * 1000 > EXPIRY_MS) {
      return { view: 'status', status: 'expired' };
    }
    if (storage.get(CLAIMED_KEY, []).indexOf(d.tk) !== -1) {
      return { view: 'status', status: 'claimed' };
    }
    if (d.pur === 'water') return { view: 'status', status: 'rejected', deposit: d };
    return { view: 'summary', deposit: d };
  }

  /* Formatting helpers */

  function formatNumber(n) {
    return Number(n).toLocaleString('en-US');
  }

  function formatLitres(ml) {
    return String(Number((ml / 1000).toFixed(3)));
  }

  function formatTime(ms) {
    var locale = i18n.getLang() === 'ms' ? 'ms-MY' : 'en-MY';
    try {
      return new Intl.DateTimeFormat(locale, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ms));
    } catch (e) {
      return new Date(ms).toLocaleString();
    }
  }

  function pointsFor(ml) {
    return Math.floor(ml / ML_PER_POINT);
  }

  function fillLevel(fill) {
    if (fill >= 91) return 'red';
    if (fill >= 50) return 'yellow';
    return 'green';
  }

  function maskPhone(phone) {
    var national = phone.slice(3);
    var stars = new Array(Math.max(national.length - 4, 1) + 1).join('*');
    return '+60 ' + national.slice(0, 2) + ' ' + stars + ' ' + national.slice(-2);
  }

  function normalisePhone(raw) {
    var cleaned = raw.replace(/[\s-]/g, '');
    if (!PHONE_PATTERN.test(cleaned)) return null;
    return '+60' + cleaned.replace(/^(\+?60|0)/, '');
  }

  /* View switching */

  function showView(name) {
    Object.keys(views).forEach(function (key) {
      views[key].hidden = key !== name;
    });
    state.view = name;
    if (name !== 'otp') {
      stopResendTimer();
      hideSms();
    }
  }

  function focusHeading(view) {
    var h1 = view.querySelector('h1');
    if (h1) h1.focus({ preventScroll: true });
    root.scrollTo(0, 0);
  }

  /* Summary */

  function renderSummary() {
    var d = state.deposit;
    var pts = pointsFor(d.ml);
    var level = fillLevel(d.fill);

    $('sum-points').textContent = t('summary.points', { n: formatNumber(pts) });
    $('sum-points-sub').textContent = t('summary.points.sub', { vol: formatLitres(d.ml) });
    $('sum-area').textContent = d.box.area;
    $('sum-id').textContent = d.boxId;
    $('sum-spot').textContent = t(d.box.spotKey);
    $('sum-time').textContent = formatTime(d.ts !== null ? d.ts * 1000 : state.openedAt);
    $('sum-volume').textContent = formatLitres(d.ml) + ' L';

    var chip = $('sum-fill');
    chip.className = 'chip chip-' + level;
    chip.textContent = t('summary.fill.value', { n: d.fill });
    $('sum-fill-note').hidden = level !== 'red';
  }

  function showPhoneError(show) {
    var err = $('phone-error');
    err.hidden = !show;
    err.textContent = show ? t('claim.phone.error') : '';
    $('phone-wrap').classList.toggle('invalid', show);
    $('phone').setAttribute('aria-invalid', show ? 'true' : 'false');
  }

  $('claim-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var phone = normalisePhone($('phone').value);
    if (!phone) {
      showPhoneError(true);
      $('phone').focus();
      return;
    }
    showPhoneError(false);
    state.phone = phone;
    startOtp();
  });

  $('phone').addEventListener('input', function () {
    if (!$('phone-error').hidden) showPhoneError(false);
  });

  /* OTP */

  var otpInputs = Array.prototype.slice.call(document.querySelectorAll('.otp-input'));
  var resendTimer = null;
  var smsShowTimer = null;
  var smsHideTimer = null;

  function renderOtp() {
    $('otp-sent').textContent = t('otp.sent', { phone: maskPhone(state.phone) });
    otpInputs.forEach(function (input, i) {
      input.setAttribute('aria-label', t('otp.digit', { n: i + 1 }));
    });
    updateResendLabel();
    $('sms-text').textContent = t('sms.text', { code: state.code });
  }

  function newCode() {
    state.code = String(100000 + Math.floor(Math.random() * 900000));
  }

  function clearOtpInputs() {
    otpInputs.forEach(function (input) {
      input.value = '';
    });
    setOtpError('');
  }

  function setOtpError(message) {
    var err = $('otp-error');
    err.hidden = !message;
    err.textContent = message;
    $('otp-group').classList.toggle('invalid', !!message);
  }

  function startOtp() {
    newCode();
    clearOtpInputs();
    showView('otp');
    renderOtp();
    focusHeading(views.otp);
    otpInputs[0].focus();
    scheduleSms();
    startResendTimer();
  }

  var resendLeft = 0;

  function updateResendLabel() {
    var btn = $('otp-resend');
    btn.disabled = resendLeft > 0;
    btn.textContent = resendLeft > 0 ? t('otp.resend.wait', { s: resendLeft }) : t('otp.resend');
  }

  function stopResendTimer() {
    clearInterval(resendTimer);
    resendTimer = null;
  }

  function startResendTimer() {
    stopResendTimer();
    resendLeft = RESEND_SECONDS;
    updateResendLabel();
    resendTimer = setInterval(function () {
      resendLeft -= 1;
      if (resendLeft <= 0) {
        resendLeft = 0;
        stopResendTimer();
      }
      updateResendLabel();
    }, 1000);
  }

  function scheduleSms() {
    hideSms();
    $('sms-text').textContent = t('sms.text', { code: state.code });
    smsShowTimer = setTimeout(function () {
      $('sms-toast').classList.add('show');
      smsHideTimer = setTimeout(hideSms, SMS_VISIBLE_MS);
    }, SMS_DELAY_MS);
  }

  function hideSms() {
    clearTimeout(smsShowTimer);
    clearTimeout(smsHideTimer);
    $('sms-toast').classList.remove('show');
  }

  $('sms-close').addEventListener('click', hideSms);

  $('otp-resend').addEventListener('click', function () {
    if (resendLeft > 0) return;
    newCode();
    clearOtpInputs();
    otpInputs[0].focus();
    scheduleSms();
    startResendTimer();
  });

  $('otp-change').addEventListener('click', function () {
    state.code = '';
    showView('summary');
    renderSummary();
    focusHeading(views.summary);
    $('phone').focus();
  });

  function fillOtp(startIndex, digits) {
    var i = startIndex;
    for (var k = 0; k < digits.length && i < otpInputs.length; k++, i++) {
      otpInputs[i].value = digits.charAt(k);
    }
    otpInputs[Math.min(i, otpInputs.length - 1)].focus();
  }

  otpInputs.forEach(function (input, index) {
    input.addEventListener('focus', function () {
      input.select();
    });

    input.addEventListener('input', function () {
      var digits = input.value.replace(/\D/g, '');
      input.value = '';
      if (digits) fillOtp(index, digits);
      if (!$('otp-error').hidden) setOtpError('');
    });

    input.addEventListener('paste', function (e) {
      var text = (e.clipboardData || root.clipboardData).getData('text');
      var digits = String(text).replace(/\D/g, '');
      e.preventDefault();
      if (!digits) return;
      fillOtp(digits.length >= otpInputs.length ? 0 : index, digits);
      if (!$('otp-error').hidden) setOtpError('');
    });

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace' && !input.value && index > 0) {
        e.preventDefault();
        otpInputs[index - 1].value = '';
        otpInputs[index - 1].focus();
      } else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        otpInputs[index - 1].focus();
      } else if (e.key === 'ArrowRight' && index < otpInputs.length - 1) {
        e.preventDefault();
        otpInputs[index + 1].focus();
      }
    });
  });

  $('otp-form').addEventListener('submit', function (e) {
    e.preventDefault();
    var entered = otpInputs
      .map(function (input) {
        return input.value;
      })
      .join('');

    if (entered.length < otpInputs.length) {
      setOtpError(t('otp.error.incomplete'));
      return;
    }
    if (entered !== state.code) {
      setOtpError(t('otp.error.wrong'));
      var group = $('otp-group');
      group.classList.remove('shake');
      void group.offsetWidth;
      group.classList.add('shake');
      otpInputs.forEach(function (input) {
        input.value = '';
      });
      otpInputs[0].focus();
      return;
    }
    completeClaim();
  });

  /* Claim */

  function completeClaim() {
    var d = state.deposit;
    var claimed = storage.get(CLAIMED_KEY, []);

    if (claimed.indexOf(d.tk) !== -1) {
      showStatus('claimed');
      return;
    }

    var pts = pointsFor(d.ml);
    var accounts = storage.get(ACCOUNTS_KEY, {});
    var account = accounts[state.phone] || { points: 0, history: [] };
    account.points += pts;
    account.history.push({ tk: d.tk, box: d.boxId, ml: d.ml, pts: pts, at: Date.now() });
    accounts[state.phone] = account;
    claimed.push(d.tk);
    storage.set(ACCOUNTS_KEY, accounts);
    storage.set(CLAIMED_KEY, claimed);

    state.result = { added: pts, total: account.points };
    state.factKey = data.factKeys[Math.floor(Math.random() * data.factKeys.length)];
    showView('success');
    renderSuccess();
    focusHeading(views.success);
  }

  function renderSuccess() {
    var r = state.result;
    var vouchers = Math.floor(r.total / POINTS_PER_VOUCHER);
    var into = r.total % POINTS_PER_VOUCHER;

    $('suc-added').textContent = t('summary.points', { n: formatNumber(r.added) });
    $('suc-balance-label').textContent = t('success.balance', { phone: maskPhone(state.phone) });
    $('suc-balance').textContent = t('success.balance.value', { n: formatNumber(r.total) });

    var voucherKey = vouchers === 0 ? 'success.voucher.none' : vouchers === 1 ? 'success.voucher.one' : 'success.voucher.other';
    $('suc-voucher').textContent = t(voucherKey, { n: vouchers, rm: vouchers * VOUCHER_RM });

    var progress = $('suc-progress');
    progress.setAttribute('aria-valuenow', String(into));
    progress.setAttribute('aria-valuetext', formatNumber(into) + ' / ' + formatNumber(POINTS_PER_VOUCHER));
    $('suc-progress-bar').style.width = (into / POINTS_PER_VOUCHER) * 100 + '%';
    $('suc-left').textContent = t('success.progress.left', { n: formatNumber(POINTS_PER_VOUCHER - into) });

    var list = $('suc-shops');
    list.textContent = '';
    data.shops.forEach(function (shop) {
      var li = document.createElement('li');
      var name = document.createElement('span');
      var type = document.createElement('small');
      name.textContent = shop.name;
      type.textContent = t(shop.typeKey);
      li.appendChild(name);
      li.appendChild(type);
      list.appendChild(li);
    });

    $('suc-fact').textContent = t(state.factKey);
  }

  $('done-btn').addEventListener('click', function () {
    root.location.replace(root.location.pathname);
  });

  /* Status screens */

  var ICONS = {
    error:
      '<svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"><circle cx="22" cy="22" r="18"/><path d="M15 15l14 14M29 15L15 29"/></svg>',
    warn:
      '<svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round"><circle cx="22" cy="22" r="18"/><path d="M22 12v11l7 4"/></svg>'
  };

  var STATUS_ICON = { rejected: 'error', invalid: 'error', claimed: 'warn', expired: 'warn' };

  function showStatus(kind) {
    state.status = kind;
    showView('status');
    renderStatus();
    focusHeading(views.status);
  }

  function renderStatus() {
    var kind = state.status;
    var icon = $('status-icon');
    icon.className = 'status-icon ' + STATUS_ICON[kind];
    icon.innerHTML = ICONS[STATUS_ICON[kind]];
    $('status-title').textContent = t('status.' + kind + '.title');
    $('status-body').textContent = t('status.' + kind + '.body');

    var tips = $('status-tips');
    tips.textContent = '';
    tips.hidden = kind !== 'rejected';
    if (kind === 'rejected') {
      ['tip1', 'tip2', 'tip3'].forEach(function (key) {
        var li = document.createElement('li');
        li.textContent = t('status.rejected.' + key);
        tips.appendChild(li);
      });
    }
  }

  /* Language toggle */

  var langButtons = Array.prototype.slice.call(document.querySelectorAll('.lang button'));

  function syncLangButtons() {
    var current = i18n.getLang();
    langButtons.forEach(function (btn) {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-lang') === current));
    });
  }

  langButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      i18n.setLang(btn.getAttribute('data-lang'));
    });
  });

  i18n.onChange(function () {
    syncLangButtons();
    if (state.view === 'summary') {
      renderSummary();
      if (!$('phone-error').hidden) showPhoneError(true);
    } else if (state.view === 'otp') {
      renderOtp();
      if (!$('otp-error').hidden) setOtpError(t('otp.error.wrong'));
    } else if (state.view === 'success') {
      renderSuccess();
    } else if (state.view === 'status') {
      renderStatus();
    }
  });

  /* Start */

  function start() {
    i18n.init();
    syncLangButtons();
    state.openedAt = Date.now();

    var next = resolveState(root.location.search);
    state.deposit = next.deposit || null;

    setTimeout(function () {
      if (next.view === 'info') {
        showView('info');
        focusHeading(views.info);
      } else if (next.view === 'status') {
        showStatus(next.status);
      } else {
        showView('summary');
        renderSummary();
        focusHeading(views.summary);
      }
    }, VERIFY_DELAY_MS);
  }

  start();
})(window);
