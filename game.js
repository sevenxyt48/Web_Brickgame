//!!!!!!수정 완료한 부분을 삭제해주세요:
//특수 벽돌 이벤트
//효과음 넣기 
//게임 마지막 단계일때 실패하면 다음 skip하면 게임 졸업화면으로 자동으로 넘어가나요?


//수정 사항:




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

function Brick(x, y, width, height, type, magic) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.type = type; // 벽돌 종류. 기본:0, 좋은벽돌:1, 나쁜벽돌:2
    this.magic = magic;
    this.alive = true; // 벽돌의 깨짐 유무 표시. true:존재 false:깨짐
    this.opacity = 1.0 // 벽돌 투명해지기 마법을 위한 요소. 처음엔 전부 불투명명
}x

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
var currentSpeed = 10;
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

const levelSettings = {
    1: {
        rows: 3,
        cols: 5,
        goodBricks: 3,
        badBricks: 1
    },
    2: {
        rows: 4,
        cols: 5,
        goodBricks: 4,
        badBricks: 2
    },
    3: {
        rows: 5,
        cols: 5,
        goodBricks: 4,
        badBricks: 4
    },
    4: {
        rows: 6,
        cols: 5,
        goodBricks: 3,
        badBricks: 7
    }
};

// 마법 리스트
const goodMagicList = ['impedimenta', 'geminio', 'bombarda', 'lumos'];
const badMagicList = ['ascendio', 'reparo', 'disillusionment', 'confundo'];

