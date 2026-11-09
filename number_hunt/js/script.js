'use strict';

// ========================================
// NUMBER HUNT - 定数および設定
// ========================================
const ROUND_TIME = 15;
const QUESTIONS_PER_STAGE = 10;
const MAX_LIVES = 3;
const MAX_CELLS = 100;
const BEST_KEY = 'numberHuntBestStage';
const MAX_COUNT_KEY = 'numberHuntMaxCount';

// DOM要素
const board = document.querySelector('#number-board');
const stageValue = document.querySelector('#stage-value');
const scoreValue = document.querySelector('#score-value');
const bestValue = document.querySelector('#best-value');
const livesValue = document.querySelector('#lives-value');
const timerValue = document.querySelector('#timer-value');
const timerBar = document.querySelector('#timer-bar');
const feedback = document.querySelector('#feedback');
const feedbackText = document.querySelector('#feedback-text');
const progressText = document.querySelector('#progress-text');
const progressBar = document.querySelector('#progress-bar');
const difficultyLabel = document.querySelector('#difficulty-label');
const instructionText = document.querySelector('#instruction-text');

const startOverlay = document.querySelector('#start-overlay');
const resultOverlay = document.querySelector('#result-overlay');
const helpOverlay = document.querySelector('#help-overlay');
const soundToggle = document.querySelector('#sound-toggle');

// ゲーム状態変数
let stage = 1;
let score = 0;
let lives = MAX_LIVES;
let questionInStage = 0;
let timeLeft = ROUND_TIME;
let timerId = null;
let acceptingAnswer = false;
let correctIndex = -1;
let bestStage = Number(localStorage.getItem(BEST_KEY)) || 1;
let maxCountRecord = Number(localStorage.getItem(MAX_COUNT_KEY)) || 4;
let totalCorrectAnswers = 0;
let soundEnabled = true;
let audioContext = null;

// 初期化時に保存記録を反映
bestValue.textContent = String(bestStage).padStart(2, '0');
document.querySelector('#max-count-value').textContent = String(maxCountRecord).padStart(2, '0');

/**
 * 累計正解数に応じた桁数および難易度設定を取得
 * 10問正解（1ステージクリア）ごとに1桁追加、最大5桁まで増加
 * 0〜9問正解   : 1桁 (EASY)
 * 10〜19問正解 : 2桁 (NORMAL)
 * 20〜29問正解 : 3桁 (HARD)
 * 30〜39問正解 : 4桁 (EXPERT)
 * 40問正解以降 : 5桁 (MASTER)
 */
function getDifficultyConfig(totalCorrect) {
    const levelIndex = Math.floor(totalCorrect / 10);
    const digits = Math.min(1 + levelIndex, 5);

    let name = 'EASY';
    if (digits === 2) name = 'NORMAL';
    if (digits === 3) name = 'HARD';
    if (digits === 4) name = 'EXPERT';
    if (digits === 5) name = 'MASTER';

    return { name, digits };
}

/**
 * 1問正解するごとに数字欄が2つ増加（初期値4マス、最大100マス）
 */
function getCellCount(totalCorrect) {
    const calculated = 4 + totalCorrect * 2;
    return Math.min(calculated, MAX_CELLS);
}

/**
 * 指定された桁数のベース数字と、1箇所だけ微小に異なる間違い数字（正解）を生成
 */
function generateNumberPair(digits) {
    if (digits === 1) {
        const pairs = [
            [8, 3], [3, 8], [6, 9], [9, 6], [5, 6],
            [2, 7], [0, 8], [4, 1], [7, 1], [9, 4]
        ];
        const p = pairs[Math.floor(Math.random() * pairs.length)];
        return { base: String(p[0]), odd: String(p[1]) };
    }

    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    const baseVal = Math.floor(Math.random() * (max - min + 1)) + min;
    const baseStr = String(baseVal);
    const digitsArr = baseStr.split('');

    const targetIdx = Math.floor(Math.random() * digits);
    const originalDigit = parseInt(digitsArr[targetIdx], 10);

    let newDigit;
    if (Math.random() < 0.5) {
        newDigit = (originalDigit + 1) % 10;
    } else {
        newDigit = (originalDigit + 9) % 10;
    }

    if (targetIdx === 0 && newDigit === 0) {
        newDigit = originalDigit === 9 ? 8 : originalDigit + 1;
    }

    const oddArr = [...digitsArr];
    oddArr[targetIdx] = String(newDigit);
    const oddStr = oddArr.join('');

    return { base: baseStr, odd: oddStr };
}

/**
 * 現在の画面サイズとマス数・桁数に応じて最適化されたグリッドレイアウト（列数・フォントサイズ）を算出
 */
