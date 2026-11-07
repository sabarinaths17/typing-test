/* ============================================================
   TYPEFORGE — APPLICATION LOGIC
   ============================================================ */

'use strict';

// ---- Storage keys ----
const KEYS = {
  theme:    'tf_theme',
  results:  'tf_results',
  scores:   'tf_scores',
  username: 'tf_username',
};

// ---- Sentence counts per duration (each sentence ≈ 8-10 words) ----
const SENTENCE_COUNTS = { 30: 22, 60: 38, 120: 62, 180: 70, 0: 70 };

// ---- App state ----
let S = {
  view:         'home',
  theme:        localStorage.getItem(KEYS.theme) || 'dark',
  duration:     60,
  noTimeLimit:  false,
  difficulty:   'medium',
  // test runtime
  words:        [],
  typed:        [''],
  wordIdx:      0,
  ready:        false,
  active:       false,
  complete:     false,
  countdown:    false,
  startTime:    null,
  elapsed:      0,
  tickId:       null,
  timeLeft:     60,
  // last result
  lastResult:   null,
  // chart
  chartInst:    null,
  chartType:    'progress',
  // leaderboard filters
  lbCount:      5,
  lbDiff:       'all',
  lbDur:        'all',
  // settings panel
  settingsOpen: false,
};

// ---- DOM shortcuts ----
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

// ============================================================
//  BOOTSTRAP
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  applyTheme(S.theme);
  restoreSettings();
  setupListeners();
  prepareTest();
  showView('home');
});

// ============================================================
//  THEME
// ============================================================
function applyTheme(t) {
  S.theme = t;
  document.documentElement.dataset.theme = t;
  localStorage.setItem(KEYS.theme, t);
}

function toggleTheme() {
  applyTheme(S.theme === 'dark' ? 'light' : 'dark');
  if (S.chartInst) {
    S.chartInst.destroy();
    S.chartInst = null;
    renderChart(S.chartType);
  }
}

// ============================================================
//  NAVIGATION
// ============================================================
function showView(name) {
  S.view = name;
  $$('.view').forEach(v => v.classList.remove('active'));
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === name));
  const el = $(`view-${name}`);
  if (el) el.classList.add('active');

  if (name === 'home')        loadHome();
  if (name === 'analytics')   loadAnalytics();
  if (name === 'leaderboard') loadLeaderboard();
}

// ============================================================
//  SETTINGS
// ============================================================
function restoreSettings() {
  const savedName = localStorage.getItem(KEYS.username);
  if (savedName) $('usernameInput').value = savedName;
  // Restore sound settings
  if (typeof sfxType !== 'undefined') {
    updateSoundUI();
    const vol = $('sfxVolume');
    if (vol) vol.value = sfxVolume;
  }
}

function setDuration(d) {
  if (S.active) return;
  if (d === 'unlimited') {
    S.duration    = 0;
    S.noTimeLimit = true;
  } else {
    S.duration    = Number(d);
    S.noTimeLimit = false;
  }
  $$('#durationGroup .ctrl-btn').forEach(b => {
    const match = b.dataset.duration === 'unlimited'
      ? S.noTimeLimit
      : Number(b.dataset.duration) === S.duration && !S.noTimeLimit;
    b.classList.toggle('active', match);
  });
  prepareTest();
}

function setDifficulty(d) {
  if (S.active) return;
  S.difficulty = d;
  $$('#difficultyGroup .ctrl-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.difficulty === S.difficulty)
  );
  prepareTest();
}

function updateSoundUI() {
  $$('#sfxGroup .ctrl-btn').forEach(b =>
    b.classList.toggle('active', b.dataset.sfx === sfxType)
  );
}

// ============================================================
//  TEST SETUP
// ============================================================
function prepareTest() {
  clearInterval(S.tickId);
  clearTimeout(S._cdId);
  S.active    = false;
  S.complete  = false;
  S.countdown = false;
  S.ready     = true;
  S.typed     = [''];
  S.wordIdx   = 0;
  S.elapsed   = 0;
  S.timeLeft  = S.duration;
  S.startTime = null;

  const sentCount = SENTENCE_COUNTS[S.duration] || 70;
  S.words = generateWords(S.difficulty, sentCount);

  resetTimerUI();
  renderText();
  unlockControls();
  $('startHint').classList.remove('hidden');
  $('typingArea').classList.remove('focused');
  $('ghostInput').value = '';
  $('stopBtn').classList.add('hidden');
  updateLiveStats(0, 100);
}

