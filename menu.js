//화면 전환 js코드

$(document).ready(function(){
    const bgmList = [
    "bgm/bgm1.mp3",
    "bgm/bgm2.mp3",
    "bgm/bgm3.mp3",
    "bgm/bgm4.mp3",
    ];

    const audio = $("#bgm-selection");

    // audio[0].play();
    $("#changeBGM-select").on("change",function(){  // select가 바뀌면 오디오 변경경
        const index = parseInt($(this).val());
        audio.attr("src",bgmList[index]);
        audio[0].load();
        audio[0].play();
    });

    $('#changeThemeButton').on('click', function() {
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
    console.log("handleChangeTheme 함수 호출됨");
    const dropdownContainer = document.getElementById('themeDropdownContainer');
    const existingDropdown = document.getElementById('themeDropdown');
    if (existingDropdown) {
        dropdownContainer.removeChild(existingDropdown);
        console.log("#themeDropdown 제거됨");
        // $("#themeDropdown").remove();
    } else {
        const dropdown = document.createElement('select');
        dropdown.id = 'themeDropdown';

        dropdown.innerHTML = `
            <option value='house1'>Gryffindor</option>
            <option value='house2'>Slytherin</option>
            <option value='house3'>Hufflepuff</option>
            <option value='house4'>Ravenclaw</option>
        `;
        dropdown.addEventListener('change', function () {
            const selectedTheme = this.value;
            console.log("선택된 테마:", selectedTheme);
            document.getElementById('gameScreen').style.backgroundImage =
                `url('img/background/${selectedTheme}.png')`;
            gameState.selectedHouse = selectedTheme;
        });
        dropdownContainer.appendChild(dropdown);
        console.log("#themeDropdown 생성됨");
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

//난이도 선택 페이지
// function housePage() {
//     $('#story').hide();
//     $('#chooseHouse').show();
//     $("#backButton").show();
// }

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
function handleChangeTheme()
{
    hideAll();
    $("#chooseHouse").show();
}