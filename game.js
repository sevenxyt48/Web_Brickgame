var canvas;
var context;
var totalScore = 0; // 전체 스코어

// 벽돌 정보
function Brick(x, y, width, height, type){
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.type=type; // 벽돌 종류. 기본:0, 좋은벽돌:1, 나쁜벽돌:2
    this.alive=true; // 벽돌의 깨짐 유무 표시. true:존재 false:깨짐
}
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
function Ball(x, y, vX, vY){
    this.x = x;
    this.y = y;
    this.vX = vX;
    this.vY = vY;
}
var balls = []; // 공의 초기 위치와 속도
var ballNum = 0; // 공 개수
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

$("#startButton").click(goToHouseSelection);
$("#skipButton").click(function () {
    clearInterval(intervalId); // 타이핑 작업 중단
    $("#skipButton").hide();
    while (i < content.length) {
        let txt = content[i++];
        text.innerHTML += txt === "\n" ? "<br/>" : txt;
    }
    $("#startButton").show();
});

$("#mainMenu div h1").eq(1).on("click", settings);
$("#mainMenu div h1").eq(2).on("click", credit);
$(".backToMain").on("click", backToMainMenu);
$("#stopButton").on("click", function () {
    clearInterval(countdownInterval);//0526
    stopGame();
    resetAll();
});
$(".reTry").on("click", function () {
    stage(gameLevel);
});
$(".nextStage").on("click", function () {
    console.log(`Start next stage`);
    stage(++gameLevel);
});

function gameLoop() {
    updateGame();
    drawGame(context);
    if (!isGameOver()) {
        requestAnimationFrame(gameLoop);
    }
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

//좋은 이벤트 - 공의 속도를 느리게 하는 마법
function impedimenta(){
    if(balls.length==0) return;

    const originalSpeed = [];
    balls.forEach((ball, index)=>{
        originalSpeed[index].push({vX:ball.vX, vY: ball.vY});
        ball.vX *= 0.7;
        ball.vY *= 0.7;
    })
    //1분 있으면 원래 속도로 복원
    setTimeout(()=>{
        balls.forEach((ball, index)=>{
            if(originalSpeed[index]){
                ball.vX = originalSpeed[index].vX;
                ball.vY = originalSpeed[index].vY;
            }
        });
    }, 60000)
}

//좋은 이벤트 - 공 복제 마법
function geminio(brickX, brickY){
    balls[ballNum] = new Ball(brickX, brickY, 0, 3); // 아래로 떨어짐.
    //공이 패들에 닿았을 경우 속도 기본 값으로 변경. 패들에 닿는 위치마다 각도 다르게.
    //패들에 닿지 않고 화면 아래쪽으로 사라지면 삭제.
}

//좋은 이벤트 - 상하좌우 폭발 마법
function bombarda(brickR, brickC){
    //brick 2차원 배열로 저장되어진다고 가정했을 때, 부딪힌 벽돌의 row, col이 인자.
    brick[brickR][brickC].alive = false; // 벽돌 생성 함수 따로 만들어야함. 미구현
    brick[brickR-1][brickC].alive = false;
    brick[brickR+1][brickC].alive = false;
    brick[brickR][brickC-1].alive = false;
    brick[brickR][brickC+1].alive = false;
    // bombarda함수 및 벽돌에 공 충돌 후에는 벽돌draw함수 재출력력
}

//좋은 이벤트 - 빛 생성 마법
function lumos(){

}

//나쁜 이벤트 - 공의 속도를 빠르게 하는 마법
function ascendio(){ //조금 마법 이름이 기능이랑 조금 다른데 속도 빠르게가 없어서 그나마 비슷한걸루 일단 해놨습니다.
    if(balls.length==0) return;

    const originalSpeed = [];
    balls.forEach((ball, index)=>{
        originalSpeed[index].push({vX:ball.vX, vY: ball.vY});
        ball.vX *= 1.3;
        ball.vY *= 1.3;
    })
    //1분 있으면 원래 속도로 복원
    setTimeout(()=>{
        balls.forEach((ball, index)=>{
            if(originalSpeed[index]){
                ball.vX = originalSpeed[index].vX;
                ball.vY = originalSpeed[index].vY;
            }
        });
    }, 60000)
}

//나쁜 이벤트 - 깨진 벽돌 중에 일부 회복(수리 마법)
function reparo(){

}

//나쁜 이벤트 - 벽돌을 투명하게 하는 마법
function disillusionment(){
    
}

//나쁜 이벤트 - 벽돌 위치 변경 마법
function confundo(){

}
