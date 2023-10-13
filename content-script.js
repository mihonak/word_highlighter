chrome.runtime.onMessage.addListener((request) => {
  console.log(request.status);
  const words = ["英語", "英会話", "TOEIC", "グローバル", "海外", "外国"];

  document.body.innerHTML =
    '<div id="REOP-HighLightArea">' + document.body.innerHTML + "</div>";
  let editedHTML = document.getElementById("REOP-HighLightArea");
  const styleElm = document.createElement("style");

  //Marker class (prototype)
  /*-------------------------------------------------------------------*/
  const Marker = function (id, keyword, regexpPattern, color) {
    this.initialize(id, keyword, regexpPattern, color);
  };
  Marker.prototype = {
    initialize: function (id, keyword, regexpPattern, color) {
      this.id = id;
      this.keyword = keyword;
      this.regexpPattern = regexpPattern;
      this.color = color;
      this.check = document.createElement("input");
      this.check.id = id;
      this.check.type = "checkbox";
      this.check.value = regexpPattern;
      this.label = document.createElement("label");
      this.label.setAttribute("for", id);
      this.label.innerHTML = keyword;
      this.elem = document.createElement("p");
      this.elem.appendChild(this.check);
      this.elem.appendChild(this.label);
      const self = this;
      this.check.onclick = function () {
        if (this.checked) {
          self.markOn();
        } else {
          self.markOff();
        }
      };
    },
    markOn: function (id, keyword, regexpPattern, color) {
      const self = this;
      const separator = "[REOP-array-separator]";
      const texts = editedHTML.innerHTML
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
                new RegExp("(" + self.regexpPattern + ")", "ig"),
                '<span class="' + self.id + '">$1</span>'
              );
            }
          }
          texts[i] = texts[i].join("");
        }
      }
      editedHTML.innerHTML = texts.join("");
    },
    markOff: function (id, text, regexpPattern, color) {
      const self = this;
      editedHTML.innerHTML = editedHTML.innerHTML.replace(
        new RegExp(
          '<span class="' + self.id + '">(' + self.regexpPattern + ")</span>",
          "ig"
        ),
        "$1"
      );
    },
  };
  const patterns = [];
  words.map((word, index) => {
    patterns[index] = new Marker("REOP" + (index + 1), word, word, "#f99");
  });

  for (let i = 0; i < patterns.length; i++) {
    styleElm.innerHTML +=
      "span." + patterns[i].id + "{background:" + patterns[i].color + ";}";
  }

  //Panel class (constructor)
  /*-------------------------------------------------------------------*/
  const Panel = function () {
    this.elem = document.createElement("div");
    this.elem.className = "REOP-ctrl";
    this.create = function () {
      const self = this;
      styleElm.innerHTML +=
        ".REOP-ctrl{position:fixed;top:10px;right:10px;z-index:9998;width:200px;padding:0 10px 10px;text-align:left;color:#fff;background:#000;opacity:0.7;box-shadow: 0 3px 7px rgba(0, 0, 0, 0.6);border-radius:3px;}";
      styleElm.innerHTML +=
        ".REOP-ctrl p{margin:5px 0;}.REOP-ctrl input,.REOP-ctrl label{margin-right:5px;vertical-align:middle;}";
      styleElm.innerHTML +=
        ".REOP-ctrl div{margin:0 -10px 10px;padding:2px;background:#333;cursor:move;text-align:right;border-radius:3px;}.REOP-ctrl span{cursor:pointer;}";
      document.head.appendChild(styleElm);
      document.body.insertBefore(self.elem, editedHTML);
      for (let i = 0; i < patterns.length; i++) {
        self.elem.appendChild(patterns[i].elem);
      }
    };
  };
  const panel = new Panel();
  panel.create();
});