$(document).ready(function () {
    console.log("Document ready! Music object is safe to use.");

    $("#lives").hide();
    hideAll();
    $("#mainStart").show();
    $("#gameScreen").on("click", () => {
        if (!ballMoving && isGameRunning) ballMoving = true;
        $("#lives").show();
    });

    $("#startButton").click(function () {

        hideAll();
        $("#story").show();
        $("#backButton").show();
        $("#skipButton").show();

    });

    $("#storyStart").click(function () {
        hideAll();
        $('#difficulty').show();
        $("#backButton").show();
        $("#skipButton").show();
    });

    $("#settingsButton").click(settingPage);
    $("#creditButton").click(creditPage);

    $("#backButton").click(function () {
        $("#mainStart").show();
        $("#backButton").hide();
        $("#skipButton").hide();
    });

    $("#skipButton").click(function () {
        if ($('#story').is(':visible')) {
            // 스토리 화면일 때 -> 난이도 화면으로 전환
            $('#story').hide(); ''
            $('#difficulty').show();
            if (!selectedHouse) {
                selectedHouse = 'house1'; // 기본 기숙사 선택
            }
        }//난이도 -> 게임화면
        else if ($('#difficulty').is(':visible')) {
            if (!selectedHouse) {
                selectedHouse = 'house1';
            }
            if (!gameLevel) gameLevel = 1;
            // stage(gameLevel);
            hideAll();
        $("#myCanvas").show();

        applyHouseTheme(selectedHouse);
        $('#chooseHouse').hide();
        $('#gameScreen').show();
        gameInit(gameLevel);
        startGame(selectedHouse);
        }
    });
    $("#houseSelect").click(function () {
        hideAll();
        $('#settings').show();
        $("#backButton").show();

    });

    // 기숙사 선택 동적 화면 
    let selectedHouse = null;
    $('#houseSelection .house').click(function () {
        selectedHouse = $(this).find('img').attr('id');
        $('.detail p').text($(this).find('h1').text() + ' 선택됨');
    })

    // 학년 선택 버튼 클릭 시 -> 게임 화면
    $('#gradeSelect').click(function () {

        if (!gameLevel) gameLevel = 1;
        if (!selectedHouse) {
            selectedHouse = 'house1';
        }
        // stage(gameLevel);
        hideAll();
        $("#myCanvas").show();

        applyHouseTheme(selectedHouse);
        $('#chooseHouse').hide();
        $('#gameScreen').show();
        gameInit(gameLevel);
        startGame(selectedHouse);
    });
    createSettingsElements();
    $("#pauseBtn").click(function () {
        pauseGame();
        // resetAll(selectedHouse);
        $('#pauseMenu').show();
    });

    $('#continueBtn').click(function () {
        $('#pauseMenu').hide();
        continueGame();
    });

    $('#restartBtn').click(function () {
        $('#pauseMenu').hide();
        reset(gameLevel);
        startGame(selectedHouse);
    });

    $('#settingsBtn').click(function () {
        console.log(`click settingBtn`);
        //게임화면에 있는 설정창
        $('#settingPause').show();
        createSettingsElements();
    });
    $('#menuBtn').click(function () {
        reset(gameLevel);
        updateLives(lives);
        $('#gradeSelection .dif').removeClass('selected');
        goToMenu();
    });

    canvas = document.getElementById("myCanvas");
    context = canvas.getContext("2d");
    darkR = canvas.width;
    // updateLives(lives);

    $(".reTry").on("click", function () {
        stage(gameLevel);
    });
    $(".nextGrade").on("click", function () {
        console.log(`Start next stage`);
        stage(++gameLevel);
    });
    $('#backToMain').click(function () {
        goToMenu();
    });
    $('#gradeSelection .dif').click(function () {
        $('#gradeSelection .dif').removeClass('selected');
        $(this).addClass('selected');

        const selectedGradeId = $(this).attr('id');
        if (selectedGradeId === 'grade1') {
            gameLevel = 1;
        } else if (selectedGradeId == 'grade2') {
            gameLevel = 2;
        } else if (selectedGradeId == 'grade3') {
            gameLevel = 3;
        } else if (selectedGradeId == 'grade4') {
            gameLevel = 4;
        }
        console.log("선택된 난이도: " + gameLevel);
    });

    // $("#grade1").click(function () {
    //     stage(1);
    // });
    // $("#grade2").click(function () {
    //     stage(2);
    // });
    // $("#grade3").click(function () {
    //     stage(3);
    // });
    // $("#grade4").click(function () {
    //     stage(4);
    // });

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
        // drawPaddle();
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
    reset(gameLevel);
    $("#lives").show();

    hideAll();
    $("#myCanvas").show();
    $("#gameScreen").show();

    if (!selectedHouse) {
        selectedHouse = "house1";
    }
    applyHouseTheme(selectedHouse);

    startGame(selectedHouse);
}

//난이도 별 벽돌 수
//공 속도(추가 필요)
// function setDifficulty(level) {
//     brickRow = level + 2;
//     brickColumn = 5;
// }

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
function reset(difficulty) {
    // 게임 상태 초기화
    totalScore = 0;
    lives = 3;
    ballMoving = false;
    isGameRunning = false;
    isGameAllClear = false;

    // 캔버스 초기화
    context.clearRect(0, 0, canvas.width, canvas.height);

    // 공 초기화
    resetBall();
    // 벽돌 초기화
    initBricks(difficulty);
    // 점수 및 목숨 표시 업데이트
    updateScore(totalScore);
    updateLives(lives);

}

function resetAll() {
    clearInterval(drawInterval);
    // document.getElementById('pauseMenu').style.display = 'none';
    totalScore = 0;
    isBrickMoving = false;
    isGameRunning = false;
    isGameAllClear = false;
    lives = 3;
    // balls = [];
    brick = [];
    $("#lives").hide();
    context.clearRect(0, 0, canvas.width, canvas.height);
}

// isGameOver
function isGameOver() {
    return lives <= 0;
}
function gameLoop() {
    if (!isGameRunning) return;
    updateGame();
    drawGame(context);
    requestAnimationFrame(gameLoop);
}

function gameInit(gameLevel) {
    totalScore = 0;
    lives = 3;
    // 캔버스 초기화 (한 번만 생성되도록 조건 넣어도 됨)
    canvas = document.getElementById('myCanvas');
    canvas.width = 1280;
    canvas.height = 840;
    context = canvas.getContext('2d');

    // 게임 객체 초기화
    resetBall();
    initBricks(gameLevel);

    // 게임 루프 시작
    // requestAnimationFrame(gameLoop);
}

//실제 게임 시작 함수
function startGame(house) {
    isGameRunning = true;
    isBrickMoving = true;
    console.log("game start! Selected house:", house);
    context.clearRect(0, 0, canvas.width, canvas.height);

    applyHouseTheme(house);
    gameInit(gameLevel);

    if(gameLevel >= 2){
        lumos(gameLevel);
    }

    if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(gameLoop);
    }

}

