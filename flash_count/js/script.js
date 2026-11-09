// ゲーム設定・状態
const MAX_LIVES = 3;
let stage = 1;
let lives = MAX_LIVES;
let targetCount = 0;
let displayDuration = 1000; // ミリ秒
let isWaitingAnswer = false;

// DOM要素
const canvas = document.getElementById('flash-canvas');
const ctx = canvas.getContext('2d');
const stageValEl = document.getElementById('stage-val');
const timeValEl = document.getElementById('time-val');
const livesValEl = document.getElementById('lives-val');
const overlayTextEl = document.getElementById('overlay-text');
const feedbackEl = document.getElementById('feedback-msg');
const answerInput = document.getElementById('answer-input');
const submitBtn = document.getElementById('submit-btn');
const startBtn = document.getElementById('start-btn');
const modal = document.getElementById('gameover-modal');
const finalStageEl = document.getElementById('final-stage');
const restartBtn = document.getElementById('restart-btn');

// キャンバスサイズ調整
function resizeCanvas() {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ライフ表示更新
function updateLivesDisplay() {
    livesValEl.textContent = '♥'.repeat(lives) + '♡'.repeat(MAX_LIVES - lives);
}

// ステージ難易度計算（点の数と表示時間）
function calculateStageConfig(stg) {
    // ステージが上がるごとに点が増える (最小3個～)
    const minDots = Math.min(3 + Math.floor(stg * 0.8), 35);
    const maxDots = Math.min(5 + Math.floor(stg * 1.2), 45);
    const count = Math.floor(Math.random() * (maxDots - minDots + 1)) + minDots;

    // 表示時間はだんだん短くなる (1.2秒 -> 最小0.25秒)
    const duration = Math.max(250, Math.floor(1200 * Math.pow(0.92, stg - 1)));

    return { count, duration };
}

// 点の描画
function drawDots(count) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const radius = Math.max(6, Math.min(14, canvas.width / 40));
    const padding = radius * 2;

    const dots = [];

    for (let i = 0; i < count; i++) {
        let x, y, overlap;
        let attempts = 0;

        // 重なり防止アルゴリズム
        do {
            overlap = false;
            x = padding + Math.random() * (canvas.width - padding * 2);
            y = padding + Math.random() * (canvas.height - padding * 2);

            for (const dot of dots) {
                const dist = Math.hypot(dot.x - x, dot.y - y);
                if (dist < radius * 2.5) {
                    overlap = true;
                    break;
                }
            }
            attempts++;
        } while (overlap && attempts < 100);

        dots.push({ x, y });

        // ネオンカラーの点を描画
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.closePath();
    }
}

// キャンバスクリア
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ゲームスタート
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    startGame();
});

function startGame() {
    stage = 1;
    lives = MAX_LIVES;
    startBtn.style.display = 'none';
    feedbackEl.textContent = '';
    feedbackEl.className = 'feedback-msg';
    updateLivesDisplay();
    nextStage();
}

// 次のステージ開始
function nextStage() {
    isWaitingAnswer = false;
    answerInput.value = '';
    answerInput.disabled = true;
    submitBtn.disabled = true;

    const config = calculateStageConfig(stage);
    targetCount = config.count;
    displayDuration = config.duration;

    stageValEl.textContent = stage;
    timeValEl.textContent = (displayDuration / 1000).toFixed(2) + 's';

    overlayTextEl.style.opacity = '1';
    overlayTextEl.textContent = `READY...`;
    clearCanvas();

    // カウントダウンアニメーション
    setTimeout(() => {
        overlayTextEl.textContent = `GO!`;
        setTimeout(() => {
            overlayTextEl.style.opacity = '0';
            drawDots(targetCount);

            // 指定時間後に消去し回答受付開始
            setTimeout(() => {
                clearCanvas();
                isWaitingAnswer = true;
                answerInput.disabled = false;
                submitBtn.disabled = false;
                answerInput.focus();
            }, displayDuration);

        }, 400);
    }, 800);
}

// 回答処理
document.getElementById('answer-form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!isWaitingAnswer) return;

    const userAns = parseInt(answerInput.value, 10);
    if (isNaN(userAns)) return;

    isWaitingAnswer = false;
    answerInput.disabled = true;
    submitBtn.disabled = true;

    if (userAns === targetCount) {
        // 正解
        feedbackEl.textContent = `正解！ (${targetCount}個)`;
        feedbackEl.className = 'feedback-msg correct';
        stage++;
        setTimeout(() => {
            feedbackEl.textContent = '';
            nextStage();
        }, 1200);
    } else {
        // 不正解
        lives--;
        updateLivesDisplay();
        feedbackEl.textContent = `不正解... 正解は ${targetCount}個 でした`;
        feedbackEl.className = 'feedback-msg wrong';

        if (lives <= 0) {
            // ゲームオーバー
            setTimeout(() => {
                finalStageEl.textContent = `STAGE ${stage}`;
                modal.classList.add('active');
            }, 1500);
        } else {
            setTimeout(() => {
                feedbackEl.textContent = '';
                nextStage();
            }, 1500);
        }
    }
});
