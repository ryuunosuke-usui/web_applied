const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");

// 調整する数
const CONFIG = {
  GRAVITY: 2000,          // 重力はしっかり戻す
  JUMP_SPEED: 700,        // ジャンプの初速
  MOVE_SPEED: 240,        // 地上での移動スピード
  MAX_JUMPS: 3,           // 【手順５】空中で合計3回跳べるようにする（1回＋空中2回）
  FALL_GRAVITY_RATE: 2,   // 落ちるときの重力
  AIR_MOVE_RATE: 1.5,     // 【追加】空中にいるときの移動スピードの倍率（キビキビ動かすため）
};

const TARGET_HEIGHT = 64;   // 目印の線の高さ

const player = { x: 80, y: 20, w: 32, h: 32, vy: 0, isGrounded: false, jumpsLeft: CONFIG.MAX_JUMPS };
const floor = { x: 0, y: 320, w: 640, h: 40 };

const keys = {};
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  // 跳べる回数が残っていれば跳ぶ（空中でも3回まで可能）
  if (e.code === "Space" && player.jumpsLeft > 0) {
    player.vy = -CONFIG.JUMP_SPEED;
    player.jumpsLeft = player.jumpsLeft - 1;
  }
});
document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

function collideWithFloor() {
  if (player.y + player.h > floor.y) {
    player.y = floor.y - player.h;
    player.vy = 0;
    player.isGrounded = true;
    player.jumpsLeft = CONFIG.MAX_JUMPS;   // 着地したら跳べる回数が復活
  } else {
    player.isGrounded = false;
  }
}

function update(dt) {
  // 地上と空気中で横移動のスピードを切り替える（空中は AIR_MOVE_RATE をかけてキビキビ動かす）
  let currentMoveSpeed = CONFIG.MOVE_SPEED;
  if (!player.isGrounded) {
    currentMoveSpeed = CONFIG.MOVE_SPEED * CONFIG.AIR_MOVE_RATE;
  }

  if (keys["ArrowRight"]) {
    player.x = player.x + currentMoveSpeed * dt;
  }
  if (keys["ArrowLeft"]) {
    player.x = player.x - currentMoveSpeed * dt;
  }

  // 落ちているときは重力を強くする
  const g = player.vy > 0 ? CONFIG.GRAVITY * CONFIG.FALL_GRAVITY_RATE : CONFIG.GRAVITY;
  player.vy = player.vy + g * dt;
  player.y = player.y + player.vy * dt;
  collideWithFloor();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#203060";
  ctx.fillRect(floor.x, floor.y, floor.w, floor.h);

  // 目印の線
  ctx.fillStyle = "#ff6b6b";
  ctx.fillRect(0, floor.y - TARGET_HEIGHT, canvas.width, 2);

  ctx.fillStyle = player.isGrounded ? "#7ef5e1" : "#ffd166";
  ctx.fillRect(player.x, player.y, player.w, player.h);

  ctx.fillStyle = "#e8eeff";
  ctx.font = "14px monospace";
  ctx.fillText("vy = " + player.vy.toFixed(0) + "   jumpsLeft = " + player.jumpsLeft, 10, 20);
}

let last = performance.now();

function loop(now) {
  const dt = Math.min((now - last) / 1000, 0.033);
  last = now;
  update(dt);
  draw();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);