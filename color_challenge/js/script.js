// ==============================
// 色覚チャレンジ
// ==============================

// ゲームの基本設定
const ROUND_TIME = 10;
const MIN_CIRCLES = 4;
const MAX_CIRCLES = 16;
const MAX_LIVES = 3;

// HTML要素を取得
const stageElement = document.querySelector('#stage');
const timeElement = document.querySelector('#time');
const bestElement = document.querySelector('#best');
const livesElement = document.querySelector('#lives');
const colorDifferenceElement = document.querySelector('#color-difference');
const timerBar = document.querySelector('#timer-bar');
const grid = document.querySelector('#grid');
const circleCountElement = document.querySelector('#circle-count');
const feedback = document.querySelector('#feedback');

const overlay = document.querySelector('#overlay');
const dialogTitle = document.querySelector('#dialog-title');
const dialogMessage = document.querySelector('#dialog-message');
const startButton = document.querySelector('#start-button');

// ゲームの状態
let stage = 1;
let circleCount = MIN_CIRCLES;
let timeLeft = ROUND_TIME;
let lives = MAX_LIVES;
let timerId = null;
let gameIsRunning = false;
let correctIndex = -1;

// 最高ステージを保存・取得
let bestStage = Number(localStorage.getItem('colorChallengeBest')) || 0;
bestElement.textContent = bestStage;

// 16進数カラーをRGBに変換する
function hexToRgb(hex) {
    const value = hex.replace('#', '');

    return {
        r: parseInt(value.slice(0, 2), 16),
        g: parseInt(value.slice(2, 4), 16),
        b: parseInt(value.slice(4, 6), 16)
    };
}

// RGBを16進数カラーに変換する
function rgbToHex(r, g, b) {
    const toHex = value => Math.max(0, Math.min(255, Math.round(value)))
        .toString(16)
        .padStart(2, '0');

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// ステージに応じた色の差を計算する
// ステージが進むほど、通常色と正解色の差を小さくする
function getColorDifference() {
    return Math.max(7, 48 - (stage - 1) * 3);
}

// 丸の色をランダムに作る
function createColors() {
    // オレンジ・青・緑・紫などからベースカラーを選ぶ
    const palettes = [
        { r: 238, g: 132, b: 58 },
        { r: 70, g: 145, b: 220 },
        { r: 75, g: 177, b: 125 },
        { r: 164, g: 112, b: 211 },
        { r: 225, g: 105, b: 139 },
        { r: 210, g: 177, b: 73 }
    ];

    const base = palettes[Math.floor(Math.random() * palettes.length)];

    // ステージに応じて色の違いを調整
    const difference = getColorDifference();

    // 明るさを上げるか下げるかをランダムに決める
    const direction = Math.random() < 0.5 ? -1 : 1;

    const differentColor = {
        r: base.r + difference * direction,
        g: base.g + difference * direction,
        b: base.b + difference * direction
    };

    return {
        normal: rgbToHex(base.r, base.g, base.b),
        different: rgbToHex(
            differentColor.r,
            differentColor.g,
            differentColor.b
        )
    };
}

// 配列の中身をランダムな順番にする
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const randomIndex = Math.floor(Math.random() * (i + 1));
        [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
    }

    return array;
}

// ステージの丸を作成する
function createStage() {
    clearInterval(timerId);

    gameIsRunning = true;
    timeLeft = ROUND_TIME;

    stageElement.textContent = stage;
    timeElement.textContent = timeLeft.toFixed(1);
    circleCountElement.textContent = `${circleCount} 個`;
    colorDifferenceElement.textContent = getColorDifference();
    livesElement.textContent = '♥ '.repeat(lives).trim();
    livesElement.setAttribute('aria-label', `残りライフ ${lives}`);
    timerBar.style.width = '100%';
    timerBar.classList.remove('warning');

    feedback.textContent = 'よく見て、ひとつだけ違う色を探そう！';
    feedback.className = 'feedback';

    // 正解の位置をランダムに決定
    correctIndex = Math.floor(Math.random() * circleCount);

    const colors = createColors();
    const circleColors = Array(circleCount).fill(colors.normal);
    circleColors[correctIndex] = colors.different;

    shuffle(circleColors);

    // シャッフル後の正解位置を調べる
    correctIndex = circleColors.findIndex(color => color === colors.different);

    // 丸の数に応じて列数を設定
    const columns = Math.ceil(Math.sqrt(circleCount));
    grid.style.setProperty('--columns', columns);
    grid.style.setProperty('--rows', columns);
    grid.innerHTML = '';

    circleColors.forEach((color, index) => {
        const circle = document.createElement('button');

        circle.type = 'button';
        circle.className = 'color-circle';
        circle.style.backgroundColor = color;
        circle.setAttribute('aria-label', `色の選択肢 ${index + 1}`);

        circle.addEventListener('click', () => {
            checkAnswer(index, circle);
        });

        grid.appendChild(circle);
    });

    startTimer();
}

