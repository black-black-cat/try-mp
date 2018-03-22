<template>
    <div class="review-form" :class="{'textarea-focus': textareaFocus}" ref="container">
        <div class="header">
            <div class="title">发表评论</div>
            <div class="btn-close" @click="hide">
                <i class="icon-dialog-close"></i>
            </div>
        </div>
        <div class="body" :class="{'textarea-focus': textareaFocus}" data-bind-scroll ref="body">
            <div class="row-1">
                <star-rating :rating="rating" @ratingChange="setRating"></star-rating>
            </div>
            <div class="row-2">
                <span class="review-active" v-if="rating">{{rating}}分</span>
                <span class="review-none" v-else>暂无评分</span>
            </div>
            <div class="row-3" v-if="false">
                <ul>
                    <li class="item" v-for="item in Array(8)" :key="item">九九九九</li>
                </ul>
            </div>
            <div class="row-4" ref="writingWrapper">
                <div>
                <textarea placeholder="说点什么吧" type="text" class="writing" v-model="reviewContent"
                @click.stop="focus"
                ref="writing"
                @focus="writingOn('focus')"
                @blur="writingOn('blur')"
                ></textarea>
                <div class="char-counter">{{reviewContent.length}}/{{maxlength}}</div>
                </div>
            </div>
        </div>
        <div class="footer">
            <div :class="{btn: true, disabled: !reviewContent}" @click="submitComment">发表</div>
        </div>
    </div>
</template>

<script>
import starRating from "common/plugin/starRating/starRating.vue";
import dialogManager from 'common/plugin/dialog';
import * as bus from "lib/comp/bus";
import verify from 'lib/form/verify';
import inputControl from 'lib/dom/inputControl';
import closest from "lib/dom/closest";
import {default as BodyFixed} from "common/utils/bodyFixed"

