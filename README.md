# 2025-1 웹프로그래밍 12팀
웹사이트 벽돌 게임

## 1. 전체 흐름 요약
A. 시작 구조 (index.html)
메인 메뉴 → 스토리 → 난이도 선택 → 게임 실행.

모든 화면은 div class="menu"로 구성되어 있으며 hideAll()로 숨기고 필요한 화면만 .show()로 전환.

canvas를 중심으로 게임이 실행됨.

B. 주요 화면
#mainStart: 시작화면

#story: 스토리 설명

#chooseHouse: 기숙사 테마 선택

#difficulty: 난이도 선택

#settings: 설정

#gameScreen, #myCanvas: 실제 게임

#win, #fail, #gameOver: 결과 화면

## 2. 주요 JS 파일별 역할
1) game.js
역할: 게임 로직 전반 담당.

주요 기능

공/패들/벽돌 객체 정의 및 초기화

게임 루프 (requestAnimationFrame)

이벤트 벽돌 처리

게임 상태 관리 (시작, 일시정지, 실패/성공)

2) menu.js
역할: UI 관련 설정, 음악, 화면 전환 등

주요 기능

설정화면 생성 (createSettingsElements)

음악/효과음 on/off

기숙사 테마 및 BGM 선택

hideAll(), mainPage(), creditPage() 등 메뉴 전환
