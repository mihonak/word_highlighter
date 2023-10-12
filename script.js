window.onload = () => {
  const words = ["英語", "英会話", "TOEIC", "グローバル", "海外", "外国"];
  const ulEl = document.getElementById("wordList");
  words.map((word) => {
    const liEl = document.createElement("li");
    liEl.textContent = word;
    ulEl.appendChild(liEl);
  });
  document.getElementById("btn").addEventListener("click", async () => {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: onRun,
    });
  });

  function onRun() {
    (function () {
      let H;
      const ORG = document.body.innerHTML;

      //Marker class (prototype)
      /*-------------------------------------------------------------------*/
      const Marker = function (id, text, textType, color) {
        this.initialize(id, text, textType, color);
      };
      Marker.prototype = {
        initialize: function (id, text, textType, color) {
          this.id = id;
          this.text = text;
          this.textType = textType;
          this.color = color;
          this.check = document.createElement("input");
          this.check.id = id;
          this.check.type = "checkbox";
          this.check.value = textType;
          this.label = document.createElement("label");
          this.label.setAttribute("for", id);
          this.label.innerHTML = text;
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
        markOn: function (id, text, textType, color) {
          const self = this;
          const separator = "[REOP-array-separator]",
            t = H.innerHTML
              .replace(new RegExp("(<)", "ig"), separator + "$1")
              .replace(new RegExp("(>)", "ig"), "$1" + separator)
              .split(separator);
          for (let i = 0; i < t.length; i++) {
            if (t[i].substr(0, 1) == "<") {
              //do nothing for HTML tags
            } else {
              t.splice(
                i,
                1,
                t[i]
                  .replace(
                    new RegExp("(&.{2,4};)", "ig"),
                    separator + "$1" + separator
                  )
                  .split(separator)
              );
              for (let j = 0; j < t[i].length; j++) {
                if (t[i][j].substr(0, 1) != "&") {
                  t[i][j] = t[i][j].replace(
                    new RegExp("(" + self.textType + ")", "ig"),
                    '<span class="' + self.id + '">$1</span>'
                  );
                }
              }
              t[i] = t[i].join("");
            }
          }
          H.innerHTML = t.join("");
        },
        markOff: function (id, text, textType, color) {
          const self = this;
          H.innerHTML = H.innerHTML.replace(
            new RegExp(
              '<span class="' + self.id + '">(' + self.textType + ")</span>",
              "ig"
            ),
            "$1"
          );
        },
      };
      const patterns = [];
      patterns[0] = new Marker("REOP1", "アルファベット", "[a-z]+", "#9f9");
      patterns[1] = new Marker("REOP2", "カタカナ", "[ァ-タダ-ヶー]+", "#99f");
      patterns[2] = new Marker("REOP3", "半角スペース", " +", "#f99");
      patterns[3] = new Marker("REOP4", "全角スペース", "　+", "#ee0");
      patterns[4] = new Marker("REOP5", "半角数字", "[0-9]+", "#6ee");

      //Panel class (constructor)
      /*-------------------------------------------------------------------*/
      const Panel = function () {
        this.elem = document.createElement("div");
        this.elem.className = "REOP-ctrl movable";
        this.create = function () {
          const self = this;
          const styleElm = document.createElement("style");
          styleElm.setAttribute("id", "REOP-style");
          for (let i = 0; i < patterns.length; i++) {
            styleElm.innerHTML +=
              "span." +
              patterns[i].id +
              "{background:" +
              patterns[i].color +
              ";}";
          }
          styleElm.innerHTML +=
            ".REOP-ctrl{position:fixed;top:10px;right:10px;z-index:9998;width:200px;padding:0 10px 10px;text-align:left;color:#fff;background:#000;opacity:0.7;box-shadow: 0 3px 7px rgba(0, 0, 0, 0.6);border-radius:3px;}";
          styleElm.innerHTML +=
            ".REOP-ctrl p{margin:5px 0;}.REOP-ctrl input,.REOP-ctrl label{margin-right:5px;vertical-align:middle;}";
          styleElm.innerHTML +=
            ".REOP-ctrl div{margin:0 -10px 10px;padding:2px;background:#333;cursor:move;text-align:right;border-radius:3px;}.REOP-ctrl span{cursor:pointer;}";
          document.head.appendChild(styleElm);
          document.body.innerHTML =
            '<div id="REOP-HighLightArea">' +
            document.body.innerHTML +
            "</div>";
          H = document.getElementById("REOP-HighLightArea");
          document.body.insertBefore(self.elem, H);
          self.elem.innerHTML =
            '<div class="movable_controller"><span id="REOP-close">閉じる</span></div>';
          for (var i = 0; i < patterns.length; i++) {
            self.elem.appendChild(patterns[i].elem);
          }
        };
        this.remove = function () {
          document.getElementById("REOP-close").onclick = function () {
            document.head.removeChild(document.getElementById("reop"));
            document.head.removeChild(document.getElementById("REOP-style"));
            document.body.innerHTML = ORG;
          };
        };
      };
      const panel = new Panel();
      panel.create();
      panel.remove();

      //ElementMover
      /*-------------------------------------------------------------------*/
      (function () {
        const s = document.createElement("script");
        s.setAttribute("type", "text/javascript");
        s.setAttribute("charset", "utf-8");
        s.setAttribute("src", "element_mover-1.0.js");
        document.body.appendChild(s);
      })();
    })();
  }
};
