//수정 필요할 부분:
//뒤로 가기 버튼 위치 수정
//중지 메뉴 css
//중지 메뉴 설정 화면 추가 필요
//게임 화면에서 마우스 클릭시 공이 안 움직임.
//중지 메뉴 버튼 resume함수와 continue함수 수정 필요.
//게임 화면 점수 및 라이프 정보 위치 바꿀 필요.
//초시 벽돌 수량 조절 필요.
//credit화면, setting화면 footer추가 필요
//setting 화면 드럼다운 버튼 활성화 필요
//게임 클리어, 게임 오버 화면 수정 필요, 버튼 활성화 필요.

//게임 로직 js코드
var canvas;
var context;
var totalScore = 0; // 전체 스코어
let darkR; // 시야 반지름

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

function Brick(x, y, width, height, type) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type; // 벽돌 종류. 기본:0, 좋은벽돌:1, 나쁜벽돌:2
    this.alive = true; // 벽돌의 깨짐 유무 표시. true:존재 false:깨짐
}

var startX = 0; // 벽돌 시작 X 위치 조정 가능
var startY = 50; // 벽돌 시작 Y 위치 (캔버스 위쪽에서 떨어진 거리)

// 패들
var paddleWidth = 400; // 너비
var paddleHeight = 50; // 높이
var paddleX = 0; // 초기 x 좌표
var paddleY = 790; // 초기 y 좌표 (캔버스 바닥에서 약간 위)

var balls = []; // 공의 초기 위치와 속도
var ballNum = 0; // 공 개수
const ballR = 10;
var ballTop;
var ballBottom;
var ballLeft;
var ballRight;
var ballMoving = false;

// 공
function Ball(x, y, vX, vY) {
    this.x = x;
    this.y = y;
    this.vX = vX;
    this.vY = vY;
    this.r = ballR // 추가 
}
var drawInterval; // 게임 화면 갱신 인터벌
var countdownInterval // 카운트 인터벌

var isGameRunning = false; // 게임 실행 상태 추적 변
var isGameAllClear = false;
var gameLevel;
var lives = 3; // 목숨 변수

// 공 이미지
var ballImg = new Image();
ballImg.src = "img/attackBall.png";

// 벽돌 이미지 사이즈: 500x100
var brickImg = [];
brickImg[0] = new Image();
brickImg[1] = new Image();
brickImg[0].src = "img/stone/stone_basic.png";
brickImg[1].src = "img/stone/stone_basic.png";

var paddleImg = new Image();
paddleImg.src = 'img/paddle.png';
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