// ============================================================
//  TEST START / TICK / END
// ============================================================
function startCountdown() {
  if (S.countdown || S.active || S.complete || !S.ready) return;
  S.countdown = true;
  $('startHint').classList.add('hidden');
  lockControls();
  focusGhost();

  const timerNum = $('timerNum');
  const steps = ['3', '2', '1', 'Go!'];
  let i = 0;

  function tick() {
    timerNum.textContent = steps[i];
    timerNum.classList.add('countdown-pulse');
    timerNum.addEventListener('animationend', () => timerNum.classList.remove('countdown-pulse'), { once: true });
    i++;
    if (i < steps.length) {
      S._cdId = setTimeout(tick, 700);
    } else {
      S._cdId = setTimeout(() => {
        S.countdown = false;
        startTest();
      }, 500);
    }
  }
  tick();
}

function startTest() {
  if (S.active || S.complete || !S.ready) return;
  S.active    = true;
  S.startTime = Date.now();
  $('startHint').classList.add('hidden');
  $('stopBtn').classList.remove('hidden');
  lockControls();

  const circumference = 2 * Math.PI * 42;
  const prog = $('timerProg');
  prog.style.strokeDasharray  = circumference;
  prog.style.strokeDashoffset = 0;

  if (S.noTimeLimit) {
    prog.classList.add('no-limit');
  }

  S.tickId = setInterval(() => {
    S.elapsed = (Date.now() - S.startTime) / 1000;

    if (S.noTimeLimit) {
      // Count up
      const secs = Math.floor(S.elapsed);
      const m = Math.floor(secs / 60), s = secs % 60;
      $('timerNum').textContent = m > 0 ? `${m}:${String(s).padStart(2,'0')}` : `${secs}`;
    } else {
      S.timeLeft = Math.max(0, S.duration - Math.floor(S.elapsed));
      const frac = S.timeLeft / S.duration;
      prog.style.strokeDashoffset = circumference * (1 - frac);
      $('timerNum').textContent   = S.timeLeft;

      const urgent = S.timeLeft <= 5;
      prog.classList.toggle('urgent', urgent);
      $('timerNum').classList.toggle('urgent', urgent);

      if (S.timeLeft <= 0) endTest();
    }

    updateLiveStats();
  }, 250);
}

function endTest() {
  clearInterval(S.tickId);
  S.active   = false;
  S.complete = true;
  $('stopBtn').classList.add('hidden');

  const wpm = calcWpm();
  const acc = calcAccuracy();

  S.lastResult = {
    id:         Date.now(),
    wpm,
    accuracy:   acc,
    difficulty: S.difficulty,
    duration:   S.duration,
    elapsed:    Math.round(S.elapsed),
    correct:    countCorrectChars(),
    errors:     countErrors(),
    date:       new Date().toISOString(),
  };

  saveResult(S.lastResult);
  showResults(S.lastResult);
}

function stopTest() {
  if (!S.active) return;
  endTest();
}

// ============================================================
//  STATS CALCULATION
// ============================================================
function calcWpm() {
  const mins = Math.max(S.elapsed, 1) / 60;
  return Math.round(countCorrectChars() / 5 / mins);
}

function calcAccuracy() {
  const total   = countTotalTyped();
  const correct = countCorrectChars();
  if (total === 0) return 100;
  return Math.max(0, Math.round((correct / total) * 100));
}

function countCorrectChars() {
  let n = 0;
  S.words.forEach((word, wi) => {
    const t = S.typed[wi] || '';
    for (let i = 0; i < Math.min(word.length, t.length); i++) {
      if (t[i] === word[i]) n++;
    }
    // Count the space between words as a correct char if word was advanced past
    if (wi < S.wordIdx) n++;
  });
  return Math.max(n, 0);
}

function countTotalTyped() {
  return S.typed.reduce((s, t) => s + t.length, 0) + Math.max(S.wordIdx, 0);
}

function countErrors() {
  let n = 0;
  S.words.forEach((word, wi) => {
    const t = S.typed[wi] || '';
    for (let i = 0; i < t.length; i++) {
      if (i >= word.length || t[i] !== word[i]) n++;
    }
  });
  return n;
}

function updateLiveStats(wpm, acc) {
  if (!S.active) return;
  const w = wpm !== undefined ? wpm : calcWpm();
  const a = acc !== undefined ? acc : calcAccuracy();
  $('liveWpm').textContent = w;
  $('liveAcc').textContent = a + '%';
}