export default {
    props: {
        href: null,
        code: null,
        rating: {
            type: Number,
            default: 0
        },
        text: {
            type: String,
            default: ""
        },
        options: null,
    },
    data() {
        const vm = this;
        return {
            // rating: 0,
            reviewContent: this.text,
            maxlength: 140,
            apiSubmit: vm.href.apiComment,
            apiCommentList: vm.href.apiCommentlist,
            inputControl: null,
            textareaFocus: false,
            pageY: 0,
            moved: null,
            dIsNewApple: null
        }
    },
    computed: {
        trimedContent() {
            return this.reviewContent.trim();
        }
    },
    watch: {
        reviewContent(newVal, oldVal) {
            const vm = this;
            if (newVal.length > vm.maxlength) {
                vm.reviewContent = oldVal;
                dialogManager.toast("输入文本限制为140字");
            }
        },
        text(newVal) {
            const vm = this;
            vm.reviewContent = vm.text;
        }
    },
    components: {
        starRating,
    },
    mounted() {
        let vm = this;
        this.commentChecker = verify();
        this.commentChecker.add({
            text: {
                Required: true,
                Text: "评论",
                // Chinese: true,
                // Chars: true,
                MinLength: 6
            }
        });
        // this.inputControl = inputControl();
        // this.inputControl.add(this.$refs.writing);

        let viewH = window.innerHeight;
        let h = function () {
            if (window.innerHeight == viewH) {
                document.activeElement.blur();
            }

        }
        window.addEventListener("resize", h, false); // Android resize 被触发
        vm.dIsNewApple = vm.isNewApple()
        // if (vm.dIsNewApple) {
        //     vm.moved = vm.moveReview();
        //     // vm.$refs.writing.style.caretColor = "transparent";
        // }
        let bodyFixed = new BodyFixed();
        bodyFixed.init(vm.$refs.writing, vm.$refs.container, {
            canMove: true
        });
    },
    methods: {
        focus() {
            this.$refs.writing.focus();
        },
        submit(content, score) {
            const vm = this;
            if (bus.isLock()) {
                return;
            }
            vm.lock();
            vm.$http.post(vm.apiSubmit, {
                film_code: vm.code,
                content: content,
                score: score
            }).then(function(res) {
                dialogManager.toast(res.msg || res.data.msg).then(function() {
                    vm.reviewSuccess();
                    vm.hide();
                    vm.reviewContent = "";
                    vm.rating = 0;
                });
                vm.unlock();
            }).catch(function(res) {
                dialogManager.toast(res.msg || res.data.msg);
                vm.unlock();
            });
        },
        lock() {
            bus.lock();
            dialogManager.wait();
        },
        unlock() {
            bus.unLock();
            dialogManager.closeWait();
        },
        submitComment() {
            const vm = this;
            if (vm.rating == 0) {
                dialogManager.toast("请给影片打分");
                return;
            }
            this.commentChecker.run({
                text: vm.trimedContent
            }).then(function() {
                vm.submit(vm.reviewContent, vm.rating);
            }).catch(function(res) {
                // dialogManager.toast(`${res.statusText}（一个中文占两个字符）`);
                dialogManager.toast(`评论长度不能少于6`);
            })
        },
        hide() {
            this.$emit("hide");
        },
        reviewSuccess() {
            this.$emit("submited");
        },
        setRating(data) {
            this.rating = data.rating || this.rating;
        },
        writingOn(action) {
            const vm = this;
            const container = vm.$refs.container;
            if (window.activeElement === vm.$refs.writing) {
                return;
            }
            // iOS
            if (vm.isOldApple() || vm.dIsNewApple) {
                if (action === "focus") {
                    vm.dIsNewApple && vm.bodyFixed(true);
                    vm.textareaFocus = true;
                }
                if (action === "blur") {
                    vm.dIsNewApple && vm.bodyFixed(false);
                    vm.textareaFocus = false;
                    vm.moved && vm.moved.reset();
                }
                return;
            }

            // Android
            const popupEl = closest(container, ".m-popup");
            const docBodyStyle = document.body.style;
            const docStyle = document.documentElement.style;

            if (action === "focus") {
                this.bodyFixed(true);
                container.style.position = "fixed";
                // container.style.top = (-(88*window.innerWidth/750)) + "px";
                container.style.top = 0;
                container.style.width = "100%";
                container.style.height = "100%";

                vm.textareaFocus = true;
            }
            else if (action === "blur") {
                this.bodyFixed(false);
                popupEl.style.width = "100%";
                container.style.removeProperty("position");
                container.style.removeProperty("bottom");
                container.style.removeProperty("height");
                vm.textareaFocus = false;
            }
        },
        isOldApple() {
            return !/android/i.test(navigator.userAgent) && !this.isNewApple();
        },
        isNewApple () {
            let ua = navigator.userAgent;
            let re = /(iP.*OS)\s([\d_]+)/;
            let matched = ua.match(re);
            let arrVer

            if (matched && matched[0] && matched[2]) {
                arrVer = matched[2].split("_");
                return arrVer[0] >= 11
            }
            return false;
        },
        bodyFixed(action) {
            const docBody = document.body;
            if (action) {
                this.pageY = window.pageYOffset;
                docBody.style.cssText = `position:fixed;top:${-this.pageY}px;width:100%`;
            } else {
                docBody.style.cssText = "";
                window.scrollTo(0, this.pageY);
            }
        },
        moveReview() {
            const vm = this;
            let startTouches = null;
            let prevTop = 0;
            const container = vm.$refs.container;
            container.addEventListener("touchstart", function (ev) {
                startTouches = ev.touches;
            });
            container.addEventListener("touchmove", function (ev) {
                if (!vm.textareaFocus) {
                    return;
                }
                let touches = ev.touches;
                let delta = touches[0].pageY - startTouches[0].pageY + prevTop;
                console.log(delta)

                let h = window.innerHeight / 4;
                let rectWriting = vm.$refs.writing.getBoundingClientRect();
                let rectContainer = container.getBoundingClientRect();
                let down = touches[0].pageY - startTouches[0].pageY > 0
                if (down && rectContainer.top < 0 || !down && rectWriting.top > 0) {
                    container.style.cssText = `position:relative;top:${delta}px`;
                }
            });
            container.addEventListener("touchend", function (ev) {
                prevTop = parseInt(container.style.top) || prevTop;
            });
            return {
                reset() {
                    startTouches = null;
                    prevTop = 0;
                    container.style.cssText = "";
                }
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/_mixin.scss";

.review-form {
    @include display-flex();
    @include flex-direction(column);
    @include justify-content(flex-start);
    &.textarea-focus {
        display: block;
    }
    width: 100vw;
    height: r(850);
    overflow: auto;

    .header {
        @include display-flex();
        @include justify-content(space-between);
        padding: r(32) r(34) r(24);
        font-size: r(32);
        border-bottom: r(1) solid transparent;
        text-align: center;

        .title {
            @include flex(1);
        }

        .btn-close {
            position: absolute;
            right: r(34);
        }
    }

    .body {
        @include flex(1);
        padding-top: r(40);
        overflow: auto;
        .row-1 {
            text-align: center;
            .star-rating {
                display: inline-block;
            }
        }

        .row-2 {
            padding-top: r(30);
            text-align: center;
        }

        .row-3 {
            padding: r(34) r(50) 0;
            margin-bottom: r(14);
            >ul {
                text-align: center;
            }
            .item {
                display: inline-block;
                padding: r(12) r(20);
                border: r(1) solid transparent;
                @include radius(rem(30px));
                margin-bottom: r(20);
                &+.item {
                    margin-left: 0.25rem;
                    &:nth-child(5n) {
                        margin-left: 0;
                    }
                }
            }
        }
        .row-4 {
            @include display-flex();
            @include align-items(center);
            overflow: hidden;
            >div {
                position: relative;
                width: 100%;
                margin-top: r(24);
                text-align: center;
                @include transition-duration(0.3s);
            }

            .writing {
                @include box-sizing(border-box);
                @include wh(632px, 252px);
                display: inline-block;
                padding: r(26);
                padding-bottom: 0.5rem;
                border-width: r(1);
                margin: 0;
                @include radius(rem(10px));
                text-align: left;
                @include font-size(28px);
            }
            .char-counter {
                position: absolute;
                right: 1rem;
                bottom: 0.2rem;
            }
        }
    }

    .footer {
        padding-top: r(30);
        padding-bottom: r(30);
        text-align: center;
        .btn {
            display: inline-block;
            @include wh(300px, 82px);
            line-height: r(82);
            font-size: r(38);
            @include radius(rem(45px));
            text-align: center;
            letter-spacing: r(10);

            &.disabled {
                @include opacity(50);
            }
        }
    }
}
</style>
