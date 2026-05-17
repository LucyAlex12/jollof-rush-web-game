const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const scoreNode = document.querySelector("#score");
const timeNode = document.querySelector("#time");
const startBtn = document.querySelector("#startBtn");
const pauseBtn = document.querySelector("#pauseBtn");

const items = [
  { label: "rice", icon: "🍚", points: 8 },
  { label: "pepper", icon: "🌶️", points: 10 },
  { label: "tomato", icon: "🍅", points: 12 },
  { label: "chicken", icon: "🍗", points: 18 },
  { label: "burnt pot", icon: "🔥", points: -20 }
];

let player = { x: canvas.width / 2 - 55, y: canvas.height - 58, width: 110, height: 28, speed: 22 };
let falling = [];
let score = 0;
let time = 45;
let running = false;
let paused = false;
let frame = 0;
let timerId = null;
let animationId = null;

function drawPlayer() {
  ctx.save();
  ctx.shadowColor = "rgba(15, 118, 110, 0.28)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 8;
  ctx.fillStyle = "#0f766e";
  ctx.beginPath();
  roundRect(player.x, player.y, player.width, player.height, 14);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#d1fae5";
  ctx.beginPath();
  ctx.ellipse(player.x + player.width / 2, player.y + 2, player.width / 2 - 8, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff7ed";
  ctx.beginPath();
  ctx.ellipse(player.x + player.width / 2, player.y - 1, player.width / 2 - 18, 7, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.arc(player.x + 44, player.y - 4, 4, 0, Math.PI * 2);
  ctx.arc(player.x + 58, player.y - 5, 4, 0, Math.PI * 2);
  ctx.arc(player.x + 72, player.y - 4, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function roundRect(x, y, width, height, radius) {
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
}

function spawnItem() {
  const item = items[Math.floor(Math.random() * items.length)];
  falling.push({ ...item, x: Math.random() * (canvas.width - 58) + 29, y: -46, size: 46, vy: 2.4 + Math.random() * 2.6 });
}

function drawItem(item) {
  ctx.save();
  ctx.translate(item.x, item.y);
  ctx.shadowColor = "rgba(32, 17, 12, 0.2)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 6;
  ctx.fillStyle = item.points < 0 ? "rgba(31, 41, 55, 0.9)" : "rgba(255, 255, 255, 0.86)";
  ctx.beginPath();
  ctx.arc(0, 0, item.size * 0.62, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.font = `${item.size}px "Segoe UI Emoji", "Apple Color Emoji", "Noto Color Emoji", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(item.icon, 0, 1);
  ctx.restore();
}

function drawRiceIcon(size) {
  const s = size / 34;
  ctx.fillStyle = "#fff7d6";
  ctx.beginPath();
  roundRect(-13 * s, -14 * s, 26 * s, 28 * s, 6 * s);
  ctx.fill();
  ctx.strokeStyle = "#d6b56d";
  ctx.lineWidth = 2 * s;
  ctx.stroke();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#f59e0b";
  ctx.fillRect(-11 * s, -6 * s, 22 * s, 5 * s);
  ctx.strokeStyle = "#d6b56d";
  ctx.lineWidth = 1.4 * s;
  for (let i = -7; i <= 7; i += 7) {
    ctx.beginPath();
    ctx.ellipse(i * s, 7 * s, 2 * s, 4 * s, 0.7, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawPepperIcon(size) {
  const s = size / 34;
  ctx.fillStyle = "#dc2626";
  ctx.beginPath();
  ctx.moveTo(-5 * s, -13 * s);
  ctx.bezierCurveTo(-18 * s, -6 * s, -11 * s, 14 * s, 1 * s, 15 * s);
  ctx.bezierCurveTo(15 * s, 12 * s, 15 * s, -7 * s, -2 * s, -13 * s);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#16a34a";
  ctx.beginPath();
  ctx.moveTo(-2 * s, -13 * s);
  ctx.quadraticCurveTo(3 * s, -22 * s, 9 * s, -15 * s);
  ctx.lineTo(4 * s, -11 * s);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.42)";
  ctx.beginPath();
  ctx.ellipse(-6 * s, -5 * s, 3 * s, 7 * s, 0.4, 0, Math.PI * 2);
  ctx.fill();
}

function drawTomatoIcon(size) {
  const s = size / 34;
  ctx.fillStyle = "#f97316";
  ctx.beginPath();
  ctx.arc(0, 2 * s, 15 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.fillStyle = "#16a34a";
  for (let i = 0; i < 5; i += 1) {
    ctx.save();
    ctx.rotate((Math.PI * 2 * i) / 5);
    ctx.beginPath();
    ctx.moveTo(0, -16 * s);
    ctx.lineTo(4 * s, -5 * s);
    ctx.lineTo(-4 * s, -5 * s);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.arc(-6 * s, -3 * s, 4 * s, 0, Math.PI * 2);
  ctx.fill();
}

function drawChickenIcon(size) {
  const s = size / 34;
  ctx.fillStyle = "#f59e0b";
  ctx.beginPath();
  ctx.ellipse(-1 * s, 2 * s, 13 * s, 16 * s, -0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#fff7ed";
  ctx.beginPath();
  ctx.arc(11 * s, -10 * s, 5 * s, 0, Math.PI * 2);
  ctx.arc(17 * s, -14 * s, 4 * s, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "#b45309";
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.arc(-4 * s, 0, 8 * s, 0.4, 2.5);
  ctx.stroke();
}

function drawBurntPotIcon(size) {
  const s = size / 34;
  ctx.fillStyle = "#1f2937";
  ctx.beginPath();
  roundRect(-15 * s, -8 * s, 30 * s, 22 * s, 5 * s);
  ctx.fill();
  ctx.strokeStyle = "#0f172a";
  ctx.lineWidth = 3 * s;
  ctx.stroke();
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(-20 * s, -3 * s);
  ctx.lineTo(-14 * s, 0);
  ctx.moveTo(20 * s, -3 * s);
  ctx.lineTo(14 * s, 0);
  ctx.stroke();
  ctx.strokeStyle = "#111827";
  ctx.beginPath();
  ctx.arc(0, -9 * s, 11 * s, Math.PI, 0);
  ctx.stroke();
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.arc(-6 * s, 4 * s, 2 * s, 0, Math.PI * 2);
  ctx.arc(6 * s, 4 * s, 2 * s, 0, Math.PI * 2);
  ctx.fill();
}

function collision(item) {
  return item.x > player.x && item.x < player.x + player.width && item.y + item.size / 2 > player.y;
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawPlayer();

  if (running && !paused && frame % 34 === 0) spawnItem();
  falling.forEach(item => {
    if (!paused) item.y += item.vy;
    drawItem(item);
  });

  if (!paused) {
    falling = falling.filter(item => {
      if (collision(item)) {
        score = Math.max(0, score + item.points);
        scoreNode.textContent = score;
        return false;
      }
      return item.y < canvas.height + 50;
    });
  } else {
    drawPauseOverlay();
  }

  if (!paused) frame += 1;
  if (running) animationId = requestAnimationFrame(loop);
}

function drawPauseOverlay() {
  ctx.fillStyle = "rgba(32, 17, 12, 0.55)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "800 44px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Paused", canvas.width / 2, canvas.height / 2);
  ctx.font = "700 18px Arial";
  ctx.fillText("Tap Resume to continue cooking.", canvas.width / 2, canvas.height / 2 + 34);
  ctx.textAlign = "left";
}

function startGame() {
  if (timerId) clearInterval(timerId);
  if (animationId) cancelAnimationFrame(animationId);
  falling = [];
  score = 0;
  time = 45;
  frame = 0;
  running = true;
  paused = false;
  scoreNode.textContent = score;
  timeNode.textContent = time;
  startBtn.textContent = "Restart";
  pauseBtn.disabled = false;
  pauseBtn.textContent = "Pause";
  timerId = setInterval(() => {
    if (!running) {
      clearInterval(timerId);
      return;
    }
    if (paused) return;
    time -= 1;
    timeNode.textContent = time;
    if (time <= 0) {
      running = false;
      pauseBtn.disabled = true;
      clearInterval(timerId);
      ctx.fillStyle = "rgba(32, 17, 12, 0.82)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "white";
      ctx.font = "800 44px Arial";
      ctx.fillText(`Final score: ${score}`, 290, 260);
    }
  }, 1000);
  loop();
}

canvas.addEventListener("mousemove", event => {
  const rect = canvas.getBoundingClientRect();
  const scale = canvas.width / rect.width;
  player.x = Math.min(canvas.width - player.width, Math.max(0, (event.clientX - rect.left) * scale - player.width / 2));
});

canvas.addEventListener("touchmove", event => {
  event.preventDefault();
  const touch = event.touches[0];
  const rect = canvas.getBoundingClientRect();
  const scale = canvas.width / rect.width;
  player.x = Math.min(canvas.width - player.width, Math.max(0, (touch.clientX - rect.left) * scale - player.width / 2));
}, { passive: false });

document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft") player.x = Math.max(0, player.x - player.speed);
  if (event.key === "ArrowRight") player.x = Math.min(canvas.width - player.width, player.x + player.speed);
});

startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", () => {
  if (!running) return;
  paused = !paused;
  pauseBtn.textContent = paused ? "Resume" : "Pause";
  if (!paused && !animationId) loop();
});
loop();