function calculateGridDimensions(cellCount, digits) {
    const rect = board.getBoundingClientRect();
    const boardWidth = rect.width || 600;
    const boardHeight = rect.height || 400;

    let bestCols = Math.ceil(Math.sqrt(cellCount));
    let bestFontSize = 14;
    let maxArea = 0;

    const minCols = Math.max(2, Math.floor(Math.sqrt(cellCount * (boardWidth / boardHeight) * 0.7)));
    const maxCols = Math.min(cellCount, Math.ceil(Math.sqrt(cellCount * (boardWidth / boardHeight) * 1.5)) + 4);

    for (let cols = minCols; cols <= maxCols; cols++) {
        const rows = Math.ceil(cellCount / cols);
        const gap = cellCount > 50 ? 3 : 5;

        const cellW = (boardWidth - (cols + 1) * gap) / cols;
        const cellH = (boardHeight - (rows + 1) * gap) / rows;

        if (cellW <= 0 || cellH <= 0) continue;

        const textAspectRatio = digits * 0.62;
        const fontByW = (cellW * 0.88) / textAspectRatio;
        const fontByH = cellH * 0.70;
        const fontSize = Math.min(fontByW, fontByH);

        const area = cellW * cellH;
        if (fontSize >= 10 && area > maxArea) {
            maxArea = area;
            bestCols = cols;
            bestFontSize = fontSize;
        }
    }

    const clampedFontSize = Math.max(10, Math.min(Math.floor(bestFontSize), 26));

    return {
        cols: bestCols,
        fontSize: clampedFontSize
    };
}

/**
 * ゲームの開始処理
 */
function startGame() {
    clearInterval(timerId);
    stage = 1;
    score = 0;
    lives = MAX_LIVES;
    questionInStage = 0;
    totalCorrectAnswers = 0;
    startOverlay.classList.add('hidden');
    resultOverlay.classList.add('hidden');
    updateStats();
    createQuestion();
}

/**
 * 問題の作成と描画
 */
function createQuestion() {
    clearInterval(timerId);
    acceptingAnswer = true;
    timeLeft = ROUND_TIME;

    // 1問正解するごとにマス数が2つ増加（初期4マス、最大100マス）
    const cellCount = getCellCount(totalCorrectAnswers);

    // 最大到達マス数の更新保存
    if (cellCount > maxCountRecord) {
        maxCountRecord = cellCount;
        localStorage.setItem(MAX_COUNT_KEY, String(maxCountRecord));
        updateStats();
    }

    // 10問正解ごとに1桁追加（最大5桁）
    const diffConfig = getDifficultyConfig(totalCorrectAnswers);
    const { base, odd } = generateNumberPair(diffConfig.digits);

    correctIndex = Math.floor(Math.random() * cellCount);

    // グリッドレイアウトの設定
    const gridLayout = calculateGridDimensions(cellCount, diffConfig.digits);
    board.style.setProperty('--cols', gridLayout.cols);
    board.style.setProperty('--cell-font-size', `${gridLayout.fontSize}px`);

    board.innerHTML = '';
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < cellCount; i++) {
        const tile = document.createElement('button');
        tile.type = 'button';
        tile.className = 'number-tile';
        tile.textContent = i === correctIndex ? odd : base;
        tile.dataset.index = i;
        tile.setAttribute('aria-label', `マス ${i + 1}: ${tile.textContent}`);
        tile.addEventListener('click', () => chooseTile(i, tile));
        fragment.appendChild(tile);
    }
    board.appendChild(fragment);

    difficultyLabel.textContent = `STAGE ${stage} · ${diffConfig.name} (${diffConfig.digits}桁)`;
    instructionText.textContent = `${cellCount}個の数字から違うものを探そう！`;
    setFeedback('違う数字を見つけよう！', '');
    updateProgress();
    updateTimerDisplay();
    timerId = setInterval(updateTimer, 100);
}

/**
 * プレイヤーの回答処理
 */
function chooseTile(index, tile) {
    if (!acceptingAnswer) return;
    acceptingAnswer = false;
    clearInterval(timerId);

    if (index === correctIndex) {
        tile.classList.add('correct');
        const speedBonus = Math.ceil(timeLeft * 10);
        const stageBonus = stage * 5;
        const gained = 100 + speedBonus + stageBonus;
        score += gained;
        questionInStage++;
        totalCorrectAnswers++;

        playTone('success');
        setFeedback(`正解！ +${gained} POINT`, 'success');
        updateStats();
        updateProgress();
        disableAllTiles();

        if (questionInStage >= QUESTIONS_PER_STAGE) {
            window.setTimeout(stageClear, 850);
        } else {
            window.setTimeout(createQuestion, 600);
        }
    } else {
        tile.classList.add('wrong');
        const correctTile = board.querySelector(`[data-index="${correctIndex}"]`);
        if (correctTile) correctTile.classList.add('reveal');
        lives--;
        playTone('error');
        setFeedback('惜しい！ 緑色に光った数字が正解です', 'error');
        updateStats();
        disableAllTiles();

        if (lives <= 0) {
            window.setTimeout(() => showResult(false), 1050);
        } else {
            window.setTimeout(createQuestion, 1150);
        }
    }
}

function disableAllTiles() {
    const tiles = board.querySelectorAll('.number-tile');
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].disabled = true;
    }
}

