chrome.runtime.onMessage.addListener((request) => {
  console.log(request.status);

  // この要素が既にあったら実行済みと判断して処理を止める
  if (document.getElementById("word-highlighter-target-area")) {
    return;
  }

  // ページ全体を検索対象として一括りにする
  document.body.innerHTML =
    '<div id="word-highlighter-target-area">' +
    document.body.innerHTML +
    "</div>";
  let editedHTML = document.getElementById("word-highlighter-target-area");

  // 検索結果を表示するパネルは検索対象の外側に設置
  const panelElm = document.createElement("div");
  panelElm.className = "word-highlighter-panel";
  document.body.insertBefore(panelElm, editedHTML);

  // キーワード毎にhighlightクラスを実行
  const words = [
    "英語",
    "英会話",
    "TOEIC",
    "グローバル",
    "海外",
    "外国",
    "外資",
  ];
  const patterns = [];
  words.map((word, index) => {
    patterns[index] = new highlight(
      word,
      document.getElementById("word-highlighter-target-area")
    );
  });

  // パネルにキーワードと件数を挿入する
  patterns.map((pattern) => {
    const pElem = document.createElement("p");
    pElem.innerHTML = `${pattern.keyword} (${pattern.count}件)`;
    panelElm.appendChild(pElem);
  });
});

class highlight {
  constructor(keyword, htmlSrc) {
    this.keyword = keyword;
    this.htmlSrc = htmlSrc;
    this.count = 0;
    this.highlightOn();
  }
  highlightOn() {
    const separator = "[word-highlighter-array-separator]";
    const texts = this.htmlSrc.innerHTML
      .replace(new RegExp("(<)", "ig"), separator + "$1")
      .replace(new RegExp("(>)", "ig"), "$1" + separator)
      .split(separator);
    for (let i = 0; i < texts.length; i++) {
      if (texts[i].substring(0, 1) != "<") {
        // 文字実体参照 character entity reference e.g. &nbsp; &lt;
        texts.splice(
          i,
          1,
          texts[i]
            .replace(new RegExp("(&w+;)", "ig"), separator + "$1" + separator)
            .split(separator)
        );
        for (let j = 0; j < texts[i].length; j++) {
          if (texts[i][j].substring(0, 1) != "&") {
            const re = new RegExp(this.keyword, "g");
            this.count +=
              texts[i][j].match(re) === null ? 0 : texts[i][j].match(re).length;

            texts[i][j] = texts[i][j].replace(
              new RegExp("(" + this.keyword + ")", "ig"),
              '<span class="word-highlighter-keywords">$1</span>'
            );
          }
        }
        texts[i] = texts[i].join("");
      }
    }
    this.htmlSrc.innerHTML = texts.join("");
  }
  highlightOff() {}
}
