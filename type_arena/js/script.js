// =============================================
// TYPE ARENA : ROCKET DEFENSE
// 日本語のローマ字入力候補を自動生成して判定する
// =============================================

// 表示する日本語、読み仮名、難易度をセットで管理します。
// 読みはひらがなで登録します。漢字やカタカナを表示したい場合も
// reading をひらがなにしておけば、入力候補は自動生成されます。
const wordData = {
    easy: [
        ["ねこ", "ねこ"], ["いぬ", "いぬ"], ["さくら", "さくら"],
        ["りんご", "りんご"], ["そら", "そら"], ["みず", "みず"],
        ["でんしゃ", "でんしゃ"], ["ともだち", "ともだち"],
        ["おはよう", "おはよう"], ["ありがとう", "ありがとう"],
        ["たまご", "たまご"], ["はなび", "はなび"],
        ["やきにく", "やきにく"], ["ひこうき", "ひこうき"],
        ["あおぞら", "あおぞら"], ["くるま", "くるま"],
        ["うみ", "うみ"], ["やま", "やま"], ["ほし", "ほし"],
        ["とけい", "とけい"], ["あさごはん", "あさごはん"],
        ["こうえん", "こうえん"], ["えんぴつ", "えんぴつ"],
        ["ねむい", "ねむい"], ["おいしい", "おいしい"],
        ["すいか", "すいか"], ["ふゆ", "ふゆ"], ["なつ", "なつ"],
        ["せかい", "せかい"], ["きょう", "きょう"],
        ["がっこう", "がっこう"], ["ちず", "ちず"],
        ["しゃしん", "しゃしん"], ["ちょきん", "ちょきん"],
        ["りょこう", "りょこう"], ["びょういん", "びょういん"]
    ],
    normal: [
        ["図書館", "としょかん"], ["冒険", "ぼうけん"], ["集中力", "しゅうちゅうりょく"],
        ["流れ星", "ながれぼし"], ["新しい世界", "あたらしいせかい"],
        ["挑戦する", "ちょうせんする"], ["プログラミング", "ぷろぐらみんぐ"],
        ["可能性", "かのうせい"], ["想像力", "そうぞうりょく"],
        ["一生懸命", "いっしょうけんめい"], ["目標を達成する", "もくひょうをたっせいする"],
        ["継続は力なり", "けいぞくはちからなり"], ["自分のペース", "じぶんのぺーす"],
        ["未来を切り開く", "みらいをきりひらく"], ["好奇心", "こうきしん"],
        ["判断力", "はんだんりょく"], ["想定外", "そうていがい"],
        ["情報収集", "じょうほうしゅうしゅう"], ["安全第一", "あんぜんだいいち"],
        ["問題解決", "もんだいかいけつ"], ["電光石火", "でんこうせっか"],
        ["臨機応変", "りんきおうへん"], ["準備万端", "じゅんびばんたん"],
        ["試行錯誤", "しこうさくご"], ["正確な操作", "せいかくなそうさ"],
        ["経験を積む", "けいけんをつむ"], ["目の前の課題", "めのまえのかだい"],
        ["効率よく進める", "こうりつよくすすめる"], ["大切な仲間", "たいせつななかま"],
        ["新記録を目指す", "しんきろくをめざす"], ["冷静に考える", "れいせいにかんがえる"],
        ["判断を急がない", "はんだんをいそがない"]
    ],
    hard: [
        ["失敗は成功のもと", "しっぱいはせいこうのもと"],
        ["好きこそものの上手なれ", "すきこそもののじょうずなれ"],
        ["千里の道も一歩から", "せんりのみちもいっぽから"],
        ["継続することが大切だ", "けいぞくすることがたいせつだ"],
        ["新しいことに挑戦する", "あたらしいことにちょうせんする"],
        ["ローマは一日にして成らず", "ろーまはいちにちにしてならず"],
        ["案ずるより産むが易し", "あんずるよりうむがやすし"],
        ["塵も積もれば山となる", "ちりもつもればやまとなる"],
        ["自分自身を信じて進もう", "じぶんじしんをしんじてすすもう"],
        ["好きなことを極めていこう", "すきなことをきわめていこう"],
        ["今日という日は二度と来ない", "きょうというひはにどとこない"],
        ["百聞は一見に如かず", "ひゃくぶんはいっけんにしかず"],
        ["備えあれば憂いなし", "そなえあればうれいなし"],
        ["七転び八起き", "ななころびやおき"],
        ["急がば回れ", "いそがばまわれ"],
        ["初心忘るべからず", "しょしんわするべからず"],
        ["正確さと速さを両立する", "せいかくさとはやさをりょうりつする"],
        ["最後まで諦めずに進む", "さいごまであきらめずにすすむ"],
        ["小さな努力を積み重ねる", "ちいさなどりょくをつみかさねる"],
        ["冷静な判断が勝利につながる", "れいせいなはんだんがしょうりにつながる"],
        ["未来は自分の手で切り開く", "みらいはじぶんのてできりひらく"],
        ["困難を乗り越えて成長する", "こんなんをのりこえてせいちょうする"],
        ["雨垂れ石を穿つ", "あまだれいしをうがつ"],
        ["案外なんとかなるものだ", "あんがいなんとかなるものだ"]
    ]
};

