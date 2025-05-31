//화면 전환 js코드

var sound = "";
var music = "";
var chooseColor = "red";
var mVol = 0;
var chMusic = new Audio();

var music = "";
var bgm = "";
var chooseColor = "";
var mVol = 0;
var chMusic = new Audio();

document.addEventListener('DOMContentLoaded', () => {
    // 페이지가 모두 로드된 후 실행되는 코드
    console.log("DOM fully loaded and parsed");

    // 화면 요소들
    const mainStart = document.getElementById('mainStart');
    const story = document.getElementById('story');
    const chooseHouse = document.getElementById('chooseHouse');
    const settings = document.getElementById('settings');
    const credit = document.getElementById('credit');
    const canvas = document.querySelector('canvas');
    // 버튼 요소들
    const startButton = document.getElementById('startButton');
    const settingsButton = document.getElementById('settingsButton');
    const creditButton = document.getElementById('creditButton');

    const storyStartButton = document.getElementById('storyStart');
    const selectButton = document.getElementById("houseSelect");

    const houses = document.querySelectorAll('#houseSelection .house');

    const skipButtons = document.querySelectorAll('#skipButton');
    // const backButton = document.querySelectorAll('#backButton');
    const backButton = document.getElementById('backButton');

    function showScreen(screen) {
        hideAll();
        // document.querySelectorAll('.menu').forEach(s => s.style.display = 'none');
        screen.style.display = 'flex';

        // backButton 표시 여부 및 위치 조정
        if (screen.id === 'mainStart') {
            backButton.style.display = 'none';
            document.querySelector("#startButton").style.display = "block";
            document.querySelector("#settingsButton").style.display = "block";
            document.querySelector("#creditButton").style.display = "block";
        } else {
            backButton.style.display = 'block';

            // 화면별 위치 설정
            backButton.style.top = '';
            backButton.style.left = '';
            backButton.style.right = '35px';
            backButton.style.bottom = '';
            backButton.style.transform = '';
            // if (screen.id === 'story' || screen.id === 'chooseHouse') {
            //     backButton.style.top = '';
            //     backButton.style.left = '';
            //     backButton.style.right = '35px';
            //     backButton.style.bottom = '';
            //     backButton.style.transform = '';
            // } else if (screen.id === 'settings' || screen.id === 'credit') {
            //     backButton.style.top = '';
            //     backButton.style.left = '50%';
            //     backButton.style.bottom = '250px';
            //     backButton.style.transform = 'translateX(-50%)';
            // }
        }
    }

    // 시작화면 → 스토리 화면
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

    // 스토리 화면 → 기숙사 선택 화면
    storyStartButton.addEventListener('click', () => {
        showScreen(chooseHouse);
    });

    // house 클릭 이벤트 추가
    houses.forEach(house => {
        house.addEventListener('click', () => {
            // 모든 house 선택 해제
            houses.forEach(h => h.classList.remove('selected'));
            // 클릭한 house 선택
            house.classList.add('selected');
            selectedHouse = house.querySelector('h1').innerText;
            console.log('선택된 기숙사:', selectedHouse);
        });
    });

    // Skip 버튼 → 기숙사 선택 화면
    skipButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentScreen = Array.from(document.querySelectorAll('.menu'))
                // .find(screen => screen.style.display !== 'none');
                .find(screen => window.getComputedStyle(screen).display !== 'none');
            if (!currentScreen) {
                console.warn('현재 화면을 찾을 수 없습니다.');
                return;
            }

            if (currentScreen.id === 'story') {
                showScreen(chooseHouse);
            } else if (currentScreen.id === 'chooseHouse') {
                if (!selectedHouse) {
                    selectedHouse = 'House1';  // 기본 배경 설정
                    console.log('선택된 기숙사가 없어서 기본으로 House1이 설정됨');
                }
                startGame(selectedHouse);
            }
        });
    });


    // 뒤로가기 → 메인화면
    backButton.addEventListener('click', () => {
        const currentScreen = Array.from(document.querySelectorAll('.menu'))
            // .find(screen => screen.style.display !== 'none');
            .find(screen => window.getComputedStyle(screen).display !== 'none');
        if (!currentScreen) {
            console.warn('현재 화면을 찾을 수 없습니다.');
            return;
        }

        if (currentScreen.id === 'story') {
            showScreen(mainStart);
        } else if (currentScreen.id === 'chooseHouse') {
            showScreen(story);
        } else {
            showScreen(mainStart);
        }
    });

    // 초기 화면 설정
    showScreen(mainStart);
    $("#backButton").hide();
});



    // 사운드 스위치
    soundSwitch.addEventListener('change', function () {
        if (this.checked) {
            console.log("Sound ON");
            // 예시: soundObj.enableSound();
        } else {
            console.log("Sound OFF");
            // 예시: soundObj.disableSound();
        }
    });

    // 음악 스위치
    musicSwitch.addEventListener('change', function () {
        if (this.checked) {
            console.log("Music ON");
            musicObj.playMusic();
        } else {
            console.log("Music OFF");
            musicObj.stopMusic();
        }
    });

    // 풀스크린 스위치
    fullScreenSwitch.addEventListener('change', function () {
        if (this.checked) {
            console.log("Full Screen ON");
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            }
        } else {
            console.log("Full Screen OFF");
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        }
    });

    // 테마 변경 버튼
    changeThemeButton.addEventListener('click', function () {
        musicObj.PlayChoose();
        // 예시: 테마 선택 UI 보여주기
        handleChangeTheme();
    });

    // 초기 화면 설정
    showScreen(mainStart);
    $("#backButton").hide();



