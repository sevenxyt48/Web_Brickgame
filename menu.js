//화면 전환 js코드

$(document).ready(function () {
    const bgmList = [
        "bgm/bgm1.mp3",
        "bgm/bgm2.mp3",
        "bgm/bgm3.mp3",
        "bgm/bgm4.mp3",
    ];

    // 페이지 열리자마자는 재생이 안돼서 클릭 한 번 해야 재생되도록 해놓음
    $(document).one('click', function () {
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

    // // 드롭다운이 열려있으면 닫기
    // $("#themeDropdown").remove();
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
    // $('#settingPause').hide();

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

// 생성할 항목 리스트
const settingsOptions = [
    {
        label: 'Sound',
        type: 'checkbox',
        id: 'soundSwitchPause'
    },
    {
        label: 'Music',
        type: 'checkbox',
        id: 'musicSwitchPause'
    },
    {
        label: 'Full Screen',
        type: 'checkbox',
        id: 'fullScreenSwitchPause'
    },
    {
        label: 'Change Theme',
        type: 'button',
        id: 'changeThemeButtonPause',
        text: 'Click'
    },
    {
        label: 'Change BGM',
        type: 'select',
        id: 'changeBGMPause',
        options: ['BGM 1', 'BGM 2', 'BGM 3', 'BGM 4']
    },
    {
        label: '',
        type: 'button',
        id: 'backToPauseMenuBtn',
        text: 'Back'
    }
];

// 중지메뉴에 있는 설정 메뉴 함수
function createSettingsElements() {
    settingsOptions.forEach(option => {
        const container = document.createElement('div');
        container.classList.add('choose');

        if (option.type === 'checkbox') {
            const label = document.createElement('label');
            label.setAttribute('for', option.id);
            label.textContent = option.label;
            const input = document.createElement('input');
            input.type = 'checkbox';
            input.id = option.id;
            container.appendChild(label);
            container.appendChild(input);
        }
        else if (option.type === 'button') {
            const label = document.createElement('span');
            label.textContent = option.label;
            const button = document.createElement('button');
            button.id = option.id;
            button.textContent = option.text;
            container.appendChild(label);
            container.appendChild(button);
        }
        else if (option.type === 'select') {
            const label = document.createElement('label');
            label.setAttribute('for', option.id);
            label.textContent = option.label;
            const select = document.createElement('select');
            select.id = option.id;
            option.options.forEach((optText, index) => {
                const opt = document.createElement('option');
                opt.value = index;
                opt.textContent = optText;
                if (index === 0) opt.selected = true;
                select.appendChild(opt);
            });
            container.appendChild(label);
            container.appendChild(select);
        }

        settingPause.appendChild(container);
    });
}

// 페이지가 로드될 때 호출
createSettingsElements();