// かな1文字ごとのローマ字候補。
// 「し＝shi/si」「ち＝chi/ti」「つ＝tsu/tu」などを含みます。
const kanaMap = {
    "あ":["a"],"い":["i"],"う":["u"],"え":["e"],"お":["o"],
    "か":["ka"],"き":["ki"],"く":["ku"],"け":["ke"],"こ":["ko"],
    "さ":["sa"],"し":["shi","si"],"す":["su"],"せ":["se"],"そ":["so"],
    "た":["ta"],"ち":["chi","ti"],"つ":["tsu","tu"],"て":["te"],"と":["to"],
    "な":["na"],"に":["ni"],"ぬ":["nu"],"ね":["ne"],"の":["no"],
    "は":["ha"],"ひ":["hi"],"ふ":["fu","hu"],"へ":["he"],"ほ":["ho"],
    "ま":["ma"],"み":["mi"],"む":["mu"],"め":["me"],"も":["mo"],
    "や":["ya"],"ゆ":["yu"],"よ":["yo"],
    "ら":["ra"],"り":["ri"],"る":["ru"],"れ":["re"],"ろ":["ro"],
    "わ":["wa"],"を":["wo","o"],"ん":["nn","n"],
    "が":["ga"],"ぎ":["gi"],"ぐ":["gu"],"げ":["ge"],"ご":["go"],
    "ざ":["za"],"じ":["ji","zi"],"ず":["zu"],"ぜ":["ze"],"ぞ":["zo"],
    "だ":["da"],"ぢ":["di","ji"],"づ":["du","zu"],"で":["de"],"ど":["do"],
    "ば":["ba"],"び":["bi"],"ぶ":["bu"],"べ":["be"],"ぼ":["bo"],
    "ぱ":["pa"],"ぴ":["pi"],"ぷ":["pu"],"ぺ":["pe"],"ぽ":["po"],
    "ぁ":["xa","la"],"ぃ":["xi","li"],"ぅ":["xu","lu"],"ぇ":["xe","le"],"ぉ":["xo","lo"],
    "ゃ":["xya","lya"],"ゅ":["xyu","lyu"],"ょ":["xyo","lyo"],
    "っ":["xtsu","ltsu"]
};