// var musicObj = {
//     musicOO: "",
//     // 음악 추가 필요
//     //배경음악 
//     playMusic: function () {
//         this.musicOO = new Audio(bgm);
//         if (mVol == 0) {
//             this.musicOO.volume = mVol;
//         } else {
//             this.musicOO.loop = true;
//             if (bgm == "audio/MainMusic.mp3" || bgm == "audio/MainMusic2.mp3") {
//                 setTimeout(() => {
//                     this.musicOO.play();
//                 }, 10); // 3000 milliseconds = 3 seconds
//             }
//         }
//     },

//     //학년1 난이도 배경음악
//     playEasy: function () {
//         this.musicOO = new Audio("audio/.mp3");
//         this.musicOO.volume = mVol;
//         this.musicOO.loop = true;
//         this.musicOO.play();
//     },

//     //학년2 난이도 배경음악
//     playNormal: function () {
//         this.musicOO = new Audio("audio/.mp3");
//         this.musicOO.volume = mVol;
//         this.musicOO.loop = true;
//         this.musicOO.play();
//     },

//     //학년3 난이도 배경음악
//     playHard: function () {
//         this.musicOO = new Audio("audio/.mp3");
//         this.musicOO.volume = mVol;
//         this.musicOO.loop = true;
//         this.musicOO.play();
//     },

//     //엔딩(졸업) 배경 음악
//     playEnding: function () {
//         this.musicOO = new Audio("audio/.mp3");
//         this.musicOO.volume = mVol;
//         // this.musicOO.loop = true;
//         this.musicOO.play();
//     },

//     //선택 시 효과음
//     PlayChoose: function () {
//         chMusic = new Audio("audio/.mp3");
//         chMusic.volume = 0.8;
//         if (mVol != 0) chMusic.play();
//     },

//     //게임 오버 음악
//     playDeath: function () {
//         this.musicOO = new Audio("audio/.mp3");
//         this.musicOO.volume = mVol;
//         this.musicOO.loop = true;
//         this.musicOO.play();
//     },

//     hoverSound: function () {
//         var hoverMusic = new Audio("audio/.mp3");
//         if (mVol != 0) hoverMusic.play();
//     },

//     //목숨 하나 잃을 때
//     LifeMinusMusic: function () {
//         var LifeMinusMusic = new Audio("audio/.mp3");
//         if (mVol != 0) LifeMinusMusic.play();
//     },

//     //벽돌 효과음
//     playBrick: function (e) {
//         switch (e) {
//         }
//     },

//     //클리어 음악
//     playClear: function () {
//         this.musicOO = new Audio("audio/.mp3");
//         this.musicOO.volume = mVol;
//         this.musicOO.play();
//     },

//     //배경음악 정지
//     stopMusic: function () {
//         this.musicOO.pause();
//         this.musicOO.currentTime = 0;
//     },
//     //배경음악 음소거
//     muteMusic: function () {
//         mVol = 0;
//         this.musicOO.volume = mVol;
//     },
//     //배경음악 음소거 해제
//     unmuteMusic: function () {
//         mVol = 0.5;
//         this.musicOO.volume = mVol;
//     },
// };

