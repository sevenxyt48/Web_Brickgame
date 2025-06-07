//수정사항:
//-> sound 삽입
//-> music 껐다 켰을 때 이전 노래 나오도록 수정
//-> gameover 메뉴활성화
//-> 4단계 fail skip하면 1단계로 초기화 (다른 기능이 나으려나? 일단 이렇게 해놓음)
//-> start select 기본값 설정이슈 수정


//화면 전환 js코드
// BGM 리스트
const bgmList = [
    "bgm/bgm1.mp3",
    "bgm/bgm2.mp3",
    "bgm/bgm3.mp3",
    "bgm/bgm4.mp3"
];

$(document).ready(function () {
    vControl();
    $('#changeThemeButton').on('click', function () {
        handleChangeTheme();
    });
});


// 게임 상태 관리 객체
const gameState = {
    selectedHouse: "house1",
    score: 0,
    lives: 3,
    mVol: 0.5,
    isSoundOn: false,
    isMusicOn: false,
    isFullScreen: false,
    currentBgmIndex: 0,
};

// 음악 관리 객체
const musicObj = {
    get audio() {
        return document.getElementById("bgmAudio");
    },

    playMusic(src) {
        const audio = this.audio;
        if (!audio) {
            return;
        }
        if (!src) {
            src = audio.src || "bgm/bgm1.mp3"; // 기본값
        }
        audio.src = src;
        audio.loop = true;
        audio.play().catch(console.log);
    },
    stopMusic() {
        const audio = this.audio;
        if (!audio) {
            return;
        }
        audio.pause();
        audio.currentTime = 0;
    },
    playEffect(src, volume = 0.8) {
        const effect = new Audio(src);
        effect.volume = volume;
        effect.play();
    }
};

function playSoundEffect(soundName) {
    if (!gameState.isSoundOn) return;
    const sound = new Audio(soundName);
    sound.volume = 0.7;
    sound.play();
}

// 페이지 로드 시 음악 상태 반영
if (gameState.isMusicOn) {
    musicObj.playMusic(bgmList[0]);
} else {
    musicObj.stopMusic();
}
//난이도 선택 페이지
function difficultyPage() {
    hideAll();
    $("#difficulty").show();
    $("#backButton").show();
    $("#skipButton").show();
}

// music 버튼 토글 핸들러
function handleMusicToggle(checkbox, bgmList) {
    if (checkbox.checked) {
        musicObj.playMusic(bgmList[0]);
    }
    else if (!checkbox.checked) {
        musicObj.stopMusic();
    }
}

// 전체화면 토글 핸들러
function handleFullScreenToggle(checkbox) {
    var gameScreen = document.body;
    if (checkbox.checked) {
        gameScreen.requestFullscreen();
    }
    else {
        document.exitFullscreen();
    }
}

// 설정 메뉴
function settingPage() {
    hideAll();
    $("#settings").show();
    $("#backButton").show();

    // 상태 초기화
    // soundSwitch.checked = true;
    // musicSwitch.checked = false;
    fullScreenSwitch.checked = !!document.fullscreenElement;

    // 기존 드롭다운 제거
    const existingDropdown = document.getElementById('themeDropdown');
    if (existingDropdown) {
        existingDropdown.remove();
    }
}

function creditPage() {
    hideAll();
    $("#credit").show();
    $("#backButton").show();
}
function storyPage() {
    $('#story').show();
    $("#backButton").show();
}

//인게임 화면
function playPage() {
    hideAll();
    $("#pauseBtn").show();
    $("canvas").show();
    $("#lives").show();
    $("#score").show();
    // 음악 상태에 따라 BGM 재생 또는 정지 처리
    if (gameState.isMusicOn) {
        musicObj.playMusic(bgmList[currentBgmIndex]);
    } else {
        musicObj.stopMusic();
    }
}

//게임 오버 화면
function gameOverPage() {

    musicObj.stopMusic();
    hideAll();
    $("#gameOver").fadeIn(1500).css({ display: "flex" });
    $(".backToMain").show();
    $("#backButton").hide();
    $("#stopButton").hide();

}

//게임 클리어 화면
function gameClearPage() {
    musicObj.stopMusic();
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
    $("#difficulty").hide();
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
    $(".skipButton").hide();
    $("#backButton").hide();
    $('#settingPause').hide();

}