// ============================================================
//  TEXT RENDERING
// ============================================================
function renderText() {
  const disp = $('textDisplay');
  disp.innerHTML = '';

  S.words.forEach((word, wi) => {
    // Word wrapper for error underline
    const wordGroup = document.createElement('span');
    wordGroup.className = 'word-group';
    wordGroup.dataset.wi = wi;

    // Each character in the word
    [...word].forEach((ch, ci) => {
      const span = document.createElement('span');
      span.className = 'char';
      span.dataset.wi = wi;
      span.dataset.ci = ci;
      span.textContent = ch;
      wordGroup.appendChild(span);
    });

    disp.appendChild(wordGroup);

    // Space after each word (except last) — outside the word-group
    if (wi < S.words.length - 1) {
      const sp = document.createElement('span');
      sp.className = 'char space-char';
      sp.dataset.wi = wi;
      sp.dataset.ci = word.length;
      sp.innerHTML = '&nbsp;'; // non-breaking renders reliably
      sp.style.display = 'inline';
      disp.appendChild(sp);
    }
  });

  updateDisplay();
}

function updateDisplay() {
  const disp = $('textDisplay');
  const wIdx = S.wordIdx;

  // Remove all state classes (preserve flash classes — those are transient)
  disp.querySelectorAll('.char').forEach(el => {
    el.classList.remove('correct','wrong','extra','cursor');
  });
  disp.querySelectorAll('.word-group').forEach(el => {
    el.classList.remove('has-error');
  });

  S.words.forEach((word, wi) => {
    const typed = S.typed[wi] || '';

    [...word].forEach((ch, ci) => {
      const el = disp.querySelector(`.char[data-wi="${wi}"][data-ci="${ci}"]`);
      if (!el) return;
      if (ci < typed.length) {
        el.classList.add(typed[ci] === ch ? 'correct' : 'wrong');
      } else if (wi === wIdx && ci === typed.length) {
        el.classList.add('cursor');
      }
    });

    // Mark completed words with errors using word-level underline
    if (wi < wIdx) {
      const hasError = typed !== word;
      if (hasError) {
        const wordGroupEl = disp.querySelector(`.word-group[data-wi="${wi}"]`);
        if (wordGroupEl) wordGroupEl.classList.add('has-error');
      }
    }

    // The space span after this word
    const spaceEl = disp.querySelector(`.space-char[data-wi="${wi}"]`);
    if (spaceEl) {
      if (wi < wIdx) {
        spaceEl.classList.add('correct');
      } else if (wi === wIdx && typed.length === word.length) {
        spaceEl.classList.add('cursor');
      }
    }
  });

  scrollToCurrentWord();
}

function scrollToCurrentWord() {
  const disp = $('textDisplay');
  const cursorEl = disp.querySelector('.cursor');
  if (!cursorEl) return;

  const lineH   = parseFloat(getComputedStyle(disp).lineHeight) || 42;
  const curTop  = cursorEl.offsetTop;
  // Keep cursor on the second visible line
  const targetY = Math.max(0, curTop - lineH);

  if (Math.abs(disp.scrollTop - targetY) > lineH * 0.4) {
    disp.scrollTop = targetY;
  }
}

// ============================================================
//  INPUT HANDLING
// ============================================================
function processKey(key, target) {
  if (!S.ready) return;
  if (S.countdown) return;
  if (!S.active) return;

  if (key === 'Backspace') {
    handleBackspace();
    if (typeof playSfx === 'function') playSfx(false);
  } else if (key === ' ') {
    handleSpace();
    if (typeof playSfx === 'function') playSfx(true);
  } else if (key.length === 1) {
    const word  = S.words[S.wordIdx] || '';
    const typed = S.typed[S.wordIdx] || '';
    const ok    = typed.length < word.length && key === word[typed.length];
    handleChar(key);
    if (typeof playSfx === 'function') playSfx(ok);
  }

  updateDisplay();
  updateLiveStats();
}

function handleChar(ch) {
  const word  = S.words[S.wordIdx] || '';
  const typed = S.typed[S.wordIdx] || '';

  // Limit overshoot to 8 extra chars
  if (typed.length >= word.length + 8) return;

  S.typed[S.wordIdx] = typed + ch;

  // Flash the char we just affected
  const ci  = typed.length;
  const el  = $('textDisplay').querySelector(`.char[data-wi="${S.wordIdx}"][data-ci="${ci}"]`);
  if (el) {
    const ok = ch === word[ci];
    el.classList.add(ok ? 'flash-ok' : 'flash-err');
    el.addEventListener('animationend', () => el.classList.remove('flash-ok','flash-err'), { once: true });
  }
}

