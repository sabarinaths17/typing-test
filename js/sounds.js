/* ============================================================
   TYPEFORGE — TYPING SOUNDS (Web Audio API, no external files)
   ============================================================ */

'use strict';

let _sfxCtx = null;

let sfxType   = localStorage.getItem('tf_sfx_type') || 'off';
let sfxVolume = parseFloat(localStorage.getItem('tf_sfx_vol') || '0.6');

function setSfxType(t) {
  sfxType = t;
  localStorage.setItem('tf_sfx_type', t);
}

function setSfxVolume(v) {
  sfxVolume = v;
  localStorage.setItem('tf_sfx_vol', v);
}

function _getCtx() {
  if (!_sfxCtx) {
    _sfxCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (_sfxCtx.state === 'suspended') _sfxCtx.resume();
  return _sfxCtx;
}

function _noiseBuffer(ctx, dur) {
  const len = Math.ceil(ctx.sampleRate * dur);
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

function playSfx(isCorrect) {
  if (sfxType === 'off') return;
  try {
    const ctx = _getCtx();
    const t = ctx.currentTime;
    if (sfxType === 'mechanical') _mechClick(ctx, t, isCorrect);
    else if (sfxType === 'soft')  _softClick(ctx, t, isCorrect);
    else if (sfxType === 'typewriter') _twClick(ctx, t, isCorrect);
  } catch (_) { /* silently fail if audio blocked */ }
}

function _mechClick(ctx, t, ok) {
  const src  = ctx.createBufferSource();
  src.buffer = _noiseBuffer(ctx, 0.022);

  const filt = ctx.createBiquadFilter();
  filt.type  = 'bandpass';
  filt.frequency.value = ok ? 2200 : 800;
  filt.Q.value = 1.5;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(sfxVolume * 0.75, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.022);

  src.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
  src.start(t);
}

function _softClick(ctx, t, ok) {
  const osc  = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(ok ? 480 : 320, t);
  osc.frequency.exponentialRampToValueAtTime(ok ? 260 : 210, t + 0.07);
  gain.gain.setValueAtTime(sfxVolume * 0.10, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(t); osc.stop(t + 0.10);
}

function _twClick(ctx, t, ok) {
  // Two-part: sharp initial click + soft echo
  for (const [delay, mul] of [[0, 1], [0.038, 0.22]]) {
    const src  = ctx.createBufferSource();
    src.buffer = _noiseBuffer(ctx, 0.014);
    const filt = ctx.createBiquadFilter();
    filt.type  = 'bandpass';
    filt.frequency.value = ok ? 2600 : 1200;
    filt.Q.value = 2.5;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(sfxVolume * 0.65 * mul, t + delay);
    gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.014);
    src.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
    src.start(t + delay);
  }
}