const digraphMap = {
    "きゃ":["kya"],"きゅ":["kyu"],"きょ":["kyo"],
    "しゃ":["sha","sya"],"しゅ":["shu","syu"],"しょ":["sho","syo"],
    "ちゃ":["cha","tya","cya"],"ちゅ":["chu","tyu","cyu"],"ちょ":["cho","tyo","cyo"],
    "にゃ":["nya"],"にゅ":["nyu"],"にょ":["nyo"],
    "ひゃ":["hya"],"ひゅ":["hyu"],"ひょ":["hyo"],
    "みゃ":["mya"],"みゅ":["myu"],"みょ":["myo"],
    "りゃ":["rya"],"りゅ":["ryu"],"りょ":["ryo"],
    "ぎゃ":["gya"],"ぎゅ":["gyu"],"ぎょ":["gyo"],
    "じゃ":["ja","zya","jya"],"じゅ":["ju","zyu","jyu"],"じょ":["jo","zyo","jyo"],
    "びゃ":["bya"],"びゅ":["byu"],"びょ":["byo"],
    "ぴゃ":["pya"],"ぴゅ":["pyu"],"ぴょ":["pyo"]
};

// ローマ字候補が多くなりすぎないよう上限を設定します。
const MAX_VARIANTS = 500;

function unique(values) {
    return [...new Set(values)];
}

// かな読みから、入力可能なローマ字の候補をすべて作ります。
function createRomajiVariants(reading) {
    const results = [];

    function build(index, current) {
        if (results.length >= MAX_VARIANTS) return;

        if (index >= reading.length) {
            results.push(current);
            return;
        }

        const pair = reading.slice(index, index + 2);
        const character = reading[index];

        // 小さい「っ」は、次の子音を重ねる入力にも対応。
        if (character === "っ") {
            const nextPair = reading.slice(index + 1, index + 3);
            const nextCharacter = reading[index + 1];
            const nextOptions = digraphMap[nextPair] || kanaMap[nextCharacter] || [];
            const doubled = nextOptions
                .map(option => option[0])
                .filter(first => /^[bcdfghjklmpqrstvwxyz]$/i.test(first));

            const smallTsuOptions = ["xtsu", "ltsu", ...doubled];
            smallTsuOptions.forEach(option => build(index + 1, current + option));
            return;
        }

        // 拗音（きゃ、しゃ、ちょ等）
        if (digraphMap[pair]) {
            digraphMap[pair].forEach(option => build(index + 2, current + option));
            return;
        }

        // 長音記号は直前の母音を伸ばす入力として扱います。
        if (character === "ー") {
            const lastVowel = current.match(/[aeiou]$/)?.[0] || "ー";
            const options = lastVowel === "ー" ? ["-"] : [lastVowel, "-"];
            options.forEach(option => build(index + 1, current + option));
            return;
        }

        // 「ん」は n / nn に対応。母音・y の前では n' も許可。
        if (character === "ん") {
            const next = reading[index + 1] || "";
            const options = ["n", "nn"];
            if (/^[あいうえおやゆよ]$/.test(next)) options.push("n'");
            options.forEach(option => build(index + 1, current + option));
            return;
        }

        const options = kanaMap[character];
        if (options) {
            options.forEach(option => build(index + 1, current + option));
            return;
        }

        // 読みに想定外の文字が含まれていた場合は、そのまま通す。
        build(index + 1, current + character);
    }

    build(0, "");
    return unique(results);
}

// 問題データをゲーム用オブジェクトに変換
const wordSets = Object.fromEntries(
    Object.entries(wordData).map(([difficulty, words]) => [
        difficulty,
        words.map(([display, reading]) => ({
            display,
            reading,
            answers: createRomajiVariants(reading)
        }))
    ])
);

// HTML要素
const scoreElement = document.querySelector("#score");
const destroyedElement = document.querySelector("#destroyed");
const comboElement = document.querySelector("#combo");
const baseHpElement = document.querySelector("#base-hp");
const baseHpFill = document.querySelector("#base-hp-fill");
const fortress = document.querySelector("#fortress");
const missionState = document.querySelector("#mission-state");
const waveLabel = document.querySelector("#wave-label");