function updateTimer() {
    if (!acceptingAnswer) return;
    timeLeft = Math.max(0, timeLeft - 0.1);
    updateTimerDisplay();

    if (timeLeft <= 0) {
        acceptingAnswer = false;
        clearInterval(timerId);
        lives--;
        playTone('error');
        const correctTile = board.querySelector(`[data-index="${correctIndex}"]`);
        if (correctTile) correctTile.classList.add('reveal');
        disableAllTiles();
        setFeedback('時間切れ！ 緑色に光った数字が正解です', 'error');
        updateStats();

        if (lives <= 0) {
            window.setTimeout(() => showResult(false), 1050);
        } else {
            window.setTimeout(createQuestion, 1150);
        }
    }
}

function updateTimerDisplay() {
    timerValue.textContent = timeLeft.toFixed(1);
    const percentage = (timeLeft / ROUND_TIME) * 100;
    timerBar.style.width = `${percentage}%`;
    timerBar.classList.toggle('warning', timeLeft <= 5);
}

function updateStats() {
    stageValue.textContent = String(stage).padStart(2, '0');
    scoreValue.textContent = String(score).padStart(4, '0');
    livesValue.textContent = `${'♥ '.repeat(lives).trim()}${'♡ '.repeat(MAX_LIVES - lives).trim()}`;
    bestValue.textContent = String(bestStage).padStart(2, '0');
    document.querySelector('#max-count-value').textContent = String(maxCountRecord).padStart(2, '0');
}

function updateProgress() {
    progressText.textContent = `${questionInStage} / ${QUESTIONS_PER_STAGE}`;
    progressBar.style.width = `${(questionInStage / QUESTIONS_PER_STAGE) * 100}%`;
}

function setFeedback(message, type) {
    feedbackText.textContent = message;
    feedback.className = `feedback ${type}`;
}

function stageClear() {
    stage++;
    questionInStage = 0;
    if (stage > bestStage) {
        bestStage = stage;
        localStorage.setItem(BEST_KEY, String(bestStage));
    }
    updateStats();
    updateProgress();
    createQuestion();
    setFeedback(`STAGE ${stage - 1} CLEAR！ 次のステージへ`, 'success');
}

function showResult(cleared) {
    clearInterval(timerId);
    acceptingAnswer = false;

    document.querySelector('#result-icon').textContent = cleared ? '★' : '✦';
    document.querySelector('#result-kicker').textContent = cleared ? 'STAGE CLEAR' : 'GAME OVER';
    document.querySelector('#result-title').textContent = cleared ? 'ステージクリア！' : 'ゲームオーバー';
    document.querySelector('#result-description').textContent = cleared
        ? 'すばらしい観察力です。さらに上を目指そう！'
        : 'あと一歩！ もう一度挑戦して記録を更新しよう。';
    document.querySelector('#result-score').textContent = score.toLocaleString();
    document.querySelector('#result-stage').textContent = stage;
    document.querySelector('#result-best').textContent = bestStage;
    document.querySelector('#result-max-count').textContent = maxCountRecord;
    document.querySelector('#continue-button').textContent = 'もう一度挑戦 →';
    resultOverlay.classList.remove('hidden');
}

/**
 * Web Audio APIを利用した効果音再生
 */
function playTone(type) {
    if (!soundEnabled) return;
    try {
        audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.connect(gain);
        gain.connect(audioContext.destination);

        if (type === 'success') {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.08);
            gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.25);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.26);
        } else {
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(180, audioContext.currentTime);
            oscillator.frequency.setValueAtTime(130, audioContext.currentTime + 0.08);
            gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.25);
            oscillator.start();
            oscillator.stop(audioContext.currentTime + 0.26);
        }
    } catch (error) {
        // 無音で続行
    }
}

// イベントリスナー設定
document.querySelector('#start-button').addEventListener('click', startGame);
document.querySelector('#continue-button').addEventListener('click', startGame);
document.querySelector('#restart-button').addEventListener('click', () => {
    if (window.confirm('最初からやり直しますか？')) startGame();
});

document.querySelector('#help-button').addEventListener('click', () => helpOverlay.classList.remove('hidden'));
document.querySelector('#close-help').addEventListener('click', () => helpOverlay.classList.add('hidden'));
document.querySelector('#help-ok').addEventListener('click', () => helpOverlay.classList.add('hidden'));

soundToggle.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundToggle.classList.toggle('active', soundEnabled);
    soundToggle.textContent = soundEnabled ? '♫' : '♪';
    soundToggle.setAttribute('aria-label', soundEnabled ? '効果音をオフにする' : '効果音をオンにする');
});

// ウィンドウリサイズ時にレイアウトを再計算
window.addEventListener('resize', () => {
    if (acceptingAnswer && board.children.length > 0) {
        const diffConfig = getDifficultyConfig(totalCorrectAnswers);
        const gridLayout = calculateGridDimensions(board.children.length, diffConfig.digits);
        board.style.setProperty('--cols', gridLayout.cols);
        board.style.setProperty('--cell-font-size', `${gridLayout.fontSize}px`);
    }
});

// 初回画面表示
updateStats();
updateProgress();
startOverlay.classList.remove('hidden');
