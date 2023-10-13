chrome.runtime.onMessage.addListener((request) => {
  console.log(request.status);
  const words = ["英語", "英会話", "TOEIC", "グローバル", "海外", "外国"];

  document.body.innerHTML =
    '<div id="REOP-HighLightArea">' + document.body.innerHTML + "</div>";
  let editedHTML = document.getElementById("REOP-HighLightArea");
  const styleElm = document.createElement("style");
  styleElm.innerHTML += "span.word-highlighter{background:#f99;}";

  class highlight {
    constructor(keyword, htmlSrc) {
      this.keyword = keyword;
      this.elem = document.createElement("p");
      this.elem.innerHTML = keyword;
      this.htmlSrc = htmlSrc;
      this.highlightOn();
    }
    highlightOn() {
      const separator = "[REOP-array-separator]";
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
                '<span class="word-highlighter">$1</span>'
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
      document.getElementById("REOP-HighLightArea")
    );
  });

  class Panel {
    constructor() {
      this.elem = document.createElement("div");
      this.elem.className = "REOP-ctrl";
    }
    create() {
      styleElm.innerHTML +=
        ".REOP-ctrl{position:fixed;top:10px;right:10px;z-index:9998;width:200px;padding:0 10px 10px;text-align:left;color:#fff;background:#000;opacity:0.7;box-shadow: 0 3px 7px rgba(0, 0, 0, 0.6);border-radius:3px;}";
      styleElm.innerHTML +=
        ".REOP-ctrl p{margin:5px 0;}.REOP-ctrl input,.REOP-ctrl label{margin-right:5px;vertical-align:middle;}";
      styleElm.innerHTML +=
        ".REOP-ctrl div{margin:0 -10px 10px;padding:2px;background:#333;cursor:move;text-align:right;border-radius:3px;}.REOP-ctrl span{cursor:pointer;}";
      document.head.appendChild(styleElm);
      document.body.insertBefore(this.elem, editedHTML);
      for (let i = 0; i < patterns.length; i++) {
        this.elem.appendChild(patterns[i].elem);
      }
    }
  }
  const panel = new Panel();
  panel.create();
});