$(document).ready(function () {

    hideAll();
    $("#mainStart").show();

    $("#startButton").click(function () {
        hideAll();
        $("#story").show();
        $("#backButton").show();
        $("#skipButton").show();
    });

    $("#storyStart").click(function () {
        hideAll();
        $("#chooseHouse").show();
        $("#backButton").show();
        $("#skipButton").show();
    });
    $("#settingsButton").click(settingPage);
    $("#creditButton").click(creditPage);
    $("#backButton").click(function () {
        $("#mainStart").show();
    });
    $("#skipButton").click(function () {
        if ($('#story').is(':visible')) {
            // 스토리 화면일 때 -> 기숙사 선택 화면으로 전환
            $('#story').hide();
            $('#chooseHouse').show();
        }
        else if ($('#chooseHouse').is(':visible')) {
            // 기숙사 선택 화면일 때 -> 난이도 선택 화면으로 전환
            $('#chooseHouse').hide();
            $('#difficulty').show();
            if (!selectedHouse) {
                selectedHouse = 'house1';
            }
        } else if ($('#difficulty').is(':visible')) {
            hideAll();
            $("#myCanvas").show();

            applyHouseTheme(selectedHouse);
            $('#chooseHouse').hide();
            $('#gameScreen').show();
            gameInit();
            startGame(selectedHouse);
        }
    });
    $("#houseSelect").click(difficultyPage);

    // 기숙사 -> 난이도 
    let selectedHouse = null;
    $('#houseSelection .house').click(function () {
        selectedHouse = $(this).find('img').attr('id');
        $('.detail p').text($(this).find('h1').text() + ' 선택됨');
    })

    // 학년 선택 버튼 클릭 시 -> 게임 화면
    $('#gradeSelect').click(function () {
        if (!selectedHouse) {
            selectedHouse = 'house1';
        }

        hideAll();
        $("#myCanvas").show();

        applyHouseTheme(selectedHouse);
        $('#chooseHouse').hide();
        $('#gameScreen').show();
        gameInit();
        startGame(selectedHouse);
    });

    $('#resumeBtn').click(function () {
        $('#pauseMenu').hide();
        resumeGame();
    });

    $('#restartBtn').click(function () {
        $('#pauseMenu').hide();
        reset();
        startGame(selectedHouse);
    });
    $('#settingsBtn').click(function () {
        $('#pauseMenu').hide();
        reset();
        //게임화면에 있는 설정창 
    });
    $('#menuBtn').click(function () {
        $('#pauseMenu').hide();
        reset();
        goToMenu();
    });

    canvas = document.getElementById("myCanvas");
    context = canvas.getContext("2d");
    darkR = canvas.width;
    // updateLives();

    $("#pauseBtn").click("click", function () {
        pauseGame();
        resetAll();
        document.getElementById('pauseMenu').style.display = 'block';
    });

    $(".reTry").on("click", function () {
        stage(gameLevel);
    });
    $(".nextGrade").on("click", function () {
        console.log(`Start next stage`);
        stage(++gameLevel);
    });

    $(".dif h1:contains('1')").click(function () {
        stage(1);
    });
    $(".dif h1:contains('2')").click(function () {
        stage(2);
    });
    $(".dif h1:contains('3')").click(function () {
        stage(3);
    });
    $(".dif h1:contains('4')").click(function () {
        stage(4);
    });

    //패들 이동 코드
    $(document).mousemove(function (e) {
        if (!isGameRunning) return;  // 게임 중지 시 패들 이동 막기
        var rect = canvas.getBoundingClientRect();
        var mX = e.clientX - rect.left;

        if (mX < paddleWidth / 2) {
            mX = paddleWidth / 2;
        } else if (mX > canvas.width - paddleWidth / 2) {
            mX = canvas.width - paddleWidth / 2;
        }
        // 이전 패들 위치 지우기
        context.clearRect(
            paddleX - paddleWidth / 2 - 1, // 조금 더 크게 지워줌
            paddleY,
            paddleWidth + 2,
            paddleHeight
        );
        if (isGameRunning) {
            context.fillStyle = "black"
            context.fillRect(
                paddleX - paddleWidth / 2 - 1,
                paddleY,
                paddleWidth + 2,
                paddleHeight
            );
        }
        paddleX = mX; // 마우스 위치에 따라 패들 이동
        // 새로운 패들 위치 그리기
        drawPaddle();
    });
    canvas.addEventListener("click", function () {
        if (!ballMoving && isGameRunning) {
            ballMoving = true;
            console.log("Ball started moving");
        }
    });
});

//난이도별 함수
function stage(n) {
    console.log(`Current stage:${n}`);
    gameLevel = n;
    setDifficulty(n); // 단계 설정
    reset();
    switch (n) {
        case 1:
            musicObj.stopMusic();
            musicObj.playEasy();
            break;
        case 2:
            musicObj.stopMusic();
            musicObj.playNormal();
            break;
        case 3:
            musicObj.stopMusic();
            musicObj.playHard();
            break;
        case 4:
            musicObj.stopMusic();
            musicObj.playHard();
            break;
        default:
    }
    playPage();
}

//난이도 별 벽돌 수
//공 속도(추가 필요)
function setDifficulty(level) {
    brickRow = level + 2;
    brickColumn = 5;
}

function updateScore(score) {
    document.getElementById('score').textContent = 'Score: ' + score;
}
function updateLives(lives) {
    const livesContainer = document.getElementById('lives');
    livesContainer.innerHTML = '';
    for (let i = 0; i < lives; i++) {
        const img = document.createElement('img');
        img.src = 'img/life.png';
        img.className = 'life';
        img.alt = 'Life';
        livesContainer.appendChild(img);
    }
}

