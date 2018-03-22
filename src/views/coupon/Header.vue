<template>
<div class="header container">
    <div class="row row-1" v-if="disabled">
        <div class="counter" @click="showAble"><span class="arrow-left"></span> 返回优惠券 </div>
        <div class="btn-detail">
            <i class="icon-question"></i>
        </div>
    </div>
    <template v-else>
        <div class="row row-1">
            <div class="counter">您有 <span class="highlight">{{ticketCount}}</span> {{displayType == "selectable" ? "张券可用于此订单":"张券可用"}}</div>
            <!--<div class="counter" v-else></div>-->
            <div class="btn-detail" v-href="hrefs.urlInstruction">
                <i class="icon-question"></i>
            </div>
        </div>
        <div class="row row-2">
            <div class="search-input" @click="focusCouponCode">
                <input type="text" placeholder="请输入优惠券号" v-model="couponCode" ref="couponCode"/>
                <div class="clear" v-if="isShowClearInput" @click.stop="clearCouponCode"></div>
            </div>
            <div class="search-btn" @click="btnClicked">兑换</div>
        </div>
    </template>
</div>
</template>

<script>
    import dialogManager from "common/plugin/dialog";
    import ValidForm from "./ValidForm";
    import verify from "lib/form/verify";
    import {isLock, lock, unLock} from "lib/comp/bus";
    import browser from "lib/util/browser"
    import webBridge from "common/utils/webBridge"
    
    export default {
        props: {
            displayType: {
                type: String,
                default: "able"
            },
            options: Object,
            ticketCount: Number
        },
        data() {
            return {
                couponCode: "",
                validation: null,
                urlCaptcha: this.options.href.captcha,
                hrefs: this.options.href,
                user: this.options.data.user,
                validCodeNeeded: false,
                validForm: null
            }
        },
        computed: {
            disabled() {
                return this.displayType == "disable";
            },
            isShowClearInput() {
                return !!this.couponCode
            }
        },
        components: {
            ValidForm
        },
        created() {
            this.setValidation();
        },
        mounted() {
//            this.openValidForm();
        },
        methods: {
            showAble() {
                this.$emit("showAble");
            },
            focusCouponCode() {
                this.$refs.couponCode.focus();
            },
            btnClicked() {
                const vm = this;
                vm.validation.run({
                    couponCode: vm.couponCode
                }).then(() => {
                    vm.isNeedValidCode()
                        .then((res) => {
                            let isNeed = res.data.data == 1;
                            vm.validCodeNeeded = isNeed;
                            vm.openValidForm(isNeed);
                            vm.unlock();
                        }).catch((errData) => {
                            dialogManager.toast(errData.msg || "");
                            vm.unlock();
                        })
                }).catch((res) => {
                    dialogManager.toast(`${res.statusText}`);
                })
            },

            openValidForm(validCode) {
                const vm = this;
                dialogManager.open(ValidForm, {
                    urlCaptcha: vm.urlCaptcha,
                    validCode,
                    buts: [{text: "取消", id: "cancel"}, {text: "确定", type: "ok", id: "ok"}],
                    tapClose: false,
                    ok: (params) => {
                        const popup = params.popup.popup.$refs.content;
                        vm.validForm = popup;
                        const submitedParams = {
                            code: vm.couponCode,
//                        verifycode: popup.validCode,
                            captcha: popup.captcha,
                            account: vm.user.account,
                            mobile: vm.user.mobile
                        };
                        if (vm.validCodeNeeded) {
                            Object.assign(submitedParams, {
                                verifycode: popup.validCode,
                            })
                        }
                        vm.bindCoupon(submitedParams, params.popup);
                    }
                })
                    .catch(() => {

                })
            },
            isNeedValidCode() {
                const vm = this;
                if (isLock()) {
                    return;
                }
                vm.lock();
                return vm.$http.post(vm.hrefs.apiCheckverify, {
                    code: vm.couponCode
                })
            },
            bindCoupon(params, popup) {
                const vm = this;
                if (isLock()) {
                    return;
                }
                vm.lock();
                vm.$http.post(vm.hrefs.apiCouponbind, params)
                    .then((res) => {
                        popup.hide();
                        dialogManager.toast(res.msg || "绑定成功")
                            .then(() => {
                                // 刷新列表
                                if(browser.WX){
                                    location.reload();
                                }else{
                                    webBridge.reload();
                                }
                            });
                        vm.unlock();
                    })
                    .catch((errData) => {
                        const popupContent = popup.popup.$refs.content;
                        let res = errData.res;
                        if (res.msg.includes("已经被激活")) {
                            popup.hide();
                        }
                        popupContent.makeUrlCaptcha(); // update captcha
                        dialogManager.toast(errData.msg || "绑定不成功");
                        vm.unlock();
                    })
            },
            setValidation() {
                this.validation = verify();
                this.validation.add({
                    couponCode: {
                        Required: true,
                        Text: "优惠券码",
//                        MinLength: 6
                    }
                });
            },
            lock() {
                dialogManager.wait();
                lock();
            },
            unlock() {
                dialogManager.closeWait();
                unLock();
            },
            clearCouponCode() {
                this.couponCode = ""
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../common/style/mixin";
    .arrow-left {
        @include arrow-right();
        display: inline-block;
        transform: rotate(180deg);
    }
    .container {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
    }
    .row {
        @include display-flex();
        @include justify-content(space-between);
        @include align-items(center);
        padding: rem(0 24px);
    }
    .row-1 {
        height: rem(88px);
        font-style: rem(26px);
        .counter {
            line-height: rem(88px);
        }
    }
    .row-2 {
        height: rem(120px);
    }
    .search {
        &-input {
            @include display-flex;
            @include justify-content(center);
            @include align-items(center);
            @include wh(538px, 72px);
            @include radius(rem(72px));
            >input {
                width: rem(470px);
                font-style: rem(32px);
                line-height: rem(32px);
                border: none;
            }

            .clear {
                @include wh(30);
                @include plus(20, rem(2));
                @include radius(100%);
                @include rotate(45deg);
            }
        }

        &-btn {
            @include wh(140px, 72px);
            @include radius(rem(72px));
            font-size: rem(32px);
            line-height: rem(72px);
            text-align: center;
        }
    }
</style>