const rocketLane = document.querySelector("#rocket-lane");
const rocket = document.querySelector("#rocket");
const targetWord = document.querySelector("#target-word");
const rocketTarget = document.querySelector("#rocket-target");
const targetProgressBar = document.querySelector("#target-progress-bar");
const explosion = document.querySelector("#explosion");
const battleMessage = document.querySelector("#battle-message");
const spaceScene = document.querySelector(".space-scene");

const japaneseWord = document.querySelector("#japanese-word");
const readingHint = document.querySelector("#reading-hint");
const typingInput = document.querySelector("#typing-input");
const inputBox = document.querySelector("#input-box");
const inputState = document.querySelector("#input-state");
const feedback = document.querySelector("#feedback");
const wordCounter = document.querySelector("#word-counter");

const startButton = document.querySelector("#start-button");
const startLabel = document.querySelector("#start-label");
const resetButton = document.querySelector("#reset-button");
const modeButtons = document.querySelectorAll(".mode-button");

const resultModal = document.querySelector("#result-modal");
const resultScore = document.querySelector("#result-score");
const resultDestroyed = document.querySelector("#result-destroyed");
const resultCombo = document.querySelector("#result-combo");
const resultHp = document.querySelector("#result-hp");
const resultRank = document.querySelector("#result-rank");
const retryButton = document.querySelector("#retry-button");

// ゲーム状態
let selectedMode = "easy";
let score = 0;
let destroyed = 0;
let combo = 0;
let maxCombo = 0;
let baseHp = 5;
let wave = 1;
let targetNumber = 0;
let currentWord = null;
let questionQueue = [];
let enemyTimerId = null;
let isPlaying = false;
let enemyProgress = 0;
let lastInputLength = 0;

// 配列をシャッフル
function shuffle(array) {
    const copy = [...array];

    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }

    return copy;
}

// 次の敵を用意
function chooseNextWord() {
    if (questionQueue.length === 0) {
        questionQueue = shuffle(wordSets[selectedMode]);
    }

    currentWord = questionQueue.pop();
    targetNumber++;

    japaneseWord.textContent = currentWord.display;
    readingHint.textContent = currentWord.answers[0];
    targetWord.textContent = currentWord.display;
    wordCounter.textContent = `TARGET ${String(targetNumber).padStart(2, "0")}`;

    typingInput.value = "";
    lastInputLength = 0;
    enemyProgress = 0;

    // 敵ロケットは画面右端から左側の基地へ向かいます。
    rocket.style.left = "90%";
    rocketTarget.style.left = "calc(90% - 40px)";
    rocketLane.style.left = "8%";
    targetProgressBar.style.width = "0%";
    inputState.textContent = "READY";
    typingInput.focus();
}

// 入力が正解候補の途中まで一致しているか
function isValidInput(value) {
    return currentWord.answers.some(answer => answer.startsWith(value));
}

// 入力の進捗率
function getInputProgress(value) {
    const progressRates = currentWord.answers.map(answer => {
        return Math.min(100, (value.length / answer.length) * 100);
    });

    return Math.max(...progressRates);
}

// 画面表示を更新
function updateStats() {
    scoreElement.textContent = String(score).padStart(5, "0");
    destroyedElement.textContent = destroyed;
    comboElement.textContent = combo;
    baseHpElement.textContent = baseHp;
    waveLabel.textContent = `WAVE ${String(wave).padStart(2, "0")}`;

    baseHpElement.style.color = baseHp <= 2 ? "var(--red)" : "var(--yellow)";

    // 要塞の装甲ゲージも、画面上部のBASE HPと連動させる
    if (baseHpFill) {
        baseHpFill.style.width = `${Math.max(0, (baseHp / 5) * 100)}%`;
    }

    if (fortress) {
        fortress.classList.toggle("critical", baseHp <= 2);
    }
}

