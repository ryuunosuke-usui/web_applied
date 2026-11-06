const canvas = document.getElementById("stage");
const ctx = canvas.getContext("2d");
const info = document.getElementById("info");   // 5_stage.html の <p id="info">

let x = 100;          // 丸の中心の位置
let y = 80;
let vx = 180;         // 横の速さ（1秒に180px）
let vy = 140;         // 縦の速さ（1秒に140px。＋ は下へ）
let r = 14;         // ★ const から let に変更！
let last = performance.now();

function update(dt) {
  x = x + vx * dt;
  y = y + vy * dt;

  // 左右の壁（丸は x が中心なので、半径 r を足し引きする）
  if (x + r > canvas.width) {
    x = canvas.width - r;
    vx = -vx;
  }
  if (x - r < 0) {
    x = r;
    vx = -vx;
  }
  // 上下の壁
  if (y + r > canvas.height) {
    y = canvas.height - r;
    vy = -vy;
  }
  if (y - r < 0) {
    y = r;
    vy = -vy;
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
 ctx.fillStyle = "#ffd166";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

// now：今回呼ばれた時刻（ミリ秒）。requestAnimationFrame が引数で渡してくれる
function loop(now) {
  const dt = (now - last) / 1000;   // 前回からの時間（秒）
  last = now;                       // 今回の時刻を、次の「前回」として覚えておく

  info.textContent = "dt：" + dt.toFixed(4) + " 秒　／　1秒に約 " + (1 / dt).toFixed(0) + " 回";

  update(dt);
  draw();
  
  requestAnimationFrame(loop);
}
// キーを押した瞬間に1回だけ値を変える処理（3つ以上）
document.addEventListener("keydown", (e) => {
  // 1つ目：↑ キーで速さを1.2倍にする（速くする）
  if (e.code === "ArrowUp") {
    vx = vx * 1.2;
    vy = vy * 1.2;
  }
  
  // 2つ目：↓ キーで速さを0.8倍にする（遅くする）
  if (e.code === "ArrowDown") {
    vx = vx * 0.8;
    vy = vy * 0.8;
  }
  
  // 3つ目：R キーで半径を少し大きくする（上限を50pxまでにする）
  if (e.code === "KeyR") {
    if (r < 50) {
      r = r + 4;
    }
  }
  
  // 4つ目（おまけ）：E キーで半径を小さくする（ただし 5px より小さくならないようにガードする）
  if (e.code === "KeyE") {
    if (r > 5) {
      r = r - 4;
    }
  }
});

requestAnimationFrame(loop);
