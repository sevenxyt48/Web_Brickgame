//화면 전환 js코드

var sound = "";
var music = "";
var chooseColor = "red";
var mVol = 0;
var chMusic = new Audio();

var music = "";
var bgm = "";
var chooseColor = "green";
var mVol = 0;
var chMusic = new Audio();

document.addEventListener('DOMContentLoaded', () => {
    // 화면 요소들
    const mainStart = document.getElementById('mainStart');
    const story = document.getElementById('story');
    const mainMenu = document.getElementById('mainMenu');
    const settings = document.getElementById('settings');
    const credit = document.getElementById('credit');

    // 버튼 요소들
    const startButton = mainStart.querySelectorAll('.botton')[0];
    const settingsButton = mainStart.querySelectorAll('.botton')[1];
    const creditButton = mainStart.querySelectorAll('.botton')[2];

    const storyStartButton = document.getElementById('start');
    const skipButtons = document.querySelectorAll('#skipButton');
    const backButton = document.getElementById('backButton');

    function showScreen(screen) {
        const allScreens = document.querySelectorAll('.game_start, .menu, .manu');
        allScreens.forEach(s => s.style.display = 'none');
        screen.style.display = 'block';
    }

    // 시작화면 → 설명화면
    startButton.addEventListener('click', () => {
        showScreen(story);
    });

    // 시작화면 → 설정
    settingsButton.addEventListener('click', () => {
        showScreen(settings);
    });

    // 시작화면 → 크레딧
    creditButton.addEventListener('click', () => {
        showScreen(credit);
    });

    // 설명화면 → 기숙사 선택 화면
    storyStartButton.addEventListener('click', () => {
        showScreen(mainMenu);
    });

    // Skip 버튼들 → 기숙사 선택 화면
    skipButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            showScreen(mainMenu);
        });
    });

    // 뒤로가기 → 메인화면
    backButton.addEventListener('click', () => {
        showScreen(mainStart);
    });

    // 초기 화면 설정
    showScreen(mainStart);
});


var musicObj = {
    musicOO: "",
    // 음악 추가 필요
    //배경음악 
    playMusic: function () {
        this.musicOO = new Audio(bgm);
        if (mVol == 0) {
            this.musicOO.volume = mVol;
        } else {
            this.musicOO.loop = true;
            if (bgm == "audio/MainMusic.mp3" || bgm == "audio/MainMusic2.mp3") {
                setTimeout(() => {
                    this.musicOO.play();
                }, 10); // 3000 milliseconds = 3 seconds
            }
        }
    },

    //학년1 난이도 배경음악
    playEasy: function () {
        this.musicOO = new Audio("audio/easyMusic.mp3");
        this.musicOO.volume = mVol;
        this.musicOO.loop = true;
        this.musicOO.play();
    },

    //학년2 난이도 배경음악
    playNormal: function () {
        this.musicOO = new Audio("audio/normalMusic.mp3");
        this.musicOO.volume = mVol;
        this.musicOO.loop = true;
        this.musicOO.play();
    },

    //학년3 난이도 배경음악
    playHard: function () {
        this.musicOO = new Audio("audio/hardMusic.mp3");
        this.musicOO.volume = mVol;
        this.musicOO.loop = true;
        this.musicOO.play();
    },

    //엔딩(졸업) 배경 음악
    playEnding: function () {
        this.musicOO = new Audio("audio/Ending.mp3");
        this.musicOO.volume = mVol;
        // this.musicOO.loop = true;
        this.musicOO.play();
    },

    //선택 시 효과음
    PlayChoose: function () {
        chMusic = new Audio("audio/chooseMp3.mp3");
        chMusic.volume = 0.8;
        if (mVol != 0) chMusic.play();
    },

    //게임 오버 음악
    playDeath: function () {
        this.musicOO = new Audio("audio/GameOver.mp3");
        this.musicOO.volume = mVol;
        this.musicOO.loop = true;
        this.musicOO.play();
    },

    hoverSound: function () {
        var hoverMusic = new Audio("audio/difHover.mp3");
        if (mVol != 0) hoverMusic.play();
    },

    //목숨 하나 잃을 때
    LifeMinusMusic: function () {
        var LifeMinusMusic = new Audio("audio/lifeMinus.mp3");
        if (mVol != 0) LifeMinusMusic.play();
    },

    //벽돌 효과음
    playBrick: function (e) {
        switch (e) {
        }
    },

    //클리어 음악
    playClear: function () {
        this.musicOO = new Audio("audio/clear.mp3");
        this.musicOO.volume = mVol;
        this.musicOO.play();
    },

    //배경음악 정지
    stopMusic: function () {
        this.musicOO.pause();
        this.musicOO.currentTime = 0;
    },
    //배경음악 음소거
    muteMusic: function () {
        mVol = 0;
        this.musicOO.volume = mVol;
    },
    //배경음악 음소거 해제
    unmuteMusic: function () {
        mVol = 0.5;
        this.musicOO.volume = mVol;
    },
};