// 入力処理
function handleTyping() {
    if (!isPlaying || !currentWord) return;

    let value = typingInput.value.toLowerCase().replace(/\s/g, "");

    // 入力欄に空白などが入った場合は取り除く
    if (typingInput.value !== value) {
        typingInput.value = value;
    }

    if (value.length === 0) {
        lastInputLength = 0;
        targetProgressBar.style.width = "0%";
        inputState.textContent = "READY";
        return;
    }

    // 間違えた文字だけを取り除き、正しく入力できている部分は残す。
    // 例: 正解が "rocket" のとき "rocx" と入力したら "roc" に戻す。
    // そのまま "k" から入力を続けられる。
    let correctedValue = value;

    while (
        correctedValue.length > 0 &&
        !isValidInput(correctedValue)
    ) {
        correctedValue = correctedValue.slice(0, -1);
    }

    if (correctedValue !== value) {
        typingInput.value = correctedValue;
        value = correctedValue;

        inputBox.classList.remove("error");
        void inputBox.offsetWidth;
        inputBox.classList.add("error");

        feedback.textContent = "入力ミス！正しい位置に戻しました。そこから続けて入力できます。";
        feedback.className = "input-feedback bad";
        inputState.textContent = "RETRY";

        // タイプミスではコンボをリセットしない
        lastInputLength = value.length;
    } else {
        inputBox.classList.remove("error");
        feedback.textContent = "入力中…その調子！";
        feedback.className = "input-feedback good";
        inputState.textContent = "LOCKING";
        lastInputLength = value.length;
    }

    targetProgressBar.style.width = `${getInputProgress(value)}%`;

    const isComplete = currentWord.answers.some(answer => answer === value);

    if (isComplete) {
        destroyEnemy();
    }
}

// 敵ロケット撃墜
function destroyEnemy() {
    destroyed++;
    combo++;
    maxCombo = Math.max(maxCombo, combo);

    const modeBonus = selectedMode === "easy" ? 10 :
        selectedMode === "normal" ? 20 : 30;
    const comboBonus = Math.min(combo - 1, 25) * 3;
    score += modeBonus + comboBonus + wave * 2;

    explosion.classList.remove("hidden");
    void explosion.offsetWidth;
    explosion.classList.add("hidden");

    battleMessage.textContent = `TARGET DESTROYED!  +${modeBonus + comboBonus + wave * 2} POINTS`;
    feedback.textContent = combo >= 5 ? `${combo} COMBO! GREAT SHOT!` : "撃墜成功！次のロケットが接近中！";
    feedback.className = "input-feedback good";

    // 一定数撃墜するごとにウェーブアップ
    if (destroyed > 0 && destroyed % 8 === 0) {
        wave++;
        battleMessage.textContent = `WAVE ${wave}! ENEMY INCOMING!`;
    }

    updateStats();
    chooseNextWord();
}

// 敵ロケットは右から左へ進み、左端の基地を目指します。
// 制限時間はなく、基地HPが0になったときだけゲームオーバーです。
function enemyApproach() {
    if (!isPlaying) return;

    const speed = selectedMode === "easy" ? 0.55 :
        selectedMode === "normal" ? 0.75 : 0.95;

    enemyProgress += speed;

    const rocketLeft = Math.max(0, 90 - enemyProgress);
    rocket.style.left = `${rocketLeft}%`;
    rocketTarget.style.left = `calc(${rocketLeft}% - 40px)`;

    if (enemyProgress >= 90) {
        enemyReachedBase();
    }
}

// ロケットが基地に到達
function enemyReachedBase() {
    baseHp--;
    combo = 0;
    spaceScene.classList.remove("hit");
    void spaceScene.offsetWidth;
    spaceScene.classList.add("hit");

    if (fortress) {
        fortress.classList.remove("fortress-hit");
        void fortress.offsetWidth;
        fortress.classList.add("fortress-hit");
    }

    battleMessage.textContent = "WARNING! ENEMY HIT THE FORTRESS!";
    feedback.textContent = "敵ロケットが要塞に命中！装甲HPが減少しました。";
    feedback.className = "input-feedback bad";

    updateStats();

    if (baseHp <= 0) {
        endGame("BASE DESTROYED");
        return;
    }

    chooseNextWord();
}