function applyHouseTheme(houseId) {
    let gameBgImg = '';
    let gameOverBgImg = '';

    switch (houseId) {
        case 'house1': // Gryffindor - red
            gameBgImg = 'img/background/gameRed.png';
            gameOverBgImg = 'img/background/gameOverRed.png';
            break;
        case 'house2': // Slytherin - green
            gameBgImg = 'img/background/gameGreen.png';
            gameOverBgImg = 'img/background/gameOverGreen.png';
            break;
        case 'house3': // Hufflepuff - yellow
            gameBgImg = 'img/background/gameYellow.png';
            gameOverBgImg = 'img/background/gameOverYellow.png';
            break;
        case 'house4': // Ravenclaw - blue
            gameBgImg = 'img/background/gameBlue.png';
            gameOverBgImg = 'img/background/gameOverBlue.png';
            break;
    }

    // 게임 화면 배경
    $('#myCanvas').css({
        'background-image': `url(${gameBgImg})`,
        'background-size': 'cover',
        'background-position': 'center'
    });

    // 게임 오버 화면 배경
    $('#gameOver').css({
        'background-image': `url(${gameOverBgImg})`,
        'background-size': 'cover',
        'background-position': 'center'
    });

    // 승리 화면 배경 (gradeClear 화면)
    $('#win').css({
        'background-image': `url(${gameOverBgImg})`,
        'background-size': 'cover',
        'background-position': 'center'
    });

    // 실패 화면 배경 (gradeClear 화면)
    $('#fail').css({
        'background-image': `url(${gameOverBgImg})`,
        'background-size': 'cover',
        'background-position': 'center'
    });

}
function reset() {
    // 게임 상태 초기화
    totalScore = 0;
    lives = 3;
    ballMoving = false;
    isGameRunning = false;
    // 공 초기화
    resetBall();
    // 벽돌 초기화
    initBricks();
    // 점수 및 목숨 표시 업데이트
    updateScore(totalScore);
    updateLives(lives);
    // 캔버스 초기화
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function resetAll() {
    clearInterval(drawInterval);
    // document.getElementById('pauseMenu').style.display = 'none';
    totalScore = 0;

    lives = 3;
    balls = [];
    brick = [];
    isBrickMoving = false;
    isGameRunning = false;
    isGameAllClear = false;
    $("#lives").hide();
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// isGameOver 함수 추가
function isGameOver() {
    return lives <= 0;
}
function gameLoop() {
    updateGame();
    drawGame(context);

    if (!isGameOver()) {
        requestAnimationFrame(gameLoop);
    } else {
        gameOver();
    }
}

function gameInit() {
    totalScore = 0;
    lives = 3;
    // 캔버스 초기화 (한 번만 생성되도록 조건 넣어도 됨)
    canvas = document.getElementById('myCanvas');
    canvas.width = 1280;
    canvas.height = 840;
    context = canvas.getContext('2d');

    // 게임 객체 초기화
    resetBall();
    initBricks();

    // 게임 루프 시작
    requestAnimationFrame(gameLoop);
}

//실제 게임 시작 함수
function startGame(house) {
    isGameRunning = true;
    isBrickMoving = true;
    console.log("game start! Selected house:", house);
    context.clearRect(0, 0, canvas.width, canvas.height);

    applyHouseTheme(house);
    gameInit();

}

function pauseGame() {
    // 일시정지 기능 구현 (애니메이션 중지 등)
    isGameRunning = false;
    isBrickMoving = false;
    ballMoving = false;
    clearInterval(drawInterval);
    context.clearRect(0, 0, canvas.width, canvas.height);
}

//pause에서 continue 게임 함수
function resumeGame() {
    document.getElementById('pauseMenu').style.display = 'none';
    isGameRunning = true;
    isBrickMoving = true;
    ballMoving = true;
    requestAnimationFrame(gameLoop);
}

//전체 게임 종료
function gameOver() {
    pauseGame();
    isGameAllClear = false;
    $('#gameOver').show();
}
function gameClear() {
    pauseGame();
    isGameAllClear = true;
    $('#win').show();
}

function nextGrade() {
    // 다음 학년 시작 로직
    document.getElementById('win').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    startNextStage(); // 새 스테이지 초기화
}

// 단일 공 객체
var ball;

// 공 위치 초기화
function resetBall() {
    ball = new Ball(canvas.width / 2, canvas.height - 50, 3, -3);
}

// 게임 상태 갱신
function updateGame() {
    if (ballMoving) {
        ball.x += ball.vX;
        ball.y += ball.vY;

        // 벽에 부딪히면 방향 전환
        if (ball.x + ball.vX > canvas.width - ball.r || ball.x + ball.vX < ball.r) {
            ball.vX = -ball.vX;
        }
        if (ball.y + ball.vY < ball.r) {
            ball.vY = -ball.vY;
        } else if (ball.y + ball.vY > canvas.height - ball.r) {
            // 패들에 부딪히는지 확인
            if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
                ball.vY = -ball.vY;
            } else {
                // 공이 아래로 떨어지면 초기화
                ballMoving = false;
                lives--;
                resetBall();
                updateLives(lives);
            }
        }

    }

    //패들 충돌
    if (
        ball.y + ball.r >= paddleY &&
        ball.x >= paddleX &&
        ball.x <= paddleX + paddleWidth &&
        ball.y <= paddleY + paddleHeight
    ) {
        let hitPoint = (ball.x - (paddleX + paddleWidth / 2)) / (paddleWidth / 2);
        let angle = hitPoint * (Math.PI / 3);
        let speed = Math.sqrt(ball.vX * ball.vX + ball.vY * ball.vY);
        ball.vX = speed * Math.sin(angle);
        ball.vY = -Math.abs(speed * Math.cos(angle));
    }

    //벽돌 충돌
    for (let i = 0; i < brick.length; i++) {
        let b = brick[i];
        if (
            b.alive &&
            ball.x + ball.r >= b.x &&
            ball.x - ball.r <= b.x + brickWidth &&
            ball.y + ball.r >= b.y &&
            ball.y - ball.r <= b.y + brickHeight
        ) {
            ball.vY *= -1;
            b.alive = false;
            totalScore += 10;
            break;
        }
    }

    updateScore(totalScore);
    updateLives(lives);
}
// 초기 벽돌설정
function initBricks() {
    brick = []; // 기존 벽돌 배열 초기화

    brickRow = 3; // 행 수 -> 임의로 설정
    brickColumn = 5; // 열 수
    brickWidth = (canvas.width - (brickColumn - 1) * brickGapX) / brickColumn;
    brickHeight = 30;

    for (let row = 0; row < brickRow; row++) {
        for (let col = 0; col < brickColumn; col++) {
            let x = startX + col * (brickWidth + brickGapX);
            let y = startY + row * (brickHeight + brickGapY);
            let type = 0; // 이벤트 처리시 사용할듯?

            brick.push(new Brick(x, y, brickWidth, brickHeight, type));
        }
    }
}

// 게임 그리기 함수
function drawGame(ctx) {
    if (!isGameRunning) {
        console.log(`그리기 거부`)
        return; // 게임이 중지되면 그리지 않음
    }
    ctx.clearRect(0, 0, 1280, 840);
    drawBall(ctx);
    drawPaddle(ctx);
    drawBricks(ctx);
    // drawLives();
    // drawScore();


    
}

function drawBall(ctx) {
    ctx.drawImage(ballImg, ball.x - 20, ball.y - 20, 40, 40);
}

function drawPaddle(ctx) {
    // ctx.drawImage(paddleImg, paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.drawImage(paddleImg, paddleX - paddleWidth / 2, paddleY, paddleWidth, paddleHeight);
}

function drawBricks(ctx) {
    for (let i = 0; i < brick.length; i++) {
        if (brick[i].alive) {
            // 기본 벽돌 이미지만 사용
            ctx.drawImage(brickImg[0], brick[i].x, brick[i].y, brickWidth, brickHeight);
        }
    }
}
// 점수 위치
function drawScore() {
    context.font = "28px";
    context.fillStyle = "white";
    context.fillText("Score: " + Score, 30, 40); // X=30, Y=40
}

// 라이프 위치
function drawLives() {
    context.font = "38px";
    context.fillStyle = "white";
    context.fillText("Lives: " + lives, 30, 40);
}
function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.getBoundingClientRect().left;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function goToMenu() {
    document.getElementById('pauseMenu').style.display = 'none';
    isGameRunning = false;
    ballMoving = false;
    // 메인 메뉴 보여주기
    hideAll();
    $("#mainStart").show();
}

//좋은 이벤트 - 공의 속도를 느리게 하는 마법
function impedimenta() {
    if (balls.length == 0) return;

    const originalSpeed = [];
    balls.forEach((ball, index) => {
        originalSpeed[index] = { vX: ball.vX, vY: ball.vY };
        ball.vX *= 0.7;
        ball.vY *= 0.7;
    })
    //1분 있으면 원래 속도로 복원
    setTimeout(() => {
        balls.forEach((ball, index) => {
            if (originalSpeed[index]) {
                ball.vX = originalSpeed[index].vX;
                ball.vY = originalSpeed[index].vY;
            }
        });
    }, 60000)
}

//좋은 이벤트 - 공 복제 마법
function geminio(brickX, brickY) {
    balls[ballNum] = new Ball(brickX, brickY, 0, 3); // 아래로 떨어짐.
    //공이 패들에 닿았을 경우 속도 기본 값으로 변경. 패들에 닿는 위치마다 각도 다르게.
    //패들에 닿지 않고 화면 아래쪽으로 사라지면 삭제.
}

//좋은 이벤트 - 상하좌우 폭발 마법
function bombarda(brickR, brickC) {
    //brick 2차원 배열로 저장되어진다고 가정했을 때, 부딪힌 벽돌의 row, col이 인자.
    brick[brickR][brickC].alive = false; // 벽돌 생성 함수 따로 만들어야함. 미구현
    if (brick[brickR - 1][brickC] != null)
        brick[brickR - 1][brickC].alive = false;
    if (brick[brickR + 1][brickC] != null)
        brick[brickR + 1][brickC].alive = false;
    if (brick[brickR][brickC - 1] != null)
        brick[brickR][brickC - 1].alive = false;
    if (brick[brickR][brickC + 1] != null)
        brick[brickR][brickC + 1].alive = false;
    // bombarda함수 및 벽돌에 공 충돌 후에는 벽돌draw함수 재출력
}

//좋은 이벤트 - 빛 생성 마법 (level2 이상에서만 존재)
function lumos(gameLevel) {
    darkR = canvas.width;
    setTimeout(() => {
        nox(gameLevel);
    }, 5000); // 5초 후 다시 어두워질 수 있도록.
}

//나쁜 이벤트 - 공의 속도를 빠르게 하는 마법
function ascendio() { //조금 마법 이름이 기능이랑 조금 다른데 속도 빠르게가 없어서 그나마 비슷한걸루 일단 해놨습니다.
    if (balls.length == 0) return;

    const originalSpeed = [];
    balls.forEach((ball, index) => {
        originalSpeed[index].push({ vX: ball.vX, vY: ball.vY });
        ball.vX *= 1.3;
        ball.vY *= 1.3;
    })
    //1분 있으면 원래 속도로 복원
    setTimeout(() => {
        balls.forEach((ball, index) => {
            if (originalSpeed[index]) {
                ball.vX = originalSpeed[index].vX;
                ball.vY = originalSpeed[index].vY;
            }
        });
    }, 60000)
}

//나쁜 이벤트 - 깨진 벽돌 중에 일부 회복(수리 마법)
function reparo() {

}

//나쁜 이벤트 - 벽돌을 투명하게 하는 마법
function disillusionment() {

}

//나쁜 이벤트 - 벽돌 위치 변경 마법
function confundo() {

}

//레벨2부터 점점 어두워지는 화면 구현
function nox(gameLevel) { // level을 시작할 때 각 level을 받아 2~4 사이 레벨일 때만 nox함수 호출.
    let speed;
    switch (gameLevel) {
        case 2: speed = 1; break;
        case 3: speed = 2; break;
        case 4: speed = 3; break;
        default: speed = 0; break;
    }

    function reducedVisibility() {
        darkR -= speed;
        if (darkR > 50) {
            requestAnimationFrame(reducedVisibility);
        }
    }
    requestAnimationFrame(reducedVisibility);
}

function darkness(context) { // 매 프레임마다 호출하여 실시간으로 어두워질 수 있도록.
    if (gameLevel < 2) return;

    const centerX = paddleX + paddleWidth / 2; // paddleX에 (canvas.width-paddleWidth)/2 들어있다 가정. 영웅이 push하면 그 변수 따라 바꿀게요
    const centerY = paddleY + paddleHeight / 2;

    context.save();
    context.fillStyle = 'rgba(0,0,0,0.8)'; // 반투명(80%)한 어둠
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height); //canvas 너비, 높이 변수명도 영웅이 하고 난 다음 수정보기
    context.arc(centerX, centerY, darkR, 0, Math.PI * 2, true);
    context.closePath();
    context.fill("evenodd");
}
