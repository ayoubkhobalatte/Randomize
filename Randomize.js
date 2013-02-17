var Randomizer = {
    selection : undefined,
    __SPACE__ : " ",
    init: function () {

        Array.prototype.shuffle = function() {
            var i = this.length;
            if(i == 0) return this;
            while(--i) {
                var j = Math.floor(Math.random() * (i + 1));
                var a = this[i];
                var b = this[j];
                this[i] = b;
                this[j] = a;
            }
            return this;
        };

        String.prototype.shuffle = function() {
            var a = this.split(""),
                n = a.length;

            for(var i = n - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = a[i];
                a[i] = a[j];
                a[j] = tmp;
            }
            return a.join("");
        }

        /* Polyfill hack might be needed later */
    },
    randomize: function () {

        html = this.getSelectionHtml();

        if (html == "") {
            alert("Please select some text first!");
            return;
        }

        node = this.selection.anchorNode.parentNode;
        this.traverseRecursively(node);

    },
    getSelectionHtml : function () {

        var html = "";
        if (typeof window.getSelection != "undefined") {

            this.selection = window.getSelection();

            var sel = window.getSelection();
            if(sel.rangeCount) {
                var container = document.createElement("div");
                for(var i = 0, len = sel.rangeCount; i < len; ++i) {
                    container.appendChild(sel.getRangeAt(i).cloneContents());
                }
                html = container.innerHTML;
            }
        } else if(typeof document.selection != "undefined") {

            this.selection = document.selection;

            if(document.selection.type == "Text") {
                html = document.selection.createRange().htmlText;
            }
        }

        return html;
    },
    traverseRecursively : function (obj) {

        var obj = obj || document.getElementsByTagName('body')[0];
        if (obj.hasChildNodes()) {
            var child = obj.firstChild;
            while (child) {
                if (child.nodeName.toLowerCase() != 'script') {

                    if (child.nodeType === 1) {
                        this.traverseRecursively(child);
                    } else if (child.nodeType === 3) {
                        this.performShuffe(child);
                    }                
                }

                child = child.nextSibling;
            }
        }

    }, performShuffe : function (node) {

        strings = node.wholeText.split(this.__SPACE__ ).shuffle();
        for(var i = strings.length - 1; i >= 0; i--) {
            strings[i] = strings[i].shuffle();
        };

        node.nodeValue = node.nodeValue.replace(node.nodeValue, strings.join(this.__SPACE__));

    }
};

function test() {
    var r = Object.create(Randomizer);
    r.init();
    r.randomize();    
}