// ゲーム開始
function startGame() {
    clearInterval(enemyTimerId);

    score = 0;
    destroyed = 0;
    combo = 0;
    maxCombo = 0;
    baseHp = 5;
    wave = 1;
    targetNumber = 0;
    questionQueue = shuffle(wordSets[selectedMode]);
    enemyProgress = 0;
    isPlaying = true;

    resultModal.classList.add("hidden");
    typingInput.disabled = false;
    startButton.disabled = true;
    startLabel.textContent = "DEFENDING...";
    missionState.textContent = "DEFENSE ACTIVE";
    battleMessage.textContent = "敵ロケット接近中！コードを入力せよ！";
    feedback.textContent = "敵ロケットの言葉を入力して撃墜しよう。";
    feedback.className = "input-feedback";

    updateStats();
    chooseNextWord();

    // 敵の移動速度はウェーブと難易度で変化
    enemyTimerId = setInterval(enemyApproach, 150);
}

// ゲーム終了
function endGame(reason) {
    clearInterval(enemyTimerId);
    isPlaying = false;

    typingInput.disabled = true;
    startButton.disabled = false;
    startLabel.textContent = "PLAY AGAIN";
    missionState.textContent = reason;

    resultScore.textContent = score.toLocaleString();
    resultDestroyed.textContent = destroyed;
    resultCombo.textContent = maxCombo;
    resultHp.textContent = `${baseHp} / 5`;

    if (baseHp <= 0) {
        resultRank.textContent = "BASE DOWN...";
    } else if (destroyed >= 30) {
        resultRank.textContent = "LEGENDARY DEFENDER!";
    } else if (destroyed >= 18) {
        resultRank.textContent = "ELITE DEFENDER!";
    } else if (destroyed >= 8) {
        resultRank.textContent = "GREAT DEFENSE!";
    } else {
        resultRank.textContent = "KEEP TRAINING!";
    }

    resultModal.classList.remove("hidden");
}

// リセット
function resetGame() {
    clearInterval(enemyTimerId);

    isPlaying = false;
    score = 0;
    destroyed = 0;
    combo = 0;
    maxCombo = 0;
    baseHp = 5;
    wave = 1;
    targetNumber = 0;
    currentWord = null;
    enemyProgress = 0;

    typingInput.value = "";
    typingInput.disabled = true;
    japaneseWord.textContent = "敵ロケットを待機中";
    readingHint.textContent = "START GAME を押してください";
    targetWord.textContent = "READY?";
    wordCounter.textContent = "TARGET 0";
    targetProgressBar.style.width = "0%";
    rocket.style.left = "90%";
    rocketTarget.style.left = "calc(90% - 40px)";
    rocketLane.style.left = "8%";
    battleMessage.textContent = "STARTを押して防衛を開始！";
    feedback.textContent = "正しいローマ字を入力するとロケットを撃墜できます。";
    feedback.className = "input-feedback";
    inputState.textContent = "WAITING";

    startButton.disabled = false;
    startLabel.textContent = "START GAME";
    missionState.textContent = "STANDBY";
    resultModal.classList.add("hidden");

    updateStats();
}

// 難易度変更
function changeMode(event) {
    if (isPlaying) return;

    selectedMode = event.currentTarget.dataset.mode;

    modeButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.mode === selectedMode
        );
    });

    resetGame();
}

// イベント登録
startButton.addEventListener("click", startGame);
retryButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);
typingInput.addEventListener("input", handleTyping);

modeButtons.forEach(button => {
    button.addEventListener("click", changeMode);
});

// 初期表示
updateStats();
