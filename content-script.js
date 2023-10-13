chrome.runtime.onMessage.addListener((request) => {
  console.log(request.status);
  const words = ["英語", "英会話", "TOEIC", "グローバル", "海外", "外国"];

  document.body.innerHTML =
    '<div id="word-highlighter-target-area">' +
    document.body.innerHTML +
    "</div>";
  let editedHTML = document.getElementById("word-highlighter-target-area");

  const panelElm = document.createElement("div");
  panelElm.className = "word-highlighter-panel";
  document.body.insertBefore(panelElm, editedHTML);

  class highlight {
    constructor(keyword, htmlSrc) {
      this.keyword = keyword;
      this.elem = document.createElement("p");
      this.elem.innerHTML = keyword;
      this.htmlSrc = htmlSrc;
      this.highlightOn();
    }
    highlightOn() {
      const separator = "[word-highlighter-array-separator]";
      const texts = this.htmlSrc.innerHTML
        .replace(new RegExp("(<)", "ig"), separator + "$1")
        .replace(new RegExp("(>)", "ig"), "$1" + separator)
        .split(separator);
      for (let i = 0; i < texts.length; i++) {
        if (texts[i].substring(0, 1) == "<") {
          //do nothing for HTML tags
        } else {
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
  const patterns = [];
  words.map((word, index) => {
    patterns[index] = new highlight(
      word,
      document.getElementById("word-highlighter-target-area")
    );
  });

  for (let i = 0; i < patterns.length; i++) {
    panelElm.appendChild(patterns[i].elem);
  }
});