function handleSpace() {
  // If at beginning of a word and nothing typed, skip
  if ((S.typed[S.wordIdx] || '').length === 0) return;
  // Advance to next word
  if (S.wordIdx < S.words.length - 1) {
    S.wordIdx++;
    if (!S.typed[S.wordIdx]) S.typed[S.wordIdx] = '';
  }
}

function handleBackspace() {
  const typed = S.typed[S.wordIdx] || '';
  if (typed.length > 0) {
    S.typed[S.wordIdx] = typed.slice(0, -1);
  } else if (S.wordIdx > 0) {
    // Backspace into previous word
    S.wordIdx--;
  }
}

// ============================================================
//  TIMER UI HELPERS
// ============================================================
function resetTimerUI() {
  const prog = $('timerProg');
  prog.classList.remove('urgent', 'no-limit');
  prog.style.strokeDashoffset = 0;
  $('timerNum').classList.remove('urgent');
  $('timerNum').textContent = S.noTimeLimit ? '∞' : S.duration;
}

function lockControls() {
  $('controls').classList.add('locked');
}
function unlockControls() {
  $('controls').classList.remove('locked');
}

// ============================================================
//  RESULTS SCREEN
// ============================================================
function showResults(r) {
  window.scrollTo(0, 0);
  $$('.view').forEach(v => v.classList.remove('active'));
  $('view-results').classList.add('active');

  const { emoji, label, cls } = getMascot(r.wpm);
  $('mascotEmoji').textContent = emoji;
  $('mascotLine').textContent  = label;
  $('mascotOrb').className     = `mascot-orb ${cls}`;

  $('resWpm').textContent      = r.wpm;
  $('resAcc').textContent      = r.accuracy + '%';
  $('resCorrect').textContent  = r.correct;
  $('resErrors').textContent   = r.errors;
  $('resDuration').textContent = r.noTimeLimit || r.duration === 0
    ? fmtTime(r.elapsed)
    : fmtDuration(r.duration);
  $('resElapsed').textContent  = fmtTime(r.elapsed);

  const pb = isPersonalBest(r);
  $('pbBadge').classList.toggle('hidden', !pb);

  $('saveNote').classList.add('hidden');
  $('saveScoreBtn').disabled = false;
}

function getMascot(wpm) {
  if (wpm < 20)  return { emoji: '🐌', label: 'Just getting started!',  cls: 'slow'      };
  if (wpm < 35)  return { emoji: '🐢', label: 'Keep practicing!',        cls: 'beginner'  };
  if (wpm < 55)  return { emoji: '🚶', label: 'Making progress!',         cls: 'average'   };
  if (wpm < 75)  return { emoji: '🏃', label: 'Nice speed!',              cls: 'good'      };
  if (wpm < 100) return { emoji: '⚡', label: 'Lightning fast!',          cls: 'great'     };
  if (wpm < 130) return { emoji: '🚀', label: 'Rocket fingers!',          cls: 'excellent' };
                 return { emoji: '🤖', label: 'Are you even human?!',     cls: 'legendary' };
}

function isPersonalBest(r) {
  const all = getResults()
    .filter(x => x.difficulty === r.difficulty && x.duration === r.duration && x.id !== r.id);
  if (all.length === 0) return false;
  return r.wpm > Math.max(...all.map(x => x.wpm));
}

// ============================================================
//  STORAGE — RESULTS
// ============================================================
function saveResult(r) {
  const all = getResults();
  all.push(r);
  if (all.length > 1000) all.splice(0, all.length - 1000);
  localStorage.setItem(KEYS.results, JSON.stringify(all));
}

function getResults() {
  try { return JSON.parse(localStorage.getItem(KEYS.results)) || []; }
  catch { return []; }
}

// ============================================================
//  STORAGE — SCORES (leaderboard)
// ============================================================
function saveScore(name, r) {
  const entry = {
    id:         Date.now(),
    name:       (name || 'Anonymous').trim().slice(0, 20) || 'Anonymous',
    wpm:        r.wpm,
    accuracy:   r.accuracy,
    difficulty: r.difficulty,
    duration:   r.duration,
    date:       r.date,
  };
  // Save locally always
  const scores = getScores();
  scores.push(entry);
  localStorage.setItem(KEYS.scores, JSON.stringify(scores));
  // Also push to Supabase if configured (fire and forget)
  if (typeof saveScoreCloud === 'function') saveScoreCloud(entry);
}

