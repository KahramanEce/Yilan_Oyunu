const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");

let gameOver = false;

let foodX, foodY;

//yılanın başlangıç konumunu tutacak değişken
let snakeX = 5,
  snakeY = 5;

//yılanın hızını belırleyen değişken
let velocityX = 0,
  velocityY = 0;

//yılanın görünümünü temsil eden dizi
let snakeBody = [];

//oyun döngüsünü kontrol eden değişken
let setIntervalId;

//oyuncu skorunu tutacak değişken
let score = 0;

//en skoru localstorage den alalim
let highScore = localStorage.getItem("high-score") || 0;
//ekrana yaz
highScoreElement.innerText = `Max. Skor:${highScore}`;

//yem konumunu rastgele belirleyen fonksiyon

const updateFoodPosition = () => {
  foodX = Math.floor(Math.random() * 30) + 1;
  foodY = Math.floor(Math.random() * 30) + 1;
};

//oyun sona erdiginde calisan fonksiyon
const handleGameOver = () => {
  clearInterval(setIntervalId);
  alert("Oyun Bitti! Tekrar oynamak için TAMAM'a basın...");
  location.reload();
};
//yilan icin yön değiştirme

const changeDirection = (e) => {
  if (e.key === "ArrowUp" && velocityY !== 1) {
    velocityX = 0;
    velocityY = -1;
  } else if (e.key === "ArrowDown" && velocityY !== -1) {
    velocityX = 0;
    velocityY = 1;
  } else if (e.key === "ArrowLeft" && velocityX !== 1) {
    velocityX = -1;
    velocityY = 0;
  } else if (e.key === "ArrowRight" && velocityX !== -1) {
    velocityX = 1;
    velocityY = 0;
  }
};
//oyunu başlatan fonksiyon
const initGame = () => {
  //oyun sona ermisse oyunu baslatmadan çık.
  if (gameOver) return handleGameOver();
  //Yılanın ve yemın konumunu HTML içeriği olarak oluşturacağız.
  let html = `<div class="food" style="grid-area:${foodY}/${foodX}"></div>`;

  //yılan yemi yemişse
  if (snakeX === foodX && snakeY === foodY) {
    //yeni yem konumu belirleme
    updateFoodPosition();

    //yemi yılan vücuduna ekleme
    snakeBody.push([foodY, foodX]);
    score++;
    //Eğer yeni skor en yüksek skoru geçerse, en yüksek skoru güncelle ve kaydet
    highScore = score >= highScore ? score : highScore;

    localStorage.setItem("high-score", highScore);
    scoreElement.innerText = `Skor: ${score}`;
    highScoreElement.innerText = `Max. Skor: ${highScore}`;
  }

  //yılanın başını güncelleme ve vücudunu hareket ettirme
  snakeX += velocityX;
  snakeY += velocityY;

  for (let i = snakeBody.length - 1; i > 0; i--) {
    snakeBody[i] = snakeBody[i - 1];
  }

  snakeBody[0] = [snakeX, snakeY];

  //yılanın tahta dışına çıkıp çıkmadığını kontrol et.
  if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
    return (gameOver = true);
  }
  //Yılanın her bir parçasını temsil eden div leri HTML içeriğine ekle
  for (let i = 0; i < snakeBody.length; i++) {
    html += `<div class="head" style="grid-area: ${snakeBody[i][1]}/${snakeBody[i][0]}"></div>`;

    //Yılanın başının vücudu ile çarpışıp çarpışmadığı kontrol edilir
    if (
      i !== 0 &&
      snakeBody[0][1] === snakeBody[i][1] &&
      snakeBody[0][0] === snakeBody[i][0]
    ) {
      gameOver = true;
    }
  }
  //oyun tahtasını güncelleme
  playBoard.innerHTML = html;
};

updateFoodPosition();

setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);
