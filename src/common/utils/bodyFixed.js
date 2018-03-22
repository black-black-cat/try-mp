/**
 * bodyFixed 处理fixed定位的弹窗的中输入光标乱飞的问题，动body的定位和弹窗都是fixed时，光标不会乱飞
 */
import closest from "lib/dom/closest";
export default class {
    constructor() {
        this.pageY = 0
        this.container = null
        this.tid = null
        this.moved = null
    }

    bodyFixed(action) {
        if (!isNewApple()) {
            return;
        }
        const docBody = document.body;
        const docElem = document.documentElement;
        let css = docElem.style.cssText + "";
        if (action) {
            this.pageY = window.pageYOffset;
            docBody.style.cssText = `position:fixed;top:${-this.pageY}px;width:100%`;
            docElem.style.height = "100%";
            docElem.style.overflow = "hidden";
        } else {
            docBody.style.cssText = "";
            docElem.style.height = "";
            docElem.style.overflow = "";
            window.scrollTo(0, this.pageY);
        }
    }
    init(els, container, opts = {
        canMove: false
    }) {
        if (!isNew) {
            return;
        }
        this.container = container;
        let moved;
        if (opts.canMove) {
            moved = this.moved = move(container);
        }

        els = [].concat(els);
        els.forEach((el) => {
            el.addEventListener("focus", () => {
                this.bodyFixed(true);
                setTimeout(() => {
                    this.check()
                }, 10);
            });
            el.addEventListener("blur", () => {
                this.bodyFixed(false);
                this.stopInterval(this.tid);
                opts.canMove && moved.reset();
                container.style.cssText = "";
            })
        });
    }
    check() {
        const self = this;
        let prevTop = 0;
        self.tid && self.stopInterval(self.tid);
        self.tid = interval(100, () => {
            let rect = self.container.getBoundingClientRect();

            if (prevTop == rect.top && (!self.moved || self.moved && !self.moved.moving())) {
                self.container.style.cssText = `position: relative; top: ${-rect.top}px`;
                let newRect = self.container.getBoundingClientRect();
                self.container.style.cssText = `position: relative; top: ${parseFloat(getComputedStyle(self.container).top)-newRect.top}px`;
                console.log(self.container.style.cssText)
            }

            if (self.moved && self.moved.moving()) {
                self.stopInterval(self.tid);
            }
            prevTop = rect.top;
        })
    }
    stopInterval(tid) {
        cancelInterval(tid);
        this.tid = null;
    }
}

export function move(container) {
    if (!isNew) {
        return;
    }
    let startTouches = null;
    let prevTop = 0;
    let activeEl = null;
    let moving = false;

    container.addEventListener("touchstart", function (ev) {
        startTouches = ev.touches;
        activeEl = document.activeElement
    });
    container.addEventListener("touchmove", function (ev) {
        if (!closest(activeEl, ".m-popup")) {
            return;
        }
        moving = true;
        let touches = ev.touches;
        let delta = touches[0].pageY - startTouches[0].pageY + prevTop;
        console.log(delta)

        let h = window.innerHeight / 4;
        let rectContainer = container.getBoundingClientRect();
        let rectWriting = container.querySelector("input, textarea").getBoundingClientRect();
        let down = touches[0].pageY - startTouches[0].pageY > 0
        if (down && rectContainer.top < 0 || !down && rectWriting.top > 0) {
            container.style.cssText = `position:relative;top:${delta}px`;
        }
    });
    container.addEventListener("touchend", function (ev) {
        prevTop = parseInt(container.style.top) || prevTop;
        moving = false;
    });

    return {
        moving() {
            return moving;
        },
        reset() {
            startTouches = null;
            prevTop = 0;
            container.style.cssText = "";
        }
    }
}

function isNewApple() {
    let ua = navigator.userAgent;
    let re = /(iP.*OS)\s([\d_]+)/;
    let matched = ua.match(re);
    let arrVer

    if (matched && matched[0] && matched[2]) {
        arrVer = matched[2].split("_");
        return arrVer[0] >= 11
    }
    return false;
}

let isNew = isNewApple();

function interval(delay, fn) {
    var start = Date.now();
    var data = {};
    data.id = requestAnimationFrame(loop);

    return data;

    function loop() {
        data.id = requestAnimationFrame(loop);

        if (Date.now() - start >= delay) {
            fn();
            start = Date.now();
        }
    }
}

function cancelInterval(data) {
    cancelAnimationFrame(data.id);
}