function getScores(filters = {}) {
  try {
    let s = JSON.parse(localStorage.getItem(KEYS.scores)) || [];
    if (filters.diff && filters.diff !== 'all') s = s.filter(x => x.difficulty === filters.diff);
    if (filters.dur  && filters.dur  !== 'all') s = s.filter(x => String(x.duration) === String(filters.dur));
    s.sort((a, b) => b.wpm - a.wpm);
    return s;
  } catch { return []; }
}

// ============================================================
//  HOME VIEW
// ============================================================
function loadHome() {
  const results    = getResults();
  const homeStats  = $('homeStats');
  const homeRecent = $('homeRecent');

  if (results.length === 0) {
    homeStats.classList.add('hidden');
    homeRecent.classList.add('hidden');
    return;
  }

  homeStats.classList.remove('hidden');
  homeRecent.classList.remove('hidden');

  const wmps = results.map(r => r.wpm);
  $('hBestWpm').textContent   = Math.max(...wmps);
  $('hAvgWpm').textContent    = Math.round(wmps.reduce((a,b)=>a+b,0)/wmps.length);
  $('hTotalTests').textContent = results.length;
  $('hLastWpm').textContent   = results[results.length - 1].wpm;

  const body = $('homeRecentBody');
  body.innerHTML = '';
  [...results].reverse().slice(0, 5).forEach(r => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td style="color:var(--primary-s);font-family:'JetBrains Mono',monospace;font-weight:700">${r.wpm}</td>
      <td>${r.accuracy}%</td>
      <td><span class="badge badge-${r.difficulty}">${r.difficulty}</span></td>
      <td>${fmtDuration(r.duration)}</td>
      <td style="color:var(--text-dim);font-size:0.8rem">${fmtDate(r.date)}</td>
    `;
    body.appendChild(tr);
  });
}

// ============================================================
//  SETTINGS PANEL
// ============================================================
function toggleSettings() {
  S.settingsOpen = !S.settingsOpen;
  $('settingsPanel').classList.toggle('open', S.settingsOpen);
}

function closeSettings() {
  S.settingsOpen = false;
  $('settingsPanel').classList.remove('open');
}

// ============================================================
//  ANALYTICS
// ============================================================
function loadAnalytics() {
  const results = getResults();

  if (results.length === 0) {
    $('analyticsEmpty').classList.remove('hidden');
    $('recentTable').classList.add('hidden');
    $('emptyChart').classList.remove('hidden');
    ['aBestWpm','aAvgWpm','aBestAcc','aTotalTests'].forEach(id => $(id).textContent = '–');
    $('aTotalTests').textContent = '0';
    return;
  }

  $('analyticsEmpty').classList.add('hidden');
  $('recentTable').classList.remove('hidden');
  $('emptyChart').classList.add('hidden');

  const wmps  = results.map(r => r.wpm);
  const accs  = results.map(r => r.accuracy);

  $('aBestWpm').textContent   = Math.max(...wmps);
  $('aAvgWpm').textContent    = Math.round(wmps.reduce((a,b)=>a+b,0)/wmps.length);
  $('aBestAcc').textContent   = Math.max(...accs) + '%';
  $('aTotalTests').textContent = results.length;

  renderChart(S.chartType);
  renderRecentTable(results);
}

function renderRecentTable(results) {
  const body  = $('recentBody');
  body.innerHTML = '';
  const slice = [...results].reverse().slice(0, 30);

  slice.forEach((r, i) => {
    const elapsedStr = r.elapsed ? fmtTime(r.elapsed) : fmtDuration(r.duration);
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td style="color:var(--primary-s);font-family:'JetBrains Mono',monospace;font-weight:700">${r.wpm}</td>
      <td>${r.accuracy}%</td>
      <td><span class="badge badge-${r.difficulty}">${r.difficulty}</span></td>
      <td>${fmtDuration(r.duration)}</td>
      <td style="font-family:'JetBrains Mono',monospace;font-size:0.82rem;color:var(--text-dim)">${elapsedStr}</td>
      <td style="color:var(--text-dim);font-size:0.8rem">${fmtDate(r.date)}</td>
    `;
    body.appendChild(tr);
  });
}

