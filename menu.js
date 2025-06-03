//화면 전환 js코드
var music = "";
var mVol = 0;
// BGM 리스트
const bgmList = [
    "bgm/bgm1.mp3",
    "bgm/bgm2.mp3",
    "bgm/bgm3.mp3",
    "bgm/bgm4.mp3"
];

// $(document).ready(function () {

//     // 페이지 열리자마자는 재생이 안돼서 클릭 한 번 해야 재생되도록 해놓음
//     $(document).on('click', function () {
//         musicObj.playMusic(bgmList[0]);
//     });

//     $("#changeBGM-select").on("change", function () {  // select가 바뀌면 오디오 변경
//         const index = parseInt($(this).val());
//         if (gameState.isMusicOn) {
//             musicObj.playMusic(bgmList[index]);
//         } else {
//             musicObj.stopMusic();
//         }
//         // audio.attr("src",bgmList[index]);
//         // audio[0].load();
//         // audio[0].play();
//     });


//     // music 버튼 활성화
//     $('#musicSwitch').on('change', function () {
//         handleMusicToggle(this, bgmList);
//     });

//     // fullscreen 버튼 활성화
//     $('#fullScreenSwitch').on('change', function () {
//         handleFullScreenToggle(this);
//     });

//     $('#changeThemeButton').on('click', function () {
//         handleChangeTheme();
//     });
// });


// 게임 상태 관리 객체
const gameState = {
    selectedHouse: "house1",
    mVol: 0.5,
    isSoundOn: true,
    isMusicOn: false,
    isFullScreen: false,
    currentBgmIndex: 0,  // 추가
};

