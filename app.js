const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const scoreNode = document.querySelector("#score");
const timeNode = document.querySelector("#time");
const startBtn = document.querySelector("#startBtn");

const items = [
  { label: "rice", color: "#fff7d6", points: 8 },
  { label: "pepper", color: "#ef4444", points: 10 },
  { label: "tomato", color: "#f97316", points: 12 },
  { label: "chicken", color: "#facc15", points: 18 },
  { label: "burnt", color: "#1f2937", points: -20 }
];

let player = { x: canvas.width / 2 - 55, y: canvas.height - 58, width: 110, height: 28, speed: 22 };
let falling = [];
let score = 0;
let time = 45;
let running = false;
let frame = 0;

function drawPlayer() {
  ctx.fillStyle = "#0f766e";
  ctx.beginPath();
  roundRect(player.x, player.y, player.width, player.height, 14);
  ctx.fill();
  ctx.fillStyle = "white";
  ctx.font = "700 16px Arial";
  ctx.fillText("bowl", player.x + 38, player.y + 19);
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
  falling.push({ ...item, x: Math.random() * (canvas.width - 32), y: -30, size: 28, vy: 2.4 + Math.random() * 2.6 });
}

function drawItem(item) {
  ctx.fillStyle = item.color;
  ctx.beginPath();
  ctx.arc(item.x, item.y, item.size / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = item.label === "burnt" ? "white" : "#1f130f";
  ctx.font = "700 10px Arial";
  ctx.textAlign = "center";
  ctx.fillText(item.label.slice(0, 5), item.x, item.y + 4);
  ctx.textAlign = "left";
}

function collision(item) {
  return item.x > player.x && item.x < player.x + player.width && item.y + item.size / 2 > player.y;
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawPlayer();

  if (running && frame % 34 === 0) spawnItem();
  falling.forEach(item => {
    item.y += item.vy;
    drawItem(item);
  });

  falling = falling.filter(item => {
    if (collision(item)) {
      score = Math.max(0, score + item.points);
      scoreNode.textContent = score;
      return false;
    }
    return item.y < canvas.height + 40;
  });

  frame += 1;
  if (running) requestAnimationFrame(loop);
}

function startGame() {
  falling = [];
  score = 0;
  time = 45;
  frame = 0;
  running = true;
  scoreNode.textContent = score;
  timeNode.textContent = time;
  startBtn.textContent = "Restart";
  const timer = setInterval(() => {
    if (!running) {
      clearInterval(timer);
      return;
    }
    time -= 1;
    timeNode.textContent = time;
    if (time <= 0) {
      running = false;
      clearInterval(timer);
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
loop();