function renderChart(type) {
  S.chartType = type;

  $$('.chart-tog').forEach(b => b.classList.toggle('active', b.dataset.chart === type));

  const results = getResults();
  const ctx     = $('mainChart').getContext('2d');
  const isDark  = S.theme === 'dark';

  const gridColor  = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)';
  const labelColor = isDark ? '#4a5272' : '#8891b8';
  const tickColor  = isDark ? '#2a2e48' : '#ced2e6';

  if (S.chartInst) { S.chartInst.destroy(); S.chartInst = null; }

  if (results.length === 0) return;

  Chart.defaults.color = labelColor;

  const baseOptions = {
    responsive: true,
    maintainAspectRatio: true,
    animation: { duration: 400 },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDark ? '#16162a' : '#ffffff',
        titleColor:   isDark ? '#dde2ef' : '#1a1d2e',
        bodyColor:    isDark ? '#4a5272' : '#8891b8',
        borderColor:  isDark ? '#1e1e38' : '#e2e5f0',
        borderWidth:  1,
        padding:      10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: { grid: { color: gridColor }, ticks: { color: labelColor } },
      y: { grid: { color: gridColor }, ticks: { color: labelColor }, beginAtZero: true },
    },
  };

  let config;

  if (type === 'progress') {
    const recent = results.slice(-20);
    config = {
      type: 'line',
      data: {
        labels: recent.map((_, i) => `#${results.length - recent.length + i + 1}`),
        datasets: [
          {
            label: 'WPM',
            data: recent.map(r => r.wpm),
            borderColor: '#8b5cf6',
            backgroundColor: isDark ? 'rgba(139,92,246,0.08)' : 'rgba(124,58,237,0.06)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#8b5cf6',
            pointRadius: 4,
            pointHoverRadius: 6,
          },
          {
            label: 'Accuracy',
            data: recent.map(r => r.accuracy),
            borderColor: '#10b981',
            backgroundColor: 'transparent',
            tension: 0.4,
            borderDash: [4, 4],
            pointBackgroundColor: '#10b981',
            pointRadius: 3,
            pointHoverRadius: 5,
          },
        ],
      },
      options: {
        ...baseOptions,
        plugins: {
          ...baseOptions.plugins,
          legend: { display: true, labels: { color: labelColor, usePointStyle: true, pointStyleWidth: 8 } },
        },
      },
    };
  } else if (type === 'difficulty') {
    const diffs = ['easy', 'medium', 'hard'];
    const avgs  = diffs.map(d => {
      const sub = results.filter(r => r.difficulty === d);
      if (!sub.length) return 0;
      return Math.round(sub.reduce((a, b) => a + b.wpm, 0) / sub.length);
    });
    config = {
      type: 'bar',
      data: {
        labels: ['Easy', 'Medium', 'Hard'],
        datasets: [{
          label: 'Avg WPM',
          data: avgs,
          backgroundColor: ['rgba(16,185,129,0.7)','rgba(245,158,11,0.7)','rgba(248,113,113,0.7)'],
          borderColor:     ['#10b981','#f59e0b','#f87171'],
          borderWidth: 2,
          borderRadius: 6,
        }],
      },
      options: { ...baseOptions },
    };
  } else if (type === 'duration') {
    const durs  = [30, 60, 120, 180];
    const labels = ['30s','1 min','2 min','3 min'];
    const avgs   = durs.map(d => {
      const sub = results.filter(r => r.duration === d);
      if (!sub.length) return 0;
      return Math.round(sub.reduce((a, b) => a + b.wpm, 0) / sub.length);
    });
    config = {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Avg WPM',
          data: avgs,
          backgroundColor: 'rgba(139,92,246,0.7)',
          borderColor:     '#8b5cf6',
          borderWidth: 2,
          borderRadius: 6,
        }],
      },
      options: { ...baseOptions },
    };
  }

  S.chartInst = new Chart(ctx, config);
}

// ============================================================
//  LEADERBOARD
// ============================================================
function loadLeaderboard() {
  renderLeaderboard();
}