// 설정 메뉴
function setUpPage() {
    musicObj.PlayChoose();

    hideAll();
    $("#setUp").show();
    $("#backButton").show();

    var button1 = $("#setUp .chooseDiv:nth-of-type(1) div.choose:nth-of-type(1)");
    var button2 = $("#setUp .chooseDiv:nth-of-type(1) div.choose:nth-of-type(2)");
    var button3 = $("#setUp .chooseDiv:nth-of-type(1) div.choose:nth-of-type(3)");

    button1.on("click", function () {
        if ($("#volume").attr("src") != "img/btn/mute.png") {
            music = "1";
            musicObj.stopMusic();
            bgm = "audio/MainMusic.mp3";
            musicObj.playMusic();
            button1.css("background-color", "white");
            button2.css("background-color", "gray");
        }
    });

    button2.on("click", function () {
        if ($("#volume").attr("src") != "img/btn/mute.png") {
            music = "2";
            musicObj.stopMusic();
            bgm = "audio/MainMusic2.mp3";
            musicObj.playMusic();
            button2.css("background-color", "white");
            button1.css("background-color", "gray");
        }
    });

    button3.on("click", function () {
        musicObj.stopMusic();
        musicObj.playMusic();
    });

    button4.on("click", function () {
        chooseColor = "green";
        musicObj.PlayChoose();
        button4.css("background-color", "white");
        button5.css("background-color", "gray");
    });

}

//도움말 페이지
function helpPage() {
    musicObj.PlayChoose();

    hideAll();
    $("#help").show();
    $("#backButton").show();
    $("skipButton").show();
}

function mainPage() {
    musicObj.PlayChoose();
    musicObj.stopMusic();
    musicObj.playMusic();

    resetAll();
    totalScore = 0; // 점수 초기화 추가
    isCountdownRunning = false; // 카운트다운 상태 초기화 추가

    hideAll();
    $("#mainMenu").show();
}


//난이도 선택 페이지
function housePage() {

    musicObj.PlayChoose();

    hideAll();
    $("#difficulty").show();
    $("#backButton").show();
}

//인게임 화면
function playPage() {
    hideAll();
    $("#stopButton").show();
    $("canvas").show();
}

//게임 오버 화면
function gameOverPage() {

    musicObj.stopMusic();
    musicObj.playDeath();
    hideAll();
    $("#gameOver").fadeIn(1500).css({ display: "flex" });
    $(".backToMain").show();
    $("#backButton").hide();
    $("#stopButton").hide();

}

//게임 클리어 화면
function gameClearPage() {
    musicObj.stopMusic();
    musicObj.playClear();
    $(".backToMain").show();
    $("#backButton").hide();
    $("#stopButton").hide();
}


//페이지 모두 숨기기
function hideAll() {
    //클래스에 속하는 것들은 클래스 단위로 처리
    $("#gameAllClear").hide();
    $(".menu").hide();
    $(".backToMain").hide();
    $("canvas").hide();
    //목숨 표시, 시작 버튼 숨기기 추가
    $("#lives").hide();
    $("#startButton").hide();
    $("#skipButton").hide();
}

function vControl() {
    var soundButton = $(
        "#setUp .chooseDiv:nth-of-type(1) div.choose:nth-of-type(3)"
    );
    //음소거 해제 이미지 경로 수정 필요
    if ($("#volume").attr("src") == "img/btn/mute.png") {
        $("#volume").attr("src", "img/btn/sound.png");
        soundButton.css("background-color", "white");
        musicObj.unmuteMusic();
    }
    //음소거 이미지 경로 수정 필요
    else if ($("#volume").attr("src") == "img/btn/sound.png") {
        $("#volume").attr("src", "img/btn/mute.png");
        soundButton.css("background-color", "white");
        musicObj.muteMusic();
    }
}
