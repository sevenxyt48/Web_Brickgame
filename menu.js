//화면 전환 js코드

// 게임 상태 관리 객체
const gameState = {
    selectedHouse: "house1",
    mVol: 0.5,
    isSoundOn: true,
    isMusicOn: true,
    isFullScreen: false,
};

// 음악 관리 객체
const musicObj = {
    musicOO: null,
    playMusic(bgm) {
        this.stopMusic();
        this.musicOO = new Audio(bgm);
        this.musicOO.volume = gameState.mVol;
        this.musicOO.loop = true;
        this.musicOO.play();
    },
    stopMusic() {
        if (this.musicOO) {
            this.musicOO.pause();
            this.musicOO.currentTime = 0;
        }
    },
    playEffect(src, volume = 0.8) {
        const effect = new Audio(src);
        effect.volume = volume;
        effect.play();
    },
};
document.addEventListener('DOMContentLoaded', () => {
    // 페이지가 모두 로드된 후 실행되는 코드
    console.log("DOM fully loaded and parsed");

    // 화면 요소들
    const mainStart = document.getElementById('mainStart');
    const story = document.getElementById('story');
    const chooseHouse = document.getElementById('chooseHouse');
    const settings = document.getElementById('settings');
    const credit = document.getElementById('credit');
    const canvas = document.querySelector('#myCanvas');
    // 버튼 요소들
    const startButton = document.getElementById('startButton');
    const creditButton = document.getElementById('creditButton');
    const settingsButton = document.getElementById('settingsButton');
    const storyStartButton = document.getElementById('storyStart');
    const selectButton = document.getElementById("houseSelect");

    const houses = document.querySelectorAll('#houseSelection .house');

    const skipButtons = document.querySelectorAll('.skipButton');
    const backButtons = document.querySelectorAll('.backButton');
    // const backButton = document.getElementById('backButton');

    // 스위치 요소 가져오기
    const soundSwitch = document.getElementById('soundSwitch');
    const musicSwitch = document.getElementById('musicSwitch');
    const fullScreenSwitch = document.getElementById('fullScreenSwitch');
    const changeThemeButton = document.getElementById('changeTheme');

    function showScreen(screen) {
        hideAll();
        screen.style.display = 'flex';

        // Skip 버튼 표시/숨김 스토리화면과 기숙사 선택 화면에 버튼 안 보임.
        skipButtons.forEach(btn => {
            console.log('Skip button:', btn, 'Current screen:', screen.id);
            if (screen.id === 'story' || screen.id === 'chooseHouse') {
                // btn.style.display = 'block';
                btn.style.setProperty('display', 'inline-block', 'important');
            } else {
                btn.style.display = 'none';
            }
        });

        // Back 버튼 표시/숨김 스토리화면과 기숙사 선택 화면에 버튼 안 보임.
        backButtons.forEach(btn => {
            if (screen.id === 'mainStart') {
                btn.style.display = 'none';
            } else if (screen.id === 'story' || screen.id === 'chooseHouse') {
                btn.style.display = 'inline-block';
                // 위치 설정
                btn.style.top = '10px';
                btn.style.left = '';
                btn.style.right = '35px';
                btn.style.bottom = '';
                btn.style.transform = '';
            } else if (screen.id === 'settings' || screen.id === 'credit') {
                btn.style.display = 'inline-block';
                btn.style.top = '';
                btn.style.left = '50%';
                btn.style.bottom = '250px';
                btn.style.transform = 'translateX(-50%)';
            } else {
                btn.style.display = 'none';
            }
        });

    }

    // 시작화면 → 스토리 화면
    startButton.addEventListener('click', () => {
        showScreen(story);
        // storyPage();
    });

    // 시작화면 → 설정
    settingsButton.addEventListener('click', () => {
        showScreen(settings);
        settingPage();
    });


    // 시작화면 → 크레딧
    creditButton.addEventListener('click', () => {
        showScreen(credit);
    });

    // 스토리 화면 → 기숙사 선택 화면
    storyStartButton.addEventListener('click', () => {
        showScreen(chooseHouse);
        housePage();
    });

    gameState.selectedHouse = houses.querySelector('h1').innerText;
    // house 클릭 이벤트 추가
    houses.forEach(house => {
        house.addEventListener('click', () => {
            // 모든 house 선택 해제
            houses.forEach(h => h.classList.remove('selected'));
            // 클릭한 house 선택
            house.classList.add('selected');
            gameState.selectedHouse = house.querySelector('h1').innerText;;
            console.log('선택된 기숙사:', selectedHouse);
        });
    });

    // Skip 버튼 → 기숙사 선택 화면
    skipButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentScreen = Array.from(document.querySelectorAll('.menu'))
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


    // 뒤로가기
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const currentScreen = Array.from(document.querySelectorAll('.menu'))
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
});



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
    hideAll();
    $("#settings").show();
    $("#backButton").show();

    // 상태 초기화
    soundSwitch.checked = true;
    musicSwitch.checked = true;
    fullScreenSwitch.checked = !!document.fullscreenElement;

    // 드롭다운이 열려있으면 닫기
    $("#themeDropdown").remove();
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
function storyPage() {
    $('#story').show();
    $("#backButton").show();
    $(".skipButton").show();
}

//난이도 선택 페이지
function housePage() {
    $('#story').hide();
    $('#chooseHouse').show();
    $("#backButton").show();
    // $(".skipButton").show();
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
    $("#lives").hide();
    $("#start").hide();
    $("canvas").hide();
    // $(".skipButton").hide();
    $("#backButton").hide();

}

function vControl() {
    //설정 음성 컨트롤
}