async function renderLeaderboard() {
  const body = $('lbBody');
  body.innerHTML = '<tr><td colspan="7" style="text-align:center;color:var(--text-dim);padding:1.5rem;font-size:0.85rem">Loading...</td></tr>';

  let scores;
  if (typeof getScoresCloud === 'function') {
    const cloud = await getScoresCloud({ diff: S.lbDiff, dur: S.lbDur }, S.lbCount);
    // Merge cloud + local, deduplicate by name+wpm+date approximation, sort
    const local = getScores({ diff: S.lbDiff, dur: S.lbDur });
    const merged = [...cloud, ...local];
    const seen = new Set();
    scores = merged
      .filter(s => { const k = `${s.name}|${s.wpm}|${s.accuracy}`; if (seen.has(k)) return false; seen.add(k); return true; })
      .sort((a, b) => b.wpm - a.wpm)
      .slice(0, S.lbCount);
  } else {
    scores = getScores({ diff: S.lbDiff, dur: S.lbDur }).slice(0, S.lbCount);
  }

  body.innerHTML = '';

  if (scores.length === 0) {
    $('lbEmpty').classList.remove('hidden');
    $('lbTable').classList.add('hidden');
    return;
  }
  $('lbEmpty').classList.add('hidden');
  $('lbTable').classList.remove('hidden');

  scores.forEach((s, i) => {
    const rank = i + 1;
    const medal = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank;
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="rank-${rank <= 3 ? rank : ''}" style="font-family:'JetBrains Mono',monospace;font-weight:700">${medal}</td>
      <td style="font-weight:600">${escHtml(s.name)}</td>
      <td style="color:var(--primary-s);font-family:'JetBrains Mono',monospace;font-weight:700">${s.wpm}</td>
      <td>${s.accuracy}%</td>
      <td><span class="badge badge-${s.difficulty}">${s.difficulty}</span></td>
      <td style="font-family:'JetBrains Mono',monospace;font-size:0.8rem">${fmtDuration(s.duration)}</td>
      <td style="color:var(--text-dim);font-size:0.8rem">${fmtDate(s.date)}</td>
    `;
    body.appendChild(tr);
  });
}

// ============================================================
//  HELPERS
// ============================================================
function fmtDuration(s) {
  if (!s || s === 0) return '∞';
  if (s < 60) return `${s}s`;
  return `${s / 60} min`;
}

function fmtTime(secs) {
  if (!secs) return '0s';
  if (secs < 60) return `${secs}s`;
  const m = Math.floor(secs / 60), s = secs % 60;
  return s > 0 ? `${m}m ${s}s` : `${m}m`;
}

function fmtDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, { month:'short', day:'numeric', year:'2-digit' });
  } catch { return ''; }
}

function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

// ============================================================
//  EVENT LISTENERS
// ============================================================

// Track ghost input value for input-event diffing
let _ghostPrev = '';

function focusGhost() {
  $('typingArea').classList.add('focused');
  $('ghostInput').focus();
}

function setupListeners() {

  // Theme toggle
  $('themeToggle').addEventListener('click', toggleTheme);

  // Settings panel
  $('settingsBtn').addEventListener('click', e => {
    e.stopPropagation();
    toggleSettings();
  });
  document.addEventListener('click', e => {
    if (S.settingsOpen && !$('settingsPanel').contains(e.target) && e.target !== $('settingsBtn')) {
      closeSettings();
    }
  });

  // Sound type buttons
  $$('#sfxGroup .ctrl-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      setSfxType(btn.dataset.sfx);
      updateSoundUI();
      const volRow = $('sfxVolRow');
      if (volRow) volRow.classList.toggle('hidden', sfxType === 'off');
    })
  );

  // Volume slider
  const vol = $('sfxVolume');
  if (vol) {
    vol.addEventListener('input', () => setSfxVolume(parseFloat(vol.value)));
    // Show/hide volume row based on current sfxType
    const volRow = $('sfxVolRow');
    if (volRow) volRow.classList.toggle('hidden', sfxType === 'off');
  }

  // Nav
  $$('.nav-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      if (S.active) return;
      showView(btn.dataset.view);
    })
  );

  // Duration buttons (including "unlimited")
  $$('#durationGroup .ctrl-btn').forEach(btn =>
    btn.addEventListener('click', () => setDuration(btn.dataset.duration))
  );

  // Difficulty buttons
  $$('#difficultyGroup .ctrl-btn').forEach(btn =>
    btn.addEventListener('click', () => setDifficulty(btn.dataset.difficulty))
  );

  // Typing area click → focus ghost input
  $('typingArea').addEventListener('click', () => {
    if (S.complete) return;
    focusGhost();
  });

  // Document keydown: focus ghost + handle special keys
  document.addEventListener('keydown', e => {
    if (S.view !== 'test' && !$('view-results').classList.contains('active')) return;
    if (S.complete) {
      if (e.key === 'Tab') { e.preventDefault(); retryTest(); }
      return;
    }
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    const ignore = ['Shift','CapsLock','Tab','Escape','Enter',
      'ArrowUp','ArrowDown','ArrowLeft','ArrowRight',
      'Home','End','PageUp','PageDown','Insert',
      'F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12'];
    if (ignore.includes(e.key)) return;

    // If test not started yet, trigger countdown on any key press
    if (!S.active && !S.complete && !S.countdown) {
      e.preventDefault();
      startCountdown();
      return;
    }

    // Focus ghost so input events route there
    if (document.activeElement !== $('ghostInput')) focusGhost();
    // For backspace/space/delete handle immediately (before input event fires)
    if (e.key === 'Backspace' || e.key === 'Delete') {
      e.preventDefault();
      processKey('Backspace');
      _ghostPrev = $('ghostInput').value;
      return;
    }
    // Regular chars: let the keydown default update the ghost input value,
    // then the input event will pick it up. But prevent browser shortcuts.
    if (e.key.length === 1) {
      e.preventDefault();
      // Manually feed since preventDefault blocks input event
      processKey(e.key);
      _ghostPrev = $('ghostInput').value;
    }
  });

  // Ghost input: input event (fires from automation tools like CDP insertText)
  $('ghostInput').addEventListener('input', () => {
    const cur   = $('ghostInput').value;
    const prev  = _ghostPrev;

    if (cur.length > prev.length) {
      // Characters were inserted
      const added = cur.slice(prev.length);
      for (const ch of added) {
        if (ch === ' ') processKey(' ');
        else if (ch.length === 1) processKey(ch);
      }
    } else if (cur.length < prev.length) {
      // Characters removed (backspace via input)
      const removed = prev.length - cur.length;
      for (let i = 0; i < removed; i++) processKey('Backspace');
    }

    _ghostPrev = cur;

    // Keep ghost input from growing too long
    if (cur.length > 30) {
      $('ghostInput').value = '';
      _ghostPrev = '';
    }
  });

  // Ghost input keydown: space only (backspace is handled by document keydown above)
  $('ghostInput').addEventListener('keydown', e => {
    if (e.key === ' ') {
      e.preventDefault();
      processKey(' ');
      _ghostPrev = $('ghostInput').value;
    }
  });

  // Stop / Restart buttons
  $('stopBtn').addEventListener('click', stopTest);
  $('restartBtn').addEventListener('click', retryTest);

  // Hero start button
  $('heroStartBtn').addEventListener('click', () => showView('test'));

  // Retry button
  $('retryBtn').addEventListener('click', retryTest);

  // View analytics from results
  $('toAnalyticsBtn').addEventListener('click', () => showView('analytics'));

  // Save score
  $('saveScoreBtn').addEventListener('click', () => {
    if (!S.lastResult) return;
    const name = $('usernameInput').value.trim();
    localStorage.setItem(KEYS.username, name);
    saveScore(name, S.lastResult);
    $('saveScoreBtn').disabled = true;
    $('saveNote').classList.remove('hidden');
  });

  // Chart toggles
  $$('.chart-tog').forEach(btn =>
    btn.addEventListener('click', () => renderChart(btn.dataset.chart))
  );

  // Leaderboard count
  $$('#lbCountGroup .ctrl-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      $$('#lbCountGroup .ctrl-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      S.lbCount = Number(btn.dataset.lbCount);
      renderLeaderboard();
    })
  );

  // Leaderboard difficulty filter
  $$('#lbDiffGroup .ctrl-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      $$('#lbDiffGroup .ctrl-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      S.lbDiff = btn.dataset.lbDiff;
      renderLeaderboard();
    })
  );

  // Leaderboard duration filter
  $$('#lbDurGroup .ctrl-btn').forEach(btn =>
    btn.addEventListener('click', () => {
      $$('#lbDurGroup .ctrl-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      S.lbDur = btn.dataset.lbDur;
      renderLeaderboard();
    })
  );
}

// ============================================================
//  RETRY
// ============================================================
function retryTest() {
  window.scrollTo(0, 0);
  $$('.view').forEach(v => v.classList.remove('active'));
  $$('.nav-btn').forEach(b => b.classList.toggle('active', b.dataset.view === 'test'));
  $('view-test').classList.add('active');
  S.view = 'test';
  prepareTest();
}
