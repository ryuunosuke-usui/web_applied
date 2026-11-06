const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const info = document.getElementById("info");   // 5_stage.html の <p id="info">

// ボールを2つ（オブジェクトの配列）にする
let balls = [
  {
    x: 100,          // 1つ目の丸の中心の位置
    y: 80,
    vx: 180,         // 横の速さ
    vy: 140,         // 縦の速さ
    r: 14            // 半径
  },
  {
    x: 300,          // 2つ目の丸の中心の位置
    y: 200,
    vx: -120,        // 2つ目は別の速さと方向にする
    vy: 160,
    r: 20
  }
];

let last = performance.now();

function update(dt) {
  // 配列を使って、すべてのボールの動きをまとめて計算する
  for (let i = 0; i < balls.length; i++) {
    let b = balls[i];

    b.x = b.x + b.vx * dt;
    b.y = b.y + b.vy * dt;

    // 左右の壁
    if (b.x + b.r > canvas.width) {
      b.x = canvas.width - b.r;
      b.vx = -b.vx;
    }
    if (b.x - b.r < 0) {
      b.x = b.r;
      b.vx = -b.vx;
    }
    // 上下の壁
    if (b.y + b.r > canvas.height) {
      b.y = canvas.height - b.r;
      b.vy = -b.vy;
    }
    if (b.y - b.r < 0) {
      b.y = b.r;
      b.vy = -b.vy;
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#ffd166";

  // 配列を使って、すべてのボールを画面に描画する
  for (let i = 0; i < balls.length; i++) {
    let b = balls[i];
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

// now：今回呼ばれた時刻（ミリ秒）。requestAnimationFrame が引数で渡してくれる
function loop(now) {
  const dt = (now - last) / 1000;   // 前回からの時間（秒）
  last = now;                       // 今回の時刻を、次の「前回」として覚えておく

  info.textContent = "dt：" + dt.toFixed(4) + " 秒 ／ 1秒に約 " + (1 / dt).toFixed(0) + " 回";

  update(dt);
  draw();
  
  requestAnimationFrame(loop);
}

// キーを押した瞬間に1回だけ値を変える処理（すべてのボールの速さや、1つ目のボールの大きさを変える）
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowUp") {
    for (let i = 0; i < balls.length; i++) {
      balls[i].vx *= 1.2;
      balls[i].vy *= 1.2;
    }
  }
  if (e.code === "ArrowDown") {
    for (let i = 0; i < balls.length; i++) {
      balls[i].vx *= 0.8;
      balls[i].vy *= 0.8;
    }
  }
  if (e.code === "KeyR") {
    if (balls[0].r < 50) {
      balls[0].r += 4;
    }
  }
  if (e.code === "KeyE") {
    if (balls[0].r > 5) {
      balls[0].r -= 4;
    }
  }
});

requestAnimationFrame(loop);