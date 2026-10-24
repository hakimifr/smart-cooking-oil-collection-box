/* English and Bahasa Melayu strings, plus a tiny translation helper. */
(function (root) {
  'use strict';

  var SCOCB = (root.SCOCB = root.SCOCB || {});
  var LANG_KEY = 'scocb.lang';
  var SUPPORTED = ['en', 'ms'];

  var STRINGS = {
    en: {
      'brand': 'Smart Cooking Oil Collection Box',
      'lang.label': 'Language',
      'footer': '\u00a9 2026 Smart Cooking Oil Collection Box \u00b7 Student prototype',

      'verify.text': 'Verifying your deposit\u2026',

      'info.title': 'Recycle your used cooking oil',
      'info.lead': 'Pour your used cooking oil into the box, scan the QR code on its screen and claim reward points.',
      'info.how': 'How it works',
      'info.s1.t': 'Pour the oil',
      'info.s1.d': 'Pour your used cooking oil into the Smart Cooking Oil Collection Box in your neighbourhood.',
      'info.s2.t': 'The box filters and checks it',
      'info.s2.d': 'A filter catches food residue and the box checks that the oil is not mixed with water.',
      'info.s3.t': 'Scan the QR code',
      'info.s3.d': 'Once the oil is measured, a QR code appears on the box screen. Scan it with your phone.',
      'info.s4.t': 'Claim points',
      'info.s4.d': 'Confirm your phone number with an SMS code and your points are added straight away.',
      'info.rewards': 'Rewards',
      'info.r1': 'Every 1 litre earns 100 points',
      'info.r2': 'Every 1,000 points is worth RM 5 off a purchase at selected partner shops',
      'info.why.t': 'Why it matters',
      'info.why.d': 'Oil poured down the sink cools and thickens inside pipes, which blocks drains and causes bad smells. It can also reach rivers. Recycled oil can become biodiesel instead.',

      'summary.title': 'Your deposit',
      'summary.points': '+{n} points',
      'summary.points.sub': 'for {vol} L of used cooking oil',
      'summary.box': 'Box',
      'summary.location': 'Location',
      'summary.time': 'Deposited',
      'summary.volume': 'Volume',
      'summary.purity': 'Purity',
      'summary.purity.ok': 'Purity check passed',
      'summary.fill': 'Box fill',
      'summary.fill.value': '{n}% full',
      'summary.fill.high': 'This box is almost full and will be emptied soon.',

      'claim.phone.label': 'Malaysian mobile number (+60)',
      'claim.phone.hint': 'We will send a 6-digit code by SMS. This is a demo, so no real SMS is sent.',
      'claim.phone.placeholder': '12-345 6789',
      'claim.phone.error': 'Enter a valid Malaysian mobile number, for example 012-345 6789.',
      'claim.button': 'Claim points',

      'otp.title': 'Enter your code',
      'otp.sent': 'We sent a 6-digit code to {phone}.',
      'otp.legend': '6-digit verification code',
      'otp.digit': 'Digit {n} of 6',
      'otp.confirm': 'Confirm',
      'otp.resend': 'Resend code',
      'otp.resend.wait': 'Resend code in {s}s',
      'otp.change': 'Change number',
      'otp.error.incomplete': 'Enter all 6 digits of the code.',
      'otp.error.wrong': 'That code is not correct. Please try again.',
      'otp.demo': 'Demo only. The code appears in the notification at the top of the screen.',
      'sms.text': 'SMS: Your Smart Cooking Oil Collection Box code is {code}',
      'sms.close': 'Dismiss notification',

      'success.title': 'Points claimed',
      'success.added': 'Points added',
      'success.balance': 'New balance for {phone}',
      'success.balance.value': '{n} points',
      'success.voucher.none': 'No voucher yet, keep recycling.',
      'success.voucher.one': 'You have 1 voucher ready (RM {rm})',
      'success.voucher.other': 'You have {n} vouchers ready (RM {rm})',
      'success.progress.label': 'Progress to your next voucher',
      'success.progress.left': '{n} points to your next RM 5 voucher',
      'success.shops.title': 'Use your voucher at partner shops',
      'success.shops.note': 'Fictional shops for this prototype. RM 5 off for every 1,000 points.',
      'success.fact.title': 'Did you know?',
      'success.done': 'Done',

      'status.home': 'See how it works',
      'status.rejected.title': 'Water detected, no points awarded',
      'status.rejected.body': 'The oil must be free of water and food scraps. Please empty the water out, pour only used cooking oil and try again.',
      'status.rejected.tip1': 'Pour only used cooking oil, with no water or drinks',
      'status.rejected.tip2': 'Drain off any water that has settled at the bottom',
      'status.rejected.tip3': 'Keep large food scraps out, the box filter handles small residue',
      'status.claimed.title': 'This deposit has already been claimed',
      'status.claimed.body': 'The points for this deposit were already added. Each deposit can only be claimed once.',
      'status.expired.title': 'QR code expired',
      'status.expired.body': 'This QR code has expired. Please deposit again or ask the box to show a new code.',
      'status.invalid.title': 'We couldn\u2019t read this QR code',
      'status.invalid.body': 'Please scan the QR code on the box screen again. If this keeps happening, make sure the whole link was scanned.',

      'spot.SCB-SI-03': 'Beside the community hall',
      'spot.SCB-BU-01': 'Next to the cafeteria row',
      'spot.SCB-TR-02': 'Near the playground',

      'shop.type.grocery': 'Grocery store',
      'shop.type.cafe': 'Cafe',
      'shop.type.minimart': 'Mini market',

      'fact.1': 'Used cooking oil cools and hardens inside pipes. Over time it traps other waste and blocks the whole drain.',
      'fact.2': 'Oil floats on water. When it reaches a river it forms a film that makes it harder for fish to get oxygen.',
      'fact.3': 'Collected used cooking oil can be turned into biodiesel instead of being thrown away.',
      'fact.4': 'Clogged drains cause bad smells and attract pests, and they are costly to clear.'
    },

    ms: {
      'brand': 'Smart Cooking Oil Collection Box',
      'lang.label': 'Bahasa',
      'footer': '\u00a9 2026 Smart Cooking Oil Collection Box \u00b7 Prototaip pelajar',

      'verify.text': 'Mengesahkan deposit anda\u2026',

      'info.title': 'Kitar semula minyak masak terpakai',
      'info.lead': 'Tuang minyak masak terpakai anda ke dalam kotak, imbas kod QR pada skrinnya dan tuntut mata ganjaran.',
      'info.how': 'Cara ia berfungsi',
      'info.s1.t': 'Tuang minyak',
      'info.s1.d': 'Tuang minyak masak terpakai anda ke dalam Smart Cooking Oil Collection Box di kawasan perumahan anda.',
      'info.s2.t': 'Kotak menapis dan menyemak',
      'info.s2.d': 'Penapis menahan sisa makanan dan kotak menyemak sama ada minyak itu bercampur dengan air.',
      'info.s3.t': 'Imbas kod QR',
      'info.s3.d': 'Selepas minyak disukat, kod QR akan dipaparkan pada skrin kotak. Imbas dengan telefon anda.',
      'info.s4.t': 'Tuntut mata',
      'info.s4.d': 'Sahkan nombor telefon anda dengan kod SMS dan mata anda terus ditambah.',
      'info.rewards': 'Ganjaran',
      'info.r1': 'Setiap 1 liter memberi anda 100 mata',
      'info.r2': 'Setiap 1,000 mata bernilai diskaun RM 5 untuk pembelian di kedai rakan kongsi terpilih',
      'info.why.t': 'Kenapa ini penting',
      'info.why.d': 'Minyak yang dituang ke dalam sinki akan sejuk dan pekat dalam paip, lalu menyumbat longkang dan menyebabkan bau busuk. Minyak itu juga boleh sampai ke sungai. Jika dikitar semula, minyak ini boleh dijadikan biodiesel.',

      'summary.title': 'Deposit anda',
      'summary.points': '+{n} mata',
      'summary.points.sub': 'untuk {vol} L minyak masak terpakai',
      'summary.box': 'Kotak',
      'summary.location': 'Lokasi',
      'summary.time': 'Masa deposit',
      'summary.volume': 'Isi padu',
      'summary.purity': 'Ketulenan',
      'summary.purity.ok': 'Semakan ketulenan lulus',
      'summary.fill': 'Tahap isi kotak',
      'summary.fill.value': '{n}% penuh',
      'summary.fill.high': 'Kotak ini hampir penuh dan akan dikosongkan tidak lama lagi.',

      'claim.phone.label': 'Nombor telefon bimbit Malaysia (+60)',
      'claim.phone.hint': 'Kami akan menghantar kod 6 digit melalui SMS. Ini hanya demo, jadi tiada SMS sebenar dihantar.',
      'claim.phone.placeholder': '12-345 6789',
      'claim.phone.error': 'Masukkan nombor telefon bimbit Malaysia yang sah, contohnya 012-345 6789.',
      'claim.button': 'Tuntut mata',

      'otp.title': 'Masukkan kod pengesahan',
      'otp.sent': 'Kami telah menghantar kod 6 digit ke {phone}.',
      'otp.legend': 'Kod pengesahan 6 digit',
      'otp.digit': 'Digit {n} daripada 6',
      'otp.confirm': 'Sahkan',
      'otp.resend': 'Hantar semula kod',
      'otp.resend.wait': 'Hantar semula kod dalam {s}s',
      'otp.change': 'Tukar nombor',
      'otp.error.incomplete': 'Masukkan kesemua 6 digit kod.',
      'otp.error.wrong': 'Kod itu tidak betul. Sila cuba lagi.',
      'otp.demo': 'Demo sahaja. Kod dipaparkan dalam pemberitahuan di bahagian atas skrin.',
      'sms.text': 'SMS: Kod pengesahan Smart Cooking Oil Collection Box anda ialah {code}',
      'sms.close': 'Tutup pemberitahuan',

      'success.title': 'Mata berjaya dituntut',
      'success.added': 'Mata ditambah',
      'success.balance': 'Baki baharu untuk {phone}',
      'success.balance.value': '{n} mata',
      'success.voucher.none': 'Belum ada baucar, teruskan mengitar semula.',
      'success.voucher.one': 'Anda ada 1 baucar yang sedia digunakan (RM {rm})',
      'success.voucher.other': 'Anda ada {n} baucar yang sedia digunakan (RM {rm})',
      'success.progress.label': 'Kemajuan ke baucar seterusnya',
      'success.progress.left': '{n} mata lagi untuk baucar RM 5 seterusnya',
      'success.shops.title': 'Guna baucar anda di kedai rakan kongsi',
      'success.shops.note': 'Kedai rekaan untuk prototaip ini. Diskaun RM 5 bagi setiap 1,000 mata.',
      'success.fact.title': 'Tahukah anda?',
      'success.done': 'Selesai',

      'status.home': 'Lihat cara ia berfungsi',
      'status.rejected.title': 'Air dikesan, tiada mata diberikan',
      'status.rejected.body': 'Minyak mestilah bebas daripada air dan sisa makanan. Sila buang air itu, tuang minyak masak terpakai sahaja dan cuba lagi.',
      'status.rejected.tip1': 'Tuang minyak masak terpakai sahaja, tanpa air atau minuman',
      'status.rejected.tip2': 'Buang air yang termendap di bahagian bawah',
      'status.rejected.tip3': 'Jangan masukkan sisa makanan yang besar, penapis kotak hanya menahan sisa yang kecil',
      'status.claimed.title': 'Deposit ini sudah dituntut',
      'status.claimed.body': 'Mata untuk deposit ini telah pun ditambah. Setiap deposit hanya boleh dituntut sekali.',
      'status.expired.title': 'Kod QR telah tamat tempoh',
      'status.expired.body': 'Kod QR ini telah tamat tempoh. Sila buat deposit sekali lagi atau minta kotak memaparkan kod baharu.',
      'status.invalid.title': 'Kami tidak dapat membaca kod QR ini',
      'status.invalid.body': 'Sila imbas semula kod QR pada skrin kotak. Jika masalah ini berterusan, pastikan seluruh pautan berjaya diimbas.',

      'spot.SCB-SI-03': 'Bersebelahan dewan komuniti',
      'spot.SCB-BU-01': 'Di sebelah deretan kafeteria',
      'spot.SCB-TR-02': 'Berhampiran taman permainan',

      'shop.type.grocery': 'Kedai runcit',
      'shop.type.cafe': 'Kafe',
      'shop.type.minimart': 'Pasar mini',

      'fact.1': 'Minyak masak terpakai akan sejuk dan mengeras dalam paip. Lama-kelamaan ia memerangkap sampah lain dan menyumbat seluruh longkang.',
      'fact.2': 'Minyak terapung di atas air. Apabila sampai ke sungai, ia membentuk lapisan nipis yang menyukarkan ikan mendapat oksigen.',
      'fact.3': 'Minyak masak terpakai yang dikumpulkan boleh dijadikan biodiesel dan bukannya dibuang begitu sahaja.',
      'fact.4': 'Longkang tersumbat menyebabkan bau busuk dan menarik makhluk perosak, malah kosnya mahal untuk dibersihkan.'
    }
  };

  var listeners = [];
  var lang = 'en';

  function readStoredLang() {
    try {
      var v = root.localStorage.getItem(LANG_KEY);
      return SUPPORTED.indexOf(v) !== -1 ? v : null;
    } catch (e) {
      return null;
    }
  }

  function detectLang() {
    var stored = readStoredLang();
    if (stored) return stored;
    var nav = String((root.navigator && root.navigator.language) || '').toLowerCase();
    return nav === 'ms' || nav.indexOf('ms-') === 0 ? 'ms' : 'en';
  }

  function t(key, vars) {
    var table = STRINGS[lang];
    var str = table[key] !== undefined ? table[key] : STRINGS.en[key];
    if (str === undefined) return key;
    return str.replace(/\{(\w+)\}/g, function (m, name) {
      return vars && vars[name] !== undefined ? vars[name] : m;
    });
  }

  function apply(scope) {
    var el;
    var i;
    var nodes = (scope || document).querySelectorAll('[data-i18n]');
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      el.textContent = t(el.getAttribute('data-i18n'));
    }
    nodes = (scope || document).querySelectorAll('[data-i18n-attr]');
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      // Format: "attribute:key", for example "aria-label:lang.label"
      var parts = el.getAttribute('data-i18n-attr').split(':');
      el.setAttribute(parts[0], t(parts[1]));
    }
  }

  function setLang(next) {
    if (SUPPORTED.indexOf(next) === -1) return;
    lang = next;
    try {
      root.localStorage.setItem(LANG_KEY, next);
    } catch (e) {
      /* storage unavailable, the choice just won't persist */
    }
    document.documentElement.lang = next === 'ms' ? 'ms' : 'en';
    apply(document);
    for (var i = 0; i < listeners.length; i++) listeners[i](next);
  }

  SCOCB.i18n = {
    t: t,
    apply: apply,
    setLang: setLang,
    getLang: function () {
      return lang;
    },
    onChange: function (fn) {
      listeners.push(fn);
    },
    init: function () {
      lang = detectLang();
      document.documentElement.lang = lang;
      apply(document);
    }
  };
})(window);