// タイマーを開始する
function startTimer() {
    const startTime = Date.now();

    timerId = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        timeLeft = Math.max(0, ROUND_TIME - elapsed);

        timeElement.textContent = timeLeft.toFixed(1);
        timerBar.style.width = `${(timeLeft / ROUND_TIME) * 100}%`;

        if (timeLeft <= 3) {
            timerBar.classList.add('warning');
        }

        if (timeLeft <= 0) {
            loseLife('time');
        }
    }, 50);
}

// ライフを1つ失ったときの処理
function loseLife(reason) {
    if (!gameIsRunning) return;

    gameIsRunning = false;
    clearInterval(timerId);
    lives--;

    livesElement.textContent = '♥ '.repeat(lives).trim();
    livesElement.setAttribute('aria-label', `残りライフ ${lives}`);

    // 判定後は、丸を押せないようにする
    document.querySelectorAll('.color-circle').forEach(circle => {
        circle.disabled = true;
    });

    if (reason === 'time') {
        feedback.textContent = '時間切れ！ライフを1つ失いました。';
    } else {
        feedback.textContent = '不正解！正解の色を確認しましょう。';
    }

    feedback.className = 'feedback error';

    // 最後のライフでも、正解の丸を3秒間確認してからゲームオーバー
    const waitTime = reason === 'wrong' ? 3000 : 700;

    setTimeout(() => {
        if (lives <= 0) {
            endGame(reason);
            return;
        }

        if (!overlay.classList.contains('hidden')) return;
        createStage();
    }, waitTime);
}

// 選択した丸が正解か確認する
function checkAnswer(selectedIndex, selectedCircle) {
    if (!gameIsRunning) return;

    if (selectedIndex === correctIndex) {
        // 正解
        gameIsRunning = false;
        clearInterval(timerId);

        selectedCircle.classList.add('correct');

        feedback.textContent = '正解！次のステージへ進みます！';
        feedback.className = 'feedback success';

        // 最高ステージを更新
        if (stage > bestStage) {
            bestStage = stage;
            localStorage.setItem('colorChallengeBest', bestStage);
            bestElement.textContent = bestStage;
        }

        // 丸の数を1個ずつ増やす（最大16個）
        if (circleCount < MAX_CIRCLES) {
            circleCount++;
        }

        stage++;

        // 少し間を置いて次のステージへ
        setTimeout(() => {
            if (overlay.classList.contains('hidden')) {
                createStage();
            }
        }, 650);

    } else {
        // 不正解：正解の丸を緑色に点滅させてからライフを失う
        selectedCircle.classList.add('wrong');

        const correctCircle = grid.children[correctIndex];
        correctCircle.classList.add('reveal-correct');

        loseLife('wrong');
    }
}

// ゲームオーバー
function endGame(reason) {
    gameIsRunning = false;
    clearInterval(timerId);

    // すべての丸を選択できないようにする
    document.querySelectorAll('.color-circle').forEach(circle => {
        circle.disabled = true;
    });

    if (reason === 'time') {
        dialogTitle.innerHTML = '時間切れ！';
    } else {
        dialogTitle.innerHTML = 'ゲームオーバー！';
    }

    dialogMessage.innerHTML =
        `ライフをすべて使い切りました。<br>到達ステージ：${stage}<br>最高記録：${bestStage}`;

    startButton.textContent = 'もう一度プレイ';
    overlay.classList.remove('hidden');
}

// ゲームを最初から開始する
function startGame() {
    clearInterval(timerId);

    stage = 1;
    circleCount = MIN_CIRCLES;
    lives = MAX_LIVES;

    overlay.classList.add('hidden');
    createStage();
}

// スタートボタン
startButton.addEventListener('click', startGame);