let animationFrameId = null;

function pauseGame() {
    // 일시정지 기능 구현 (애니메이션 중지 등)
    isGameRunning = false;
    isBrickMoving = false;
    ballMoving = false;

    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    // clearInterval(drawInterval);
    // context.clearRect(0, 0, canvas.width, canvas.height);
}

//pause에서 continue 게임 함수
function continueGame() {
    document.getElementById('pauseMenu').style.display = 'none';
    isGameRunning = true;
    isBrickMoving = true;
    ballMoving = true;
    // drawBricks(context);
    if (!animationFrameId) {
        animationFrameId = requestAnimationFrame(gameLoop);
    }
}

//전체 게임 종료(4단계 다 클리어)
function gameOver() {
    pauseGame();
    isGameAllClear = true;
    //score visible
    document.querySelector('#gameOver .score').textContent = 'Score: ' + totalScore;

    $('#gameOver').show();
}
//게임 클리어(승리) 다음학년으로 
function gameClear() {
    pauseGame();
    isGameAllClear = false;
    //score visible
    document.querySelector('#win .score').textContent = 'Score: ' + totalScore;
    $('#win').show();
}
//게임 클리어(실패 Lives=0) 다음학년으로
function gameFail() {
    pauseGame();
    isGameAllClear = false;
    //score visible
    document.querySelector('#fail .score').textContent = 'Score: ' + totalScore;

    $('#fail').show();
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
    balls = [];
    ball = new Ball(canvas.width / 2, canvas.height - 50, 3, -3);
    balls.push(ball);

}

// 게임 상태 갱신
function updateGame() {
    balls.forEach(ball => {
        if (!ballMoving) return;  // ballMoving이 false면 공 이동X

        // 공을 이동
        ball.x += ball.vX;
        ball.y += ball.vY;

        // 좌/우 벽 충돌
        if (ball.x - ball.r < 0) {
            ball.x = ball.r;
            ball.vX = -ball.vX;
        } else if (ball.x + ball.r > canvas.width) {
            ball.x = canvas.width - ball.r;
            ball.vX = -ball.vX;
        }

        // 위쪽 벽 충돌
        if (ball.y - ball.r < 0) {
            ball.y = ball.r;
            ball.vY = -ball.vY;
        }

        // 아래쪽(바닥 혹은 패들 영역) 충돌 처리
        if (ball.y + ball.r >= paddleY) {
            // -- 패들 영역 x 범위인 경우 →
            if (ball.x + ball.r >= paddleX && ball.x - ball.r <= paddleX + paddleWidth) {
                // 패들에 닿음 → 반사 각도 계산
                const relativeIntersectX = ball.x - (paddleX + paddleWidth / 2);
                const normalized = relativeIntersectX / (paddleWidth / 2);
                const maxBounceAngle = Math.PI / 3; // 60도
                const bounceAngle = normalized * maxBounceAngle;

                // 공이 패들 위에 붙어서 뚫고 가지 않도록 y 위치 보정
                ball.y = paddleY - ball.r - 1;

                // 고정 속도(currentSpeed)로 방향만 재설정
                ball.vX = currentSpeed * Math.sin(bounceAngle);
                ball.vY = -Math.abs(currentSpeed * Math.cos(bounceAngle));
            }
            else if (ball.y + ball.r > canvas.height) {
                // 패들 범위도 아니고 바닥으로 떨어진 경우 → 목숨 차감 & 재생성
                lives--;
                resetBall();   // balls 배열을 재생성하거나, 공을 리셋하는 함수로 이동
                updateLives(lives);
                ballMoving = false; // 공 멈추고, 다음 클릭 때 재발사

                if (lives <= 0) {
                    gameFail();//실패 처리
                }
            }
        }
    });

    //패들 충돌
    balls.forEach(ball => {

        if (ball.y + ball.r >= paddleY) {
            const paddleLeft = paddleX - paddleWidth / 2;
            const paddleRight = paddleX + paddleWidth / 2;

            // 공이 패들 가로 범위 안에 들어왔는지 확인
            if (ball.x + ball.r >= paddleLeft && ball.x - ball.r <= paddleRight) {
                // 패들에 닿았다면 반사
                const relativeIntersectX = ball.x - paddleX;
                const normalized = relativeIntersectX / (paddleWidth / 2);
                const maxBounceAngle = Math.PI / 3;
                const bounceAngle = normalized * maxBounceAngle;

                // 공이 패들 안쪽으로 약간 파고들지 않도록 Y 위치 보정
                ball.y = paddleY - ball.r - 1;

                ball.vX = currentSpeed * Math.sin(bounceAngle);
                ball.vY = -Math.abs(currentSpeed * Math.cos(bounceAngle));
            }
        }
    });


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
            if (b.magic != null) {
                setMagic(b.magic, b.x, b.y);
            }
            break;
        }
    }

    updateScore(totalScore);
    // updateLives(lives);

    const remainingBricks = brick.filter(b => b.alive);
    if (remainingBricks.length === 0) {
        if (gameLevel < 4) {
            gameClear();//게임 클리어 (다음 학년으로)
        } else {
            gameOver();//4단계 종료 시 졸업 화면
        }
    }
}