// 메인 메뉴 설정 컨트롤
function vControl() {
    //설정 음성 컨트롤
    const bgm = document.getElementById("bgmAudio");
    const musicSwitch = document.getElementById('musicSwitch');
    musicSwitch.addEventListener('change', function () {
        if (!bgm) return;

        gameState.isMusicOn = this.checked;
        console.log(`Music 상태: ${gameState.isMusicOn}`);

        if (this.checked) {
            musicObj.playMusic(bgmList[gameState.currentBgmIndex]);
        } else {
            musicObj.stopMusic();
        }
        updateSettingsUI();
    });

    // Sound 컨트롤
    const soundSwitch = document.getElementById('soundSwitch');
    soundSwitch.addEventListener('change', function () {
        gameState.isSoundOn = this.checked;
        console.log(`Sound 상태: ${gameState.isSoundOn}`);

        updateSettingsUI();
    });

    // FullScreen 컨트롤
    const fullScreenSwitch = document.getElementById('fullScreenSwitch');
    fullScreenSwitch.addEventListener('change', function () {
        gameState.isFullScreen = this.checked;
        console.log(`FullScreen 상태: ${gameState.isFullScreen}`);

        if (this.checked) {
            document.body.requestFullscreen();
        } else {
            document.exitFullscreen();
        }

        updateSettingsUI();
    });

    // Change BGM select
    const bgmSelect = document.getElementById('changeBGM-select');
    bgmSelect.addEventListener('change', function () {
        gameState.currentBgmIndex = parseInt(this.value, 10);
        const index = parseInt(this.value);

        if (musicSwitch.checked)
            musicObj.playMusic(bgmList[index]);
        console.log(`BGM 변경: ${index + 1}`);

        updateSettingsUI();
    });

    updateSettingsUI();
}

// 인게임 설정 컨트롤
function vControlInGame() {
    // 인게임 muscic 컨트롤
    $('#ingame-musicSwitch').off('change').on('change', function () {
        gameState.isMusicOn = this.checked;
        localStorage.setItem('isMusicOn', this.checked);
        console.log(`Music 상태: ${gameState.isMusicOn}`);

        if (gameState.isMusicOn) {
            musicObj.playMusic(bgmList[gameState.currentBgmIndex]);
        } else {
            musicObj.stopMusic();
        }
        updateSettingsUI();
    });

    // 인게임 Sound 컨트롤
    $('#ingame-soundSwitch').off('change').on('change', function () {
        gameState.isSoundOn = this.checked;
        updateSettingsUI();
        console.log(`Sound 상태: ${gameState.isSoundOn}`);
    });

    // 인게임 FullScreen 컨트롤
    $('#ingame-fullScreenSwitch').off('change').on('change', function () {
        gameState.isFullScreen = this.checked;
        console.log(`FullScreen 상태: ${gameState.isFullScreen}`);
        if (this.checked) {
            document.body.requestFullscreen().catch(err => console.error(err));
        } else {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        }
        updateSettingsUI();
    });

    // 인게임 BGM 컨트롤
    $('#ingame-changeBGM-select').off('change').on('change', function () {
        gameState.currentBgmIndex = parseInt(this.value, 10);
        const index = parseInt(this.value);

        if (gameState.isMusicOn) {
            musicObj.playMusic(bgmList[gameState.currentBgmIndex]);
        }
        console.log(`BGM 변경: ${index + 1}`);
        updateSettingsUI();
    });

    // 인게임 기숙사 변경
    $('#houseSelectPause').off('change').on('change', function () {
        gameState.selectedHouse = this.value;
        console.log(`기숙사 변경됨: ${gameState.selectedHouse}`);
        applyHouseTheme(gameState.selectedHouse);
        updateSettingsUI();
    });

    // 뒤로가기 버튼
    $('#backToPauseMenuBtn').off('click').on('click', function () {
        $('#settingPause').hide();
        $('#pauseMenu').show();
    });
}

// 설정 동기화
function updateSettingsUI() {
    const { isSoundOn, isMusicOn, isFullScreen, currentBgmIndex, selectedHouse } = gameState;

    $('#soundSwitch').prop('checked', isSoundOn);
    $('#musicSwitch').prop('checked', isMusicOn);
    $('#fullScreenSwitch').prop('checked', isFullScreen);
    $('#changeBGM-select').val(currentBgmIndex);

    $('#ingame-soundSwitch').prop('checked', isSoundOn);
    $('#ingame-musicSwitch').prop('checked', isMusicOn);
    $('#ingame-fullScreenSwitch').prop('checked', isFullScreen);
    $('#ingame-changeBGM-select').val(currentBgmIndex);
    $('#houseSelectPause').val(selectedHouse);
}

// 기숙사 설정
function handleChangeTheme() {
    hideAll();
    $("#chooseHouse").show();
}

