const ca = '8F3oV5RtUBfYfqqmHLW8YZxKx9JXE1zeyLm8NZfyQUCB';
document.querySelectorAll('[data-trade]').forEach(a => a.href = `https://jup.ag/swap/SOL-${ca}`);
document.querySelectorAll('[data-chart]').forEach(a => a.href = `https://dexscreener.com/solana/${ca}`);
document.querySelector('#year').textContent = new Date().getFullYear();
let timer;
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
  const toast = document.querySelector('#toast');
  try {
    await navigator.clipboard.writeText(ca);
    toast.textContent = 'Freshly copied. Contract address is on your clipboard!';
  } catch {
    toast.textContent = 'Copy this address manually from the contract panel.';
    const code = document.querySelector('code');
    const range = document.createRange(); range.selectNodeContents(code);
    const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
    code.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
  toast.classList.add('visible'); clearTimeout(timer);
  timer = setTimeout(() => toast.classList.remove('visible'), 4000);
}));

// Decorative movement is optional; gameplay starts only after an explicit click.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reducedMotion && 'IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.story-copy,.cards article,.buy>div,.game-info').forEach(el => { el.classList.add('reveal'); observer.observe(el); });
}
const board = document.querySelector('#game-board');
const bag = document.querySelector('#game-bag');
const start = document.querySelector('#game-start');
const status = document.querySelector('#game-status');
const scoreEl = document.querySelector('#game-score');
const timeEl = document.querySelector('#game-time');
const speedEl = document.querySelector('#game-speed');
const end = document.querySelector('#game-end');
const livesEl = document.querySelector('#game-lives');
const bestEl = document.querySelector('#game-best');
const idle = document.querySelector('#game-idle');
let best = 0;
try { best = Math.max(0, Number(localStorage.getItem('frise-crypto-best')) || 0); } catch {}
bestEl.textContent = best;
const comboEl = document.querySelector('#game-combo');
let streak = 0, lives = 3, nextLifeAt = 0;
let playing = false, score = 0, x = .5, items = [], previous = 0, elapsed = 0, spawnClock = 0, frame;
const held = new Set();
function moveTo(next) {
  const width = board.clientWidth;
  x = Math.max(39 / width, Math.min(1 - 39 / width, next));
  bag.style.left = `${x * 100}%`;
}
function saveBest() {
  if (score > best) { best = score; bestEl.textContent = best; try { localStorage.setItem('frise-crypto-best', String(best)); } catch {} }
}
function finish(message, gameOver = false) {
  end.hidden = true;
  playing = false; cancelAnimationFrame(frame); held.clear();
  items.forEach(item => item.el.remove()); items = [];
  board.classList.remove('playing');
  saveBest();
  idle.hidden = false;
  idle.innerHTML = `${gameOver ? 'GAME OVER.' : 'ROUND COMPLETE.'}<small>Your bag: ${score} points. Back to the trenches?</small>`;
  status.textContent = message || `Bag secured! You scored ${score} points. ${score >= 150 ? 'Certified golden.' : 'Another shift? You got this.'}`;
  start.textContent = 'PLAY AGAIN →';
}
function tick(now) {
  if (!playing) return;
  const dt = Math.min((now - previous) / 1000, .05); previous = now; elapsed += dt;
  timeEl.textContent = Math.floor(elapsed);
  const difficulty = 1 + elapsed / 30;
  speedEl.textContent = `${difficulty.toFixed(1)}×`;
  const width = board.clientWidth, height = board.clientHeight;
  const direction = Number(held.has('right')) - Number(held.has('left'));
  moveTo(x + direction * dt * .85);
  spawnClock += dt;
  if (spawnClock >= .48 / Math.sqrt(difficulty)) {
    spawnClock = 0;
    const roll = Math.random();
    const bad = roll < .22;
    const kind = bad ? 'rug' : roll < .45 ? 'sol' : 'fry';
    const el = document.createElement('div'); el.className = `falling ${kind}`; el.textContent = kind === 'rug' ? 'RUG' : kind === 'sol' ? 'SOL' : '';  el.setAttribute('aria-hidden', 'true'); board.append(el);
    items.push({ el, bad, kind, x: .06 + Math.random() * .88, y: -40, speed: 130 + Math.random() * 60 });
  }
  if (elapsed >= nextLifeAt) {
    const el = document.createElement('div');
    el.className = 'falling life'; el.textContent = '♥'; el.setAttribute('aria-hidden', 'true'); board.append(el);
    items.push({ el, bad: false, kind: 'life', x: .06 + Math.random() * .88, y: -40, speed: 130 + Math.random() * 60 });
    nextLifeAt = elapsed + 15 + Math.random() * 15;
  }
  items = items.filter(item => {
    if (lives === 0) return true;
    const previousY = item.y;
    item.y += item.speed * difficulty * dt;
    const ix = item.x * width;
    item.el.style.transform = `translate(${ix}px,${item.y}px) rotate(${item.bad ? -15 : 18}deg)`;
    const bottom = item.y + (item.bad ? 34 : 38);
    if (bottom >= height - 79 && previousY < height - 14 && Math.abs(ix + 8 - x * width) < 40) {
      const multiplier = Math.min(3, 1 + Math.floor(streak / 5));
      const isLife = item.kind === 'life';
      const points = item.bad || isLife ? 0 : (item.kind === 'sol' ? 25 : 10) * multiplier;
      if (isLife) { lives += 1; livesEl.textContent = lives; status.textContent = `Extra life! ${lives} lives in your bag.`; }
      if (item.bad) {
        lives -= 1; livesEl.textContent = lives;
        status.textContent = lives ? `Rug pull! ${lives} ${lives === 1 ? 'life' : 'lives'} left. Keep dodging!` : 'Game over! No lives left.';
      }
      streak = item.bad ? 0 : isLife ? streak : streak + 1;
      comboEl.textContent = `${Math.min(3, 1 + Math.floor(streak / 5))}×`;
      score = Math.max(0, score + points); scoreEl.textContent = score; saveBest();
      board.classList.remove('rug-hit'); if (item.bad && !reducedMotion) { void board.offsetWidth; board.classList.add('rug-hit'); }
      const pop = document.createElement('span'); pop.className = 'catch-pop'; pop.textContent = isLife ? '+1 LIFE ♥' : item.bad ? '−1 LIFE' : `+${points}${multiplier > 1 ? ' WAGMI' : ''}`; pop.style.left = `${ix}px`; pop.style.top = `${height - 105}px`; board.append(pop); setTimeout(() => pop.remove(), 650);
      item.el.remove(); return false;
    }
    if (item.y > height) { if (!item.bad && item.kind !== 'life') { streak = 0; comboEl.textContent = '1×'; } item.el.remove(); return false; }
    return true;
  });
  if (lives === 0) { finish(`Game over! You scored ${score} points. Try again for a bigger bag.`, true); return; }
  frame = requestAnimationFrame(tick);
}
start.addEventListener('click', () => {
  cancelAnimationFrame(frame); items.forEach(item => item.el.remove()); items = []; held.clear();
  score = 0; streak = 0; lives = 3; livesEl.textContent = lives; comboEl.textContent = '1×'; board.classList.remove('rug-hit'); elapsed = 0; nextLifeAt = 15 + Math.random() * 15; spawnClock = .3; scoreEl.textContent = '0'; timeEl.textContent = '0'; speedEl.textContent = '1.0×'; end.hidden = false; moveTo(.5);
  playing = true; board.classList.add('playing'); idle.hidden = true;
  status.textContent = 'Three lives. Every rug costs one. Keep stacking as the drops get faster!';
  start.textContent = 'RESTART RUN →'; board.focus({ preventScroll: true }); previous = performance.now(); frame = requestAnimationFrame(tick);
});
const keyDirection = key => ['ArrowLeft','a','A'].includes(key) ? 'left' : ['ArrowRight','d','D'].includes(key) ? 'right' : null;
board.addEventListener('keydown', e => { const dir = keyDirection(e.key); if (playing && dir) { e.preventDefault(); held.add(dir); } });
window.addEventListener('keyup', e => { const dir = keyDirection(e.key); if (dir) held.delete(dir); });
window.addEventListener('blur', () => held.clear());
board.addEventListener('blur', () => held.clear());
board.addEventListener('pointerdown', e => { if (!playing) return; board.setPointerCapture(e.pointerId); moveTo((e.clientX - board.getBoundingClientRect().left) / board.clientWidth); });
board.addEventListener('pointermove', e => { if (playing && (e.buttons || e.pointerType === 'touch')) moveTo((e.clientX - board.getBoundingClientRect().left) / board.clientWidth); });
for (const dir of ['left','right']) {
  const control = document.querySelector(`#game-${dir}`);
  control.addEventListener('pointerdown', e => { if (!playing) return; e.preventDefault(); control.setPointerCapture(e.pointerId); held.add(dir); });
  ['pointerup','pointercancel','lostpointercapture'].forEach(type => control.addEventListener(type, () => held.delete(dir)));
  control.addEventListener('keydown', e => { if (playing && [' ','Enter'].includes(e.key)) { e.preventDefault(); held.add(dir); } });
  control.addEventListener('keyup', () => held.delete(dir));
  control.addEventListener('blur', () => held.delete(dir));
}
// Suspend the simulation in hidden tabs without ending an endless run.
end.addEventListener('click', () => { if (playing) finish(); });
document.addEventListener('visibilitychange', () => {
  if (!playing) return;
  held.clear(); cancelAnimationFrame(frame);
  if (document.hidden) { status.textContent = 'Run paused while you’re away. Your bag is safe.'; }
  else { status.textContent = 'Back in the trenches. Keep stacking!'; previous = performance.now(); frame = requestAnimationFrame(tick); }
});

const nightToggle = document.querySelector('.night-toggle');
nightToggle.addEventListener('click', () => {
  const dimmed = document.querySelector('.after-hours').classList.toggle('neon-off');
  nightToggle.setAttribute('aria-pressed', String(dimmed));
  nightToggle.textContent = dimmed ? 'CLOCK IN THE NEON ☀' : 'CLOCK OUT THE NEON ☾';
});