// 음악 관리 객체
const musicObj = {
    get audio() {
        return document.getElementById("bgmAudio");
    },

    playMusic(src) {
        const audio = this.audio;
        if (!audio) {
            console.error("bgmAudio element is missing!");
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
            console.error("bgmAudio element is missing!");
            return;
        }
        audio.pause();
        audio.currentTime = 0;
    },
    playEffect(src, volume = 0.8) {
        const effect = new Audio(src);
        effect.volume = volume;
        effect.play();
    },
};
// 게임 상태 초기화: localStorage에서 music 상태 불러오기
const savedIsMusicOn = localStorage.getItem('isMusicOn');
if (savedIsMusicOn !== null) {
    gameState.isMusicOn = (savedIsMusicOn === 'true');
} else {
    gameState.isMusicOn = false; // 기본값
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
    soundSwitch.checked = true;
    musicSwitch.checked = false;
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
    const bgm = document.getElementById("bgmAudio");
    const musicSwitch = document.getElementById('musicSwitch');
    musicSwitch.addEventListener('change', function () {
        if (!bgm) return;
        if (this.checked) {
            musicObj.playMusic('bgm/bgm1.mp3');
        } else {
            musicObj.stopMusic();
        }
    });

    // Sound 컨트롤 (효과음 on/off)
    const soundSwitch = document.getElementById('soundSwitch');
    soundSwitch.addEventListener('change', function () {
        gameState.isSoundOn = this.checked;
        console.log(`Sound 상태: ${gameState.isSoundOn}`);
    });

    // FullScreen 컨트롤
    const fullScreenSwitch = document.getElementById('fullScreenSwitch');
    fullScreenSwitch.addEventListener('change', function () {
        if (this.checked) {
            document.body.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    // Change BGM select
    const bgmSelect = document.getElementById('changeBGM-select');
    bgmSelect.addEventListener('change', function () {
        const index = parseInt(this.value);
        gameState.currentBgmIndex = index;  // 상태 갱신
        if (gameState.isMusicOn) {
            musicObj.playMusic(bgmList[index]);
        } else {
            musicObj.stopMusic();
        }
    });
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
    container.append('<h2>Setting</h2>');

    function styleChooseDiv(div) {
        div.style.width = '300px';
        div.style.height = '30px';
        div.style.margin = '10px auto 50px auto'
        // div.style.marginBottom = '50px';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'space-between';
    }
    // Sound 체크박스
    const soundDiv = document.createElement('div');
    soundDiv.classList.add('choose');
    styleChooseDiv(soundDiv);
    const soundLabel = document.createElement('label');
    soundLabel.setAttribute('for', 'soundSwitchPause');
    soundLabel.textContent = 'Sound';
    const soundCheckbox = document.createElement('input');
    soundCheckbox.type = 'checkbox';
    soundCheckbox.id = 'soundSwitchPause';
    soundCheckbox.checked = gameState.isSoundOn;
    soundCheckbox.addEventListener('change', function () {
        gameState.isSoundOn = this.checked;
        console.log(`Sound 상태: ${gameState.isSoundOn}`);
    });
    soundDiv.append(soundLabel)
    soundDiv.append(soundCheckbox);
    container.append($(soundDiv));

    // Music 체크박스
    const musicDiv = document.createElement('div');
    musicDiv.classList.add('choose');
    styleChooseDiv(musicDiv);

    const musicLabel = document.createElement('label');
    musicLabel.setAttribute('for', 'musicSwitchPause');
    musicLabel.textContent = 'Music';
    const musicCheckbox = document.createElement('input');
    musicCheckbox.type = 'checkbox';
    musicCheckbox.id = 'musicSwitchPause';
    musicCheckbox.checked = gameState.isMusicOn; // 기본값 ON
    musicCheckbox.addEventListener('change', function () {
        gameState.isMusicOn = this.checked;
        localStorage.setItem('isMusicOn', this.checked); // 저장
        if (gameState.isMusicOn) {
            console.log('Music ON');
            musicObj.playMusic(bgmList[gameState.currentBgmIndex]);  // [수정] 현재 선택된 BGM 재생
        } else {
            console.log('Music OFF');
            musicObj.stopMusic();
        }
    });

    musicDiv.appendChild(musicLabel);
    musicDiv.appendChild(musicCheckbox);
    container.append(musicDiv);

    // Full Screen 체크박스
    const fullScreenDiv = document.createElement('div');
    fullScreenDiv.classList.add('choose');
    styleChooseDiv(fullScreenDiv);

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
    container.append($(fullScreenDiv));

    // Change Theme 버튼
    const themeDiv = document.createElement('div');
    themeDiv.classList.add('choose');
    styleChooseDiv(themeDiv);

    const themeLabel = document.createElement('span');
    themeLabel.textContent = 'Change Theme';
    const themeButton = document.createElement('button');
    themeButton.id = 'changeThemeButtonPause';
    themeButton.textContent = 'Click';
    themeButton.addEventListener('click', function () {
        handleChangeTheme();
    });
    themeDiv.append(themeLabel);
    themeDiv.appendChild(themeButton);
    container.append($(themeDiv));

    // Change BGM select
    const bgmDiv = document.createElement('div');
    bgmDiv.classList.add('choose');
    styleChooseDiv(bgmDiv);

    const bgmLabel = document.createElement('label');
    bgmLabel.setAttribute('for', 'changeBGMPause');
    bgmLabel.textContent = 'Change BGM';

    const bgmSelect = document.createElement('select');
    bgmSelect.id = 'changeBGMPause';

    bgmList.forEach((bgm, idx) => {
        const option = document.createElement('option');
        option.value = idx;
        option.textContent = `BGM ${idx + 1}`;
        bgmSelect.appendChild(option);
    });

    bgmSelect.value = 0;
    bgmSelect.addEventListener('change', function () {
        const index = parseInt(this.value);
        gameState.currentBgmIndex = index;  // [추가] 선택 인덱스 저장
        if (gameState.isMusicOn) {
            musicObj.playMusic(bgmList[index]);
        } else {
            musicObj.stopMusic();
        }
        console.log(`BGM 변경: ${index}`);
    });

    bgmDiv.appendChild(bgmLabel);
    bgmDiv.appendChild(bgmSelect);
    container.append($(bgmDiv));

    // Back 버튼
    const backDiv = document.createElement('div');
    backDiv.classList.add('choose');
    backDiv.style.width = '250px';
    backDiv.style.margin = '10px auto 0'; // 위쪽 50px, 좌우 자동(가운데 정렬)
    backDiv.style.display = 'flex';
    backDiv.style.justifyContent = 'center';
    backDiv.style.alignItems = 'center';

    const backButton = document.createElement('button');
    backButton.id = 'backToPauseMenuBtn';
    backButton.textContent = 'Back';
    backButton.style.width = '100px';
    backButton.style.height = '40px';
    backButton.style.fontSize = '16px';
    backButton.style.cursor = 'pointer';

    backButton.addEventListener('click', () => {
        $('#settingPause').hide();
        $('#pauseMenu').show();
    });
    backDiv.appendChild(backButton);
    container.append(backDiv);
}

