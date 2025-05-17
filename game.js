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
