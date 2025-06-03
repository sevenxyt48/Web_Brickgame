//화면 전환 js코드

$(document).ready(function () {
    const bgmList = [
        "bgm/bgm1.mp3",
        "bgm/bgm2.mp3",
        "bgm/bgm3.mp3",
        "bgm/bgm4.mp3",
    ];

    // 페이지 열리자마자는 재생이 안돼서 클릭 한 번 해야 재생되도록 해놓음
    $(document).on('click', function () {
        musicObj.playMusic(bgmList[0]);
    });

    $("#changeBGM-select").on("change", function () {  // select가 바뀌면 오디오 변경
        const index = parseInt($(this).val());
        if (gameState.isMusicOn) {
            musicObj.playMusic(bgmList[index]);
        } else {
            musicObj.stopMusic();
        }
        // audio.attr("src",bgmList[index]);
        // audio[0].load();
        // audio[0].play();
    });


    // music 버튼 활성화
    $('#musicSwitch').on('change', function () {
        handleMusicToggle(this, bgmList);
    });

    // fullscreen 버튼 활성화
    $('#fullScreenSwitch').on('change', function () {
        handleFullScreenToggle(this);
    });

    $('#changeThemeButton').on('click', function () {
        handleChangeTheme();
    });
});


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

        // gameScreen.style.width = "100%";
        // gameScreen.style.height = "100%";
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
    soundSwitch.checked = true;
    musicSwitch.checked = true;
    fullScreenSwitch.checked = !!document.fullscreenElement;

    // 기존 드롭다운 제거
    const existingDropdown = document.getElementById('themeDropdown');
    if (existingDropdown) {
        existingDropdown.remove();
    }
}

function mainPage() {

    resetAll();
    totalScore = 0; // 점수 초기화 추가
    isCountdownRunning = false; // 카운트다운 상태 초기화 추가

    hideAll();
    $("#mainStart").show();
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

}

function vControl() {
    //설정 음성 컨트롤
}

// 기숙사 설정
function handleChangeTheme() {
    hideAll();
    $("#chooseHouse").show();
}

const settingPause = document.getElementById('settingPause');

//게임화면 설정메뉴
function createSettingsElements() {
    const container = $('#settingPause');
    container.empty();
    container.append('<p>Setting</p>');
    // Music 체크박스
    const musicDiv = document.createElement('div');
    musicDiv.classList.add('choose');
    const musicLabel = document.createElement('label');
    musicLabel.setAttribute('for', 'musicSwitchPause');
    musicLabel.textContent = 'Music';
    const musicCheckbox = document.createElement('input');
    musicCheckbox.type = 'checkbox';
    musicCheckbox.id = 'musicSwitchPause';
    musicCheckbox.checked = true; // 기본값 ON
    musicCheckbox.addEventListener('change', e => {
        if (e.target.checked) {
            console.log('Music ON');
            musicObj.playMusic();
        } else {
            console.log('Music OFF');
            musicObj.stopMusic();
        }
    });
    musicDiv.appendChild(musicLabel);
    musicDiv.appendChild(musicCheckbox);
    container.append(musicDiv);

    // Sound 체크박스
    const soundDiv = $('<div>').addClass('choose');
    const soundLabel = $('<label>').attr('for', 'soundSwitchPause').text('Sound');
    const soundCheckbox = $('<input>').attr({
        type: 'checkbox',
        id: 'soundSwitchPause',
        checked: gameState.isSoundOn
    });
    soundCheckbox.on('change', function () {
        gameState.isSoundOn = $(this).is(':checked');
        console.log(`Sound 상태: ${gameState.isSoundOn}`);
    });
    soundDiv.append(soundLabel).append(soundCheckbox);
    container.append(soundDiv);

    // Full Screen 체크박스
    const fullScreenDiv = document.createElement('div');
    fullScreenDiv.classList.add('choose');
    const fullScreenLabel = document.createElement('label');
    fullScreenLabel.setAttribute('for', 'fullScreenSwitchPause');
    fullScreenLabel.textContent = 'Full Screen';
    const fullScreenCheckbox = document.createElement('input');
    fullScreenCheckbox.type = 'checkbox';
    fullScreenCheckbox.id = 'fullScreenSwitchPause';
    fullScreenCheckbox.checked = false;
    fullScreenCheckbox.addEventListener('change', e => {
        var gameScreen = document.body;
        if (e.target.checked) {
            gameScreen.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });
    fullScreenDiv.appendChild(fullScreenLabel);
    fullScreenDiv.appendChild(fullScreenCheckbox);
    container.append(fullScreenDiv);

    // Change Theme 버튼 수정필요! 테마 선택 페이지로 이동한뒤 다시 설정화면으로 감. 
    const themeDiv = $('<div>').addClass('choose');
    const themeLabel = $('<span>').text('Change Theme');
    const themeButton = $('<button>').attr('id', 'changeThemeButtonPause').text('Click');
    themeButton.on('click', function () {
        handleChangeTheme();
    });
    themeDiv.append(themeLabel).append(themeButton);
    container.append(themeDiv);

    // Back 버튼
    const backDiv = document.createElement('div');
    backDiv.classList.add('choose');
    const backButton = document.createElement('button');
    backButton.id = 'backToPauseMenuBtn';
    backButton.textContent = 'Back';
    backButton.addEventListener('click', () => {
        $('#settingPause').hide();
        $('#pauseMenu').show();
    });
    backDiv.appendChild(backButton);
    container.append(backDiv);
}

