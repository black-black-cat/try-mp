<template>
    <div class="footer" v-show="isShow">
        <div class="msg" v-if="footerMsg">
            <div class="inner" :style="{'animation-duration': `${scrollTextDuration}s`,
                'webkit-animation-duration': `${scrollTextDuration}s`,}" ref="scrollText">{{footerMsg}}</div>
        </div>
        <div class="console">
            <div class="left">
                <div class="item" @click="goReview" v-if="false">
                    <i class="icon icon-footer-good"></i>
                    <span class="text">333</span>
                </div>
                <div class="item" @click="goReview">
                    <i class="icon icon-footer-review"></i>
                </div>
                <div class="item" v-if="false">
                    <i class="icon icon-footer-share"></i>
                    <span class="text">333</span>
                </div>
            </div>
            <div class="right" v-if="isShowBtn" @click="nextPage">
                <div class="btn">选座购票</div>
            </div>
            <div class="right" v-else>
                <div class="btn disabled">即将上映</div>
            </div>
        </div>
        <bind-mobile :show.sync="isBindMobileShow"
        @onBindSuccess="bindMobileSuccess" :url="options.href.apiSendsmsmobile" :subUrl="options.href.apiBindmobile"
        ></bind-mobile>
    </div>
</template>

<script>
import review from "./review";
import popup from "lib/layer/popup";
import bindMobile from "common/plugin/bindMobile";
import * as bus from "lib/comp/bus";
import dialogManager from 'common/plugin/dialog';
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"
import storageMessager from "lib/util/storageMessager"

export default {
    props: {
        options: {
            type: Object,
            default () {
                return {}
            }
        },

        isShow: {
            type: Boolean,
            default: true
        }
    },
    data() {
        this.options.data.bindMobile = 0
        return {
            m_dialog: null,
            footerMsg: "",
            scrollTextDuration: 0,
            isBindMobileShow: false,
            filmCode: this.options.data.film.code,
            commentRating: 0,
            commentText: "",
            apiFirstComment: this.options.href.apiFirstcomment,
            isLogin: this.options.data.is_login,
            modeType: this.options.data.type
        }
    },
    computed: {
        isBindMobile() {
            return +this.options.data.bindMobile
        },
        isShowBtn() {
            return +this.options.data.film_shows
        }
    },
    watch: {
        commentText(newVal) {
            console.log("commentText", newVal)
        }
    },
    components: {
        bindMobile
    },
    mounted() {
        const vm = this;
        vm.m_dialog = popup("<review :href='href' :code='code' :rating='rating' :text='text' :options='options'  @hide='close' @submited='resetComments'></review>", {
            option: {
                autoHide: true,
                animate: {
                    name: "slide-bottom"
                }
            },
            popup: {
                data() {
                    return {
                        href: vm.options.href,
                        code: vm.options.data.film.code,
                        // rating: vm.commentRating,
                        // text: vm.commentText,
                        options: vm.options,
                    };
                },
                computed: {
                    rating() {
                        return vm.commentRating;
                    },
                    text() {
                        return vm.commentText;
                    }
                },
                watch: {
                    text(val) {
                        console.log("comment.Text", val)
                    }
                },
                methods: {
                    close() {
                        vm.m_dialog.hide()
                    },
                    resetComments() {
                        vm.resetComments();
                    }
                },
                components: {
                    review
                }
            }
        });

        if (vm.$refs.scrollText) {
            vm.scrollTextDuration = vm.$refs.scrollText.offsetWidth / 30;
        }

        vm.m_dialog.setPosition(0, "auto", "auto", 0);
    },
    methods: {
        goReview() {
            const vm = this;
            let loginData = storageMessager.getItem("isLogin", 0.5);
            if(!browser.WX && vm.isLogin == 0 && !loginData){
                storageMessager.send("loginSuc","");
                webBridge.openUrl(this.options.href.urlLogin, null, 1);
                return;
            }else if (!vm.isBindMobile && !loginData) {
                vm.openBindMobile();
                return;
            }
            // vm.checkFirstComment();
            vm.m_dialog.show();
        },
        checkFirstComment() {
            const vm = this;
            if (bus.isLock()) {
                return;
            }
            vm.lock();
            vm.$http.get(vm.apiFirstComment, {
                params: {
                    film_code: vm.filmCode
                }
            }).then(function (res) {
                let data = res.data;
                if (data) {
                    vm.commentText = data.content;
                    vm.commentRating = data.score;
                } else {
                    vm.commentText = "";
                    vm.commentRating = 0;
                }
                vm.m_dialog.show();
                vm.unlock();
            }).catch((err) => {
                // dialogManager.toast(err.msg || "");
                vm.m_dialog.show();
                vm.unlock();
            })
        },
        openBindMobile() {
            this.isBindMobileShow = true;
        },
        bindMobileSuccess() {
            this.$emit("bindMobileSuccess", {
                isBound: true
            });
        },
        hide() {
            this.isShow = false;
        },
        show() {
            this.isShow = true;
        },
        resetComments() {
            this.$emit("resetComments");
        },
        lock() {
            bus.lock();
            dialogManager.wait();
        },
        unlock() {
            bus.unLock();
            dialogManager.closeWait();
        },
        loginSuc(){
            this.showLogin = false;
            webBridge.topBarVisible(1);
            this.isLogin = 1;
            this.$emit("bindMobileSuccess", {
                isBound: true
            });
        },
        loginCancel(){
            webBridge.topBarVisible(1);
        },
        nextPage() {
            if(this.options.data.type == '3') {
                !!browser.WX ? location.assign(`${this.options.href.urlCinemaList}&film_code=${this.options.data.film.code}`) : webBridge.openUrl(`${this.options.href.urlCinemaList}&film_code=${this.options.data.film.code}`);
            } else {
                !!browser.WX ? location.assign(this.options.href.urlShow) : webBridge.openUrl(this.options.href.urlShow);
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";

@include keyframes(scroll-text) {
    0% {
        @include translate(r(750), 0);
    }
    100% {
        @include translate(-100%, 0);
    }
}

.footer {
    // 使用垂直弹性盒子布局，不用定位布局
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    z-index: 10;
    .msg {
        overflow: hidden;
        .inner {
            display: inline-block;
            padding-left: r(24);
            padding-right: r(24);
            line-height: 1.5;
            white-space: nowrap;
            @include animation(scroll-text);
            @include animation-timing-function(linear);
            @include animation-delay(3s);
            @include animation-iteration-count(infinite);
            @include animation-fill-mode(both);
        }
    }

    .console {
        @include display-flex(flex);
        @include justify-content(space-between);
        @include align-items(center);
        position: relative;
        padding: r(20) r(24);

        &:before {
            content: "";
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: r(20);
            @include transform(translate(0, -100%));
        }

        .left {
            @include display-flex(flex);
            @include justify-content(space-between);
            @include align-items(center);
            @include flex-grow(1);
            @include flex-shrink(0);
            margin-right: 0.2rem;
            height: r(90);
        }

        .right {
            // margin-left: r(74);
            .btn {
                width: r(340);
                height: r(90);
                line-height: r(90);
                font-size: r(38);
                @include radius(rem(45px));
                text-align: center;

                &.disabled {
                    @include opacity(50);
                }
            }
        }
    }
}
</style>
