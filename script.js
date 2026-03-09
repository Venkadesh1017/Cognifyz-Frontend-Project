********************Java Script Of The Code***************************



let clickCount = 0;

function changeColorRandom() {
  const hex = '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
  applyColor(hex, null);
}

function applyColor(hex, swatchEl) {
  const stage = document.getElementById('colorStage');
  stage.style.background   = hex + '22';
  stage.style.borderColor  = hex + '55';
  const display = document.getElementById('colorDisplay');
  display.textContent = hex;
  display.style.color = hex;
  clickCount++;
  document.getElementById('clickCount').textContent = `Clicks: ${clickCount}`;
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
  if (swatchEl) swatchEl.classList.add('active');
}

document.addEventListener('DOMContentLoaded', () => {
  const stage = document.getElementById('colorStage');
  if (stage) {
    stage.addEventListener('mousemove', (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      stage.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      stage.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
    });
  }
});

async function loadApiData() {
  const endpoint  = document.getElementById('apiEndpoint').value;
  const limit     = document.getElementById('apiLimit').value;
  const container = document.getElementById('apiContainer');

  container.innerHTML = `<div class="api-loader"><div class="spinner"></div><p>Fetching from JSONPlaceholder…</p></div>`;

  try {
    const res  = await fetch(`https://jsonplaceholder.typicode.com/${endpoint}?_limit=${limit}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    let html = '<div class="api-grid">';
    data.forEach((item, i) => { html += buildApiCard(item, endpoint, i); });
    html += '</div>';
    container.innerHTML = html;

    container.querySelectorAll('.api-card').forEach((card, i) => {
      card.style.animationDelay = `${i * 60}ms`;
    });
  } catch (err) {
    container.innerHTML = `<div class="api-error">⚠️ ${err.message}</div>`;
  }
}

function buildApiCard(item, type) {
  if (type === 'posts')
    return `<div class="api-card"><span class="api-card-id">#${item.id}</span><div class="api-card-title">${item.title}</div><div class="api-card-body">${item.body.substring(0,100)}…</div></div>`;
  if (type === 'users')
    return `<div class="api-card"><span class="api-card-id">User #${item.id}</span><div class="api-card-title">${item.name}</div><div class="api-card-email">✉ ${item.email}</div><div class="api-card-body" style="margin-top:8px;">🏢 ${item.company?.name ?? '—'}</div></div>`;
  if (type === 'todos')
    return `<div class="api-card" ${item.completed?'style="border-left:3px solid var(--clr-accent3);"':''}><span class="api-card-id">${item.completed?'✅ Done':'⏳ Pending'}</span><div class="api-card-title">${item.title}</div><div class="api-card-body">User ID: ${item.userId}</div></div>`;
  if (type === 'comments')
    return `<div class="api-card"><span class="api-card-id">Post #${item.postId}</span><div class="api-card-title">${item.name.substring(0,60)}</div><div class="api-card-email">✉ ${item.email}</div><div class="api-card-body" style="margin-top:8px;">${item.body.substring(0,80)}…</div></div>`;
  return '';
}

function validateField(input, regex, errMsg) {
  const fb  = document.getElementById(input.id + 'Feedback');
  const val = input.value.trim();
  if (!val)            { setFieldState(input, fb, null, '');               return false; }
  if (regex.test(val)) { setFieldState(input, fb, true, '✓ Looks good!'); return true;  }
  else                 { setFieldState(input, fb, false, '✕ ' + errMsg);  return false; }
}

function validateSelect(select) {
  const fb = document.getElementById(select.id + 'Feedback');
  if (select.value) { setFieldState(select, fb, true,  '✓ Domain selected');       return true;  }
  else              { setFieldState(select, fb, false, '✕ Please select a domain'); return false; }
}

function checkPasswordStrength(input) {
  const val   = input.value;
  const bar   = document.getElementById('strengthBar');
  const label = document.getElementById('strengthLabel');
  const fb    = document.getElementById('passwordFieldFeedback');
  let score   = 0;
  if (val.length >= 8)          score++;
  if (/[A-Z]/.test(val))        score++;
  if (/[0-9]/.test(val))        score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  if (!val.length) score = 0;
  const lvls = [
    { w:'0%',   bg:'transparent', lbl:'Strength: —'        },
    { w:'25%',  bg:'#f55b5b',     lbl:'Strength: Weak'     },
    { w:'50%',  bg:'#f5a45b',     lbl:'Strength: Fair'     },
    { w:'75%',  bg:'#5b6ef5',     lbl:'Strength: Good'     },
    { w:'100%', bg:'#5bf5c3',     lbl:'Strength: Strong 💪'},
  ];
  const l = lvls[score];
  bar.style.width      = l.w;
  bar.style.background = l.bg;
  label.textContent    = l.lbl;
  label.style.color    = l.bg === 'transparent' ? 'var(--clr-muted)' : l.bg;
  if (val.length >= 8 && score >= 2) setFieldState(input, fb, true,  '✓ Valid password');
  else if (val.length > 0)           setFieldState(input, fb, false, '✕ Min 8 chars with letters & numbers');
  else                               setFieldState(input, fb, null,  '');
}

function validateConfirmPassword(input) {
  const pass = document.getElementById('passwordField').value;
  const fb   = document.getElementById('confirmPasswordFeedback');
  if (!input.value)            { setFieldState(input, fb, null,  '');                    return; }
  if (input.value === pass)    { setFieldState(input, fb, true,  '✓ Passwords match');          }
  else                         { setFieldState(input, fb, false, '✕ Passwords do not match');   }
}

function setFieldState(input, fb, isValid, msg) {
  input.classList.remove('is-valid', 'is-invalid');
  fb.classList.remove('show', 'valid', 'invalid');
  if (isValid === true)  { input.classList.add('is-valid');   fb.classList.add('show', 'valid');   }
  if (isValid === false) { input.classList.add('is-invalid'); fb.classList.add('show', 'invalid'); }
  fb.textContent = msg;
}

function submitForm() {
  const fields = [
    { id:'firstName',  regex:/^[A-Za-z]{2,}$/,             err:'Min 2 letters' },
    { id:'lastName',   regex:/^[A-Za-z]{2,}$/,             err:'Min 2 letters' },
    { id:'emailField', regex:/^[^\s@]+@[^\s@]+\.[^\s@]+$/, err:'Valid email required' },
    { id:'phoneField', regex:/^[\+]?[\d\s\-]{10,15}$/,     err:'Valid phone required' },
  ];
  let ok = true;
  fields.forEach(f => {
    const el = document.getElementById(f.id);
    const fb = document.getElementById(f.id + 'Feedback');
    if (!validateField(el, f.regex, f.err)) {
      if (!el.value.trim()) setFieldState(el, fb, false, '✕ Required');
      ok = false;
    }
  });
  if (!validateSelect(document.getElementById('roleField'))) ok = false;
  const pw = document.getElementById('passwordField');
  if (pw.value.length < 8) { setFieldState(pw, document.getElementById('passwordFieldFeedback'), false, '✕ Min 8 chars'); ok = false; }
  const cp = document.getElementById('confirmPassword');
  if (cp.value !== pw.value || !cp.value) { setFieldState(cp, document.getElementById('confirmPasswordFeedback'), false, '✕ Passwords must match'); ok = false; }
  const agree = document.getElementById('agreeTerms');
  const agFb  = document.getElementById('agreeTermsFeedback');
  if (!agree.checked) { agFb.textContent = '✕ Must agree to terms'; agFb.className = 'feedback-msg show invalid'; ok = false; }
  else agFb.className = 'feedback-msg';
  if (ok) {
    const t = document.getElementById('successToast');
    t.classList.add('show');
    t.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }
}

const obs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

window.addEventListener('DOMContentLoaded', loadApiData);