//magic 적용
function setMagic(magic, brickX, brickY) {
    switch (magic) {
        case "impedimenta":
            impedimenta();
            console.log('impedimenta');
            break;
        // case "geminio":
        //     geminio(brickX, brickY);
        //     break;
        case "bombarda":
            bombarda(brickX, brickY);
            console.log('bombarda');
            break;
        case "lumos":
            lumos(gameLevel);
            console.log('lumos');
            break;
        case "ascendio":
            ascendio();
            console.log('ascendio');
            break;
        case "reparo":
            reparo();
            console.log('reparo');
            break;
        case "disillusionment":
            disillusionment();
            console.log('disillusionment');
            break;
        // case "confundo":
        //     confundo();
        //     break;
        default:
            break;
    }
}

// 초기 벽돌설정
function initBricks(difficulty) {
    const setting = levelSettings[difficulty];
    brickRow = setting.rows;
    brickColumn = setting.cols;
    brickWidth = (canvas.width - (brickColumn - 1) * brickGapX) / brickColumn;
    brickHeight = 30;
    brick = [];

    let totalBricks = brickRow * brickColumn;
    let indices = Array.from({ length: totalBricks }, (_, i) => i);
    shuffle(indices);

    const goodIndices = indices.splice(0, setting.goodBricks);
    const badIndices = indices.splice(0, setting.badBricks);

    // 레벨별 매직 리스트 분기
    let goodList = [];
    let badList = [];

    if (difficulty == 1) {
        goodList = ['impedimenta', 'geminio', 'bombarda'];
        badList = ['ascendio', 'reparo', 'disillusionment', 'confundo'];
    } else {
        goodList = ['impedimenta', 'geminio', 'bombarda', 'lumos'];
        badList = ['ascendio', 'reparo', 'disillusionment', 'confundo'];
    }

    for (let row = 0; row < brickRow; row++) {
        for (let col = 0; col < brickColumn; col++) {
            const i = row * brickColumn + col;
            let x = startX + col * (brickWidth + brickGapX);
            let y = startY + row * (brickHeight + brickGapY);

            let type = 0;
            let magic = null;

            if (goodIndices.includes(i)) {
                type = 1;
                magic = getRandomFrom(goodList);
            } else if (badIndices.includes(i)) {
                type = 2;
                magic = getRandomFrom(badList);
            }

            brick.push(new Brick(x, y, brickWidth, brickHeight, type, magic));
        }
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getRandomFrom(list) {
    return list[Math.floor(Math.random() * list.length)];
}

// 게임 그리기 함수
function drawGame(ctx) {
    // if (!isGameRunning) {
    //     console.log(`그리기 거부`);
    //     return; // 게임이 중지되면 그리지 않음
    // }
    ctx.clearRect(0, 0, 1280, 840);
    drawBall(ctx);
    drawPaddle(ctx);
    drawBricks(ctx);
    darkness(ctx);

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
            ctx.save();
            ctx.globalAlpha = brick[i].opacity ?? 1.0;
            // 기본 벽돌 이미지만 사용
            if (brick[i].type == 1) {
                ctx.drawImage(goodImg, brick[i].x, brick[i].y, brickWidth, brickHeight);
            }
            else if (brick[i].type == 2) {
                ctx.drawImage(badImg, brick[i].x, brick[i].y, brickWidth, brickHeight);
            }
            else {
                ctx.drawImage(brickImg[0], brick[i].x, brick[i].y, brickWidth, brickHeight);
            }
            ctx.restore();
        }
    }
}

