function gameLoop() {
    updateGame();
    drawGame(context);
    if (!isGameOver()) {
        requestAnimationFrame(gameLoop);
    }
}
function goToStoryPage() {
    document.getElementById('houseSelectScreen').style.display = 'none';
    document.getElementById('storyScreen').style.display = 'block';
}

function goToHouseSelection() {
    document.getElementById('storyScreen').style.display = 'none';
    document.getElementById('houseSelectScreen').style.display = 'block';
}

function startGame() {
    document.getElementById('storyScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    initGame(); // 실제 게임 시작 로직
}

function pauseGame() {
    // 일시정지 기능 구현 (애니메이션 중지 등)
}

function showVictoryScreen() {
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('victoryScreen').style.display = 'block';
}

function nextGrade() {
    // 다음 학년 시작 로직
    document.getElementById('victoryScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    startNextStage(); // 새 스테이지 초기화
}
