TYPE ARENA - ROCKET DEFENSE

■ 起動方法
1. ZIPファイルを展開します。
2. type_arena フォルダを VS Code で開きます。
3. index.html をブラウザで開きます。
4. 難易度を選び、START GAME を押してください。

■ ファイル構成
type_arena/
  index.html
  css/style.css
  js/script.js
  README.txt

■ ローマ字入力について
「し」は shi / si、「ち」は chi / ti、「ふ」は fu / hu、
「しゃ」は sha / sya、「ちゃ」は cha / tya / cya など複数候補に対応します。
小さい「っ」は次の子音を重ねる入力にも対応します。
例：がっこう = gakkou / gaxtsukou / galtsukou など

■ 問題の追加方法
js/script.js の wordData に、表示文字とひらがなの読みを追加してください。
例：
["冒険の旅", "ぼうけんのたび"]

※ Google Fontsを使うため、フォント表示にはインターネット接続が必要です。


【今回の更新内容】
・丸い基地を、砲塔・司令塔・装甲壁を備えたSF風の防衛要塞に変更。
・敵ロケットが要塞に到達するとBASE HPが1減少し、要塞の装甲ゲージも連動して減少。
・要塞に被弾エフェクトを追加。
・タイピングミス時に入力全体を消去せず、最後に正しく入力できた位置まで戻して続きから入力できるように変更。
・タイピングミスだけではコンボをリセットしない仕様に変更。
