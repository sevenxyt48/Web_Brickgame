var canvas;
var context;
var totalScore = 0; // 전체 스코어

// 벽돌 정보
var brick = [];
var brickRow; // 벽돌 행 수
var brickColumn; // 벽돌 열 수
var brickWidth;
var brickHeight;
var brickGapX = 5; // 벽돌 사이의 가로 간격
var brickGapY = 5; // 벽돌 사이의 세로 간격
var isBrickMoving = false; // 벽돌 하강 여부
var brickVy = 0.1; // 벽돌이 내려오는 속도

// 패들
const pw = 100;
var paddleWidth = pw; // 너비
var paddleHeight = 10; // 높이
var paddleX = 0; // 초기 x 좌표
var paddleY = 520; // 초기 y 좌표 (캔버스 바닥에서 약간 위)

// 공
var balls = []; // 공의 초기 위치와 속도
const ballR = 10;
var bullet = { x: 400, y: 0, r: 10, vX: 3, vY: 3 }; // 보스의 공격의 초기 위치와 속도
var isBulletMoving = false;
var ballTop;
var ballBottom;
var ballLeft;
var ballRight;

var drawInterval; // 게임 화면 갱신 인터벌
var countdownInterval // 카운트 인터벌

var isGameRunning = false; // 게임 실행 상태 추적 변
var isGameAllClear = false;
var gameLevel;
var lives = 3; // 목숨 변수

// 공 이미지
var bulletImg = new Image();
bulletImg.src = "img/attackBall.png";

// 벽돌 이미지 사이즈: 500x100
var brickImg = [];
brickImg[0] = new Image();
brickImg[1] = new Image();
brickImg[0].src = "img/stone/stone_basic.png";
brickImg[1].src = "img/stone/stone_basic.png";

//좋은 이벤트 벽돌
var goodImg = new Image();
var goodImg1 = new Image();
goodImg.src = "img/stone/stone_gold.png";
goodImg1.src = "img/stone/stone_light.png";

var badImg = new Image();
var badImg1 = new Image();
badImg.src = "img/stone/stone_gray.png";
badImg1.src = "img/stone/stone_green.png";

var isCountdownRunning = false; // 카운트다운 상태 변수 추가


function gameLoop() {
    updateGame();
    drawGame(context);
    if (!isGameOver()) {
        requestAnimationFrame(gameLoop);
    }
}
function goToStoryPage() {
    document.getElementById('houseSelectScreen').style.display = 'none';
    document.getElementById('storyScreen').style.display = 'block';
}

function goToHouseSelection() {
    document.getElementById('storyScreen').style.display = 'none';
    document.getElementById('houseSelectScreen').style.display = 'block';
}

function startGame() {
    document.getElementById('storyScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    initGame(); // 실제 게임 시작 로직
}

function pauseGame() {
    // 일시정지 기능 구현 (애니메이션 중지 등)
}

function showVictoryScreen() {
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('victoryScreen').style.display = 'block';
}

function nextGrade() {
    // 다음 학년 시작 로직
    document.getElementById('victoryScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    startNextStage(); // 새 스테이지 초기화
}

function initGame() {
    canvas = document.createElement('canvas'); //임의로 캔버스 생성 -> 수정정 가능
    canvas.width = 1280;
    canvas.height = 830;
    context = canvas.getContext('2d');
    document.getElementById('gameScreen').appendChild(canvas);

    // 패들 위치 초기화
    paddleX = (canvas.width - paddleWidth) / 2;

    // 공 초기 위치
    resetBall();

    // 벽돌 초기화  예시
    brickRow = 5;
    brickColumn = 10;
    brickWidth = 100;
    brickHeight = 30;
    brick = [];

    for (let r = 0; r < brickRow; r++) {
        for (let c = 0; c < brickColumn; c++) {
            brick.push({
                x: c * (brickWidth + brickGapX) + 60,
                y: r * (brickHeight + brickGapY) + 50,
                destroyed: false
            });
        }
    }

    gameLoop();
}

function resetBall() {
    bullet.x = 640;
    bullet.y = 500;
    bullet.vX = 3;
    bullet.vY = -3;
}

function updateGame() {
    // 공 위치 갱신
    bullet.x += bullet.vX;
    bullet.y += bullet.vY;

    // 벽과 충돌
    if (bullet.x - bullet.r <= 0 || bullet.x + bullet.r >= 1280) {
        bullet.vX *= -1;
    }
    if (bullet.y - bullet.r <= 0) {
        bullet.vY *= -1;
    }

    // 바닥에 닿았을 경우 목숨 감소
    if (bullet.y + bullet.r >= 830) {
        lives--;
        resetBall();
    }

    // 패들과 충돌
    if (
        bullet.y + bullet.r >= paddleY &&
        bullet.x >= paddleX &&
        bullet.x <= paddleX + paddleWidth &&
        bullet.y <= paddleY + paddleHeight
    ) {
        // 반사 각도 조정
        let hitPoint = (bullet.x - (paddleX + paddleWidth / 2)) / (paddleWidth / 2);
        let angle = hitPoint * (Math.PI / 3); // 최대 ±60도
        let speed = Math.sqrt(bullet.vX * bullet.vX + bullet.vY * bullet.vY);
        bullet.vX = speed * Math.sin(angle);
        bullet.vY = -Math.abs(speed * Math.cos(angle));
    }

    // 벽돌 충돌
    for (let i = 0; i < brick.length; i++) {
        let b = brick[i];
        if (!b.destroyed &&
            bullet.x + bullet.r >= b.x &&
            bullet.x - bullet.r <= b.x + brickWidth &&
            bullet.y + bullet.r >= b.y &&
            bullet.y - bullet.r <= b.y + brickHeight
        ) {
            // 충돌 반사 (기본적으로 수직 반사)
            bullet.vY *= -1;
            b.destroyed = true;
            totalScore += 10;
            break;
        }
    }
}

function drawGame(ctx) {
    ctx.clearRect(0, 0, 1280, 830);

    // 공 그리기
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.r, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();

    // 패들 그리기
    ctx.fillStyle = 'blue';
    ctx.fillRect(paddleX, paddleY, paddleWidth, paddleHeight);

    // 벽돌 그리기
    for (let i = 0; i < brick.length; i++) {
        if (!brick[i].destroyed) {
            ctx.drawImage(brickImg[0], brick[i].x, brick[i].y, brickWidth, brickHeight);
        }
    }

    // 점수 표시
    document.getElementById("score").innerText = "Score: " + totalScore;
    document.getElementById("lives").innerText = "Lives: " + lives;
}