function mouseMoveHandler(e) {
    const relativeX = e.clientX - canvas.getBoundingClientRect().left;
    if (relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

function goToMenu() {
    console.log("goToMenu called");
    document.getElementById('pauseMenu').style.display = 'none';
    isGameRunning = false;
    ballMoving = false;
    // 메인 메뉴 보여주기
    hideAll();
    $("#mainStart").show();
    $("#skipButton").hide();

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
function bombarda(brickX, brickY) {
    const index = brick.findIndex(brick => brick.x == brickX && brick.y == brickY);
    brick[index].alive = false;
    if (brick[index - brickColumn] != null)
        brick[index - brickColumn].alive = false;
    if (brick[index + brickColumn] != null)
        brick[index + brickColumn].alive = false;
    if (brick[index + 1] != null)
        brick[index + 1].alive = false;
    if (brick[index - 1] != null)
        brick[index - 1].alive = false;
    drawBricks(context);

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
        originalSpeed[index] = { vX: ball.vX, vY: ball.vY };
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
    // 필요한 것
    // 깨진 블럭의 개수
    var nonAliveNum = 0;
    var nonAliveBricks=[];
    for(var index = 0;  index < brick.length; index++){
        if(brick[index].magic != "reparo"){
            if(!brick[index].alive){ 
                nonAliveNum++;
                nonAliveBricks.push(index);
             }
         }
    }
    shuffle(nonAliveBricks);
var repairNum = Math.min(
    Math.floor(Math.random() * (nonAliveNum + 1)),
    nonAliveBricks.length);

    for(var index = 0; index < repairNum; index++){
        brick[nonAliveBricks[index]].alive = true;
    }
}

//나쁜 이벤트 - 벽돌을 투명하게 하는 마법
function disillusionment() {
    for (let i = 0; i < brick.length; i++) {
        brick[i].opacity = 0.1;
    }

    for (let i = 0; i < brick.length; i++) {
        setTimeout(() => {
            brick[i].opacity = 1.0;
        }, 10000)
    }
}

//나쁜 이벤트 - 벽돌 위치 변경 마법
function confundo() {

}

//레벨2부터 점점 어두워지는 화면 구현
function nox(gameLevel) { // level을 시작할 때 각 level을 받아 2~4 사이 레벨일 때만 nox함수 호출.
    let speed;
    switch (gameLevel) {
        case 2: speed = 0.5; break;
        case 3: speed = 1; break;
        case 4: speed = 1.5; break;
        default: speed = 0; break;
    }

    function reducedVisibility() {
        darkR -= speed;
        if (darkR > paddleWidth) {
            requestAnimationFrame(reducedVisibility);
        }
    }
    requestAnimationFrame(reducedVisibility);
}

function darkness(context) { // 매 프레임마다 호출하여 실시간으로 어두워질 수 있도록.
    if (gameLevel < 2) return;

    const centerX = paddleX; // paddleX에 (canvas.width-paddleWidth)/2 들어있다 가정. 영웅이 push하면 그 변수 따라 바꿀게요
    const centerY = paddleY;

    context.save();
    context.fillStyle = 'rgba(0,0,0,0.8)'; // 반투명(80%)한 어둠
    context.beginPath();
    context.rect(0, 0, canvas.width, canvas.height);
    context.arc(centerX, centerY, darkR, 0, Math.PI * 2, true);
    context.closePath();
    context.fill("evenodd");
}
