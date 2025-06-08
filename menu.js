//수정사항:
//-> 중복 함수, 필요없는 함수 제거
//-> 풀스크린 기능 수정


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

    // 풀스크린 상태가 변경될 때마다 UI와 스케일 업데이트
    document.addEventListener('fullscreenchange', () => {
        gameState.isFullScreen = !!document.fullscreenElement;
        updateSettingsUI();
        updateGameScale();  
    });
    window.addEventListener('resize', updateGameScale);
    updateGameScale();
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
    }
};

// 풀스크린 스케일 조절
function updateGameScale() {
    const container = document.getElementById('container');
    if (!container) return;

    if (!document.fullscreenElement) {
        container.style.transform = ''; 
        return;
    }

    const gameWidth = 1280;
    const gameHeight = 840;
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const scale = Math.min(screenWidth / gameWidth, screenHeight / gameHeight);

    container.style.transform = `scale(${scale})`;
}


function toggleFullScreen() {
    if (!document.fullscreenElement) {

        document.body.requestFullscreen().catch(err => console.log(err));
    } else {
        document.exitFullscreen();
    }
}


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

// 설정 메뉴
function settingPage() {
    hideAll();
    $("#settings").show();
    $("#backButton").show();
}

function creditPage() {
    hideAll();
    $("#credit").show();
    $("#backButton").show();
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
    fullScreenSwitch.addEventListener('change', toggleFullScreen); // 간단하게 토글 함수만 호출

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
    $('#ingame-fullScreenSwitch').off('change').on('change', toggleFullScreen); // 간단하게 토글 함수만 호출


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