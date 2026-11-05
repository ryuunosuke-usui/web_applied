// データ：敵のオブジェクトの配列
const enemies = [
  { name: "スライム", hp: 5 },
  { name: "ゴブリン", hp: 9 },
  { name: "ドラゴン", hp: 20 }
];

// データからリストを作る（３-５・３-６と同じ形）
function showEnemies() {
  const list = document.getElementById("enemyList");
  list.innerHTML = "";

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const li = document.createElement("li");
    li.innerText = `${enemy.name}（HP：${enemy.hp}）`;
    //追加した、倒した敵を灰色にするため
    if (enemy.hp <= 0){
        li.classList.add("down");
    }
    list.appendChild(li);
  }
}

// 攻撃：全員の HP を 3 減らして、リストを作り直す
function attack() {
  // ★ここを書く
  for (let i = 0; i < enemies.length; i++){
    enemies[i].hp -= 3;
  }

  showEnemies();
}

showEnemies();