function handleSoundToggle() {
    if (this.checked) {
        console.log("Sound ON");
        // musicObj.unmute();
    } else {
        console.log("Sound OFF");
        // musicObj.mute();
    }
}

function handleMusicToggle() {
    if (this.checked) {
        console.log("Music ON");
        musicObj.playMusic();
    } else {
        console.log("Music OFF");
        musicObj.stopMusic();
    }
}


function handleFullScreenToggle() {
    if (this.checked) {
        console.log("Full Screen ON");
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
    } else {
        console.log("Full Screen OFF");
        if (document.fullscreenElement) {
            document.exitFullscreen();
        }
    }
}

function handleChangeTheme() {
    // 드롭다운을 토글하는 코드
    if ($("#themeDropdown").length) {
        $("#themeDropdown").remove();
    } else {
        let dropdown = $("<select id='themeDropdown'></select>");
        dropdown.append("<option value='house1'>Gryffindor</option>");
        dropdown.append("<option value='house2'>Slytherin</option>");
        dropdown.append("<option value='house3'>Hufflepuff</option>");
        dropdown.append("<option value='house4'>Ravenclaw</option>");
        $(this).after(dropdown);

        dropdown.on("change", function () {
            let selectedTheme = $(this).val();
            console.log("선택된 테마:", selectedTheme);
            $("#gameScreen").css("background-image", `url('img/themes/${selectedTheme}.png')`);
            selectedHouse = selectedTheme;
        });
    }
}

// 설정 메뉴
function settingPage() {
    // musicObj.PlayChoose();

    hideAll();
    $("#settings").show();
    $("#backButton").show();

    var button1 = $("#settings .chooseDiv:nth-of-type(1) div.choose:nth-of-type(1)");
    var button2 = $("#settings .chooseDiv:nth-of-type(1) div.choose:nth-of-type(2)");
    var button3 = $("#settings .chooseDiv:nth-of-type(1) div.choose:nth-of-type(3)");

    button1.on("click", function () {
        if ($("#volume").attr("src") != "img/btn/mute.png") {
            music = "1";
            musicObj.stopMusic();
            bgm = "audio/.mp3";
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

function mainPage() {
    musicObj.PlayChoose();
    musicObj.stopMusic();
    musicObj.playMusic();

    resetAll();
    totalScore = 0; // 점수 초기화 추가
    isCountdownRunning = false; // 카운트다운 상태 초기화 추가

    hideAll();
    $("#mainStart").show();
}


//난이도 선택 페이지
function housePage() {
    $('#story').hide();
    $('#chooseHouse').show();
    // $("#backButton").show();
    // hideAll();
    // $("#house").show();
}

//인게임 화면
function playPage() {
    hideAll();
    $("#pauseBtn").show();
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

function backToMainMenu() {
    $('#story').hide();
    $('#settings').hide();
    $('#credit').hide();
    $('#chooseHouse').hide();
    $('#gameScreen').hide();
    $('#victoryScreen').hide();
    $('#gameOverScreen').hide();
    $('#mainStart').show();
    $("#backButton").hide();
}
//페이지 모두 숨기기
function hideAll() {
    //클래스에 속하는 것들은 클래스 단위로 처리
    // $("#gameAllClear").hide();
    // $(".menu").hide();
    // $(".backToMain").hide();
    // $("canvas").hide();
    // //목숨 표시, 시작 버튼 숨기기
    // $("#lives").hide();
    // $("#start").hide();
    // $("#skipButton").hide();

    $("#gameAllClear").hide();
    $("#mainStart").hide();
    $("#story").hide();
    $("#chooseHouse").hide();
    $("#settings").hide();
    $("#credit").hide();
    $("#gameScreen").hide();
    $("#win").hide();
    $("#fail").hide();
    $("#gameOver").hide();
    $("#pauseMenu").hide();
    $("#settingPause").hide();
    // $("#backButton").hide();
    $("#lives").hide();
    $("#start").hide();
    $("#skipButton").hide();
    $("canvas").hide();
}

function vControl() {
    //설정 음성 컨트롤
}