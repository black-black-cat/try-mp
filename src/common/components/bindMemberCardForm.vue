<template>
    <div class="form m-bind-member-card-form">
        <div class="writing">
            <div class="row row-1">
                <div class="label">会员卡号</div>
                <div class="content">
                    <span v-if="!isCardCodeInput">{{cardCode}}</span>
                    <input
                        type="text"
                        placeholder="请输入卡号"
                        v-else
                        v-model="cardCodeModel"
                        @click="focus"
                    >
                    <!-- v-model="cardCode" -->
                </div>
            </div>
            <div class="row row-2">
                <div class="label">密码</div>
                <div class="content">
                    <!-- <span v-if="!isPasswordInput">· · · · · ·</span> -->
                    <input type="password" placeholder="请输入密码" v-model="cardPassword" @click="focus">
                </div>
            </div>
            <div class="row row-3">
                <div class="label">验证码</div>
                <div class="content">
                    <input type="text" placeholder="请输入验证码" v-model="messageCode" @click="focus">
                </div>
                <div :class="{btn: true, 'btn-vcode': true, disabled: isCountingDown}" @click="vcode">
                    <span v-if="!isCountingDown">获取验证码</span>
                    <countdown v-show="isCountingDown" :time="59 * 1000" ref="countdown" :autoStart="false" @countdownstart="countdownstart" @countdownend="countdownend">
                        <template scope="props">
                            <span>重新获取</span>
                            <span v-if="props.minutes">{{ props.minutes }}m</span>
                            <span>{{ props.seconds }}s</span>
                        </template>
                    </countdown>
                </div>
            </div>
            <div class="row row-4" v-if="mobile">
                <span>验证码将发送至您的绑定手机号{{mobile.replace(/^(\d{3})\d*(\d{4})$/, "$1****$2")}}</span>
            </div>
            <div class="row row-5">温馨提示：为防止会员信息泄露，若您设置的密码过于简单，请至影院前台进行修改。</div>
        </div>
        <div class="footer">
            <div :class="{btn: true, 'btn-submit': true, disabled: !canSubmit}"
            @click="onSubmitClicked"
            >{{submitBtnText}}</div>
        </div>
    </div>
</template>

<script>
import * as comp from "lib/comp/bus";
import dialogManager from "common/plugin/dialog";
import verify from 'lib/form/verify';
import crypt from "lib/str/base64";
import webBridge from 'common/utils/webBridge'
import browser from 'lib/util/browser'
import storageMessager from "lib/util/storageMessager"
import myAxios from "common/utils/axiosCross"
import paymentPrize from "./paymentPrize"

export default {
    props: {
        operation: {
            type: String,
            default: "bind"
        },
        mobile: {
            type: String,
            default: ""
        },
        cinemaCode: {
            type: null
        },

        cardCode: {
            type: String,
            default: ""
        },
        cardID: {
            type: null
        },
        password: {
            type: String
        },

        apiSubmit: {
            type: String,
            default: ""
        },
        apiMessage: {
            type: String,
            default: ""
        },
        urlTarget: {
            type: String,
            default: ""
        },
        options: {
            type: Object
        },
        hasPrizeChance: null,
        paramsForGetPrize: Object
    },
    data() {
        return {
            isCountingDown: false,
            isShowPasswordRow: false,
            isCardCodeInput: false,
            isPasswordInput: false,
            messageCode: "",
            checker: null,
            cardPassword: "",
            cardCodeModel: "",
            prizeGot: false,
            prizeList: null
        }
    },
    computed: {
        canSubmit() {
            const vm = this;
            return vm.cardCodeModel && vm.cardPassword && vm.messageCode.length >= 4
        },
        submitBtnText() {
            return this.operation === "bind" ? "确认绑定" : "确认解绑";
        },
        isBindOperation() {
            return this.operation === "bind";
        }
    },
    components: {

    },
    created() {
        const vm = this;
        vm.cardPassword = ""; //vm.password ? crypt.decode(vm.password) : "";
        vm.isShowPasswordRow = !vm.cardPassword;
        vm.isCardCodeInput = !vm.cardCode;
        vm.isPasswordInput = !vm.cardPassword;
        if (!vm.isCardCodeInput) {
            vm.cardCodeModel = vm.cardCode;
        }
    },
    mounted() {
        const vm = this;
        vm.checker = verify();
        vm.checker.add({
            cardCode: {
                Required: true,
                Text: "卡号"
            },
            cardPassword: {
                Required: true,
                Text: "密码",
                MinLength: 6
            },
            messageCode: {
                Required: true,
                Text: "短信验证码",
                MinLength: 4
            }
        });
    },
    methods: {
        focus(ev) {
            ev.target.focus();
        },
        vcode() {
            const vm = this;
            if (vm.isCountingDown) {
                return;
            }
            if (comp.isLock()) {
                return;
            }
            comp.lock();
            dialogManager.wait();
            vm.$http.get(vm.apiMessage, {
                params: {
                    mobile: vm.mobile,
                }
            }).then(function(res) {
                let data = res.data || {};
                dialogManager.toast(res.msg || data.msg || "");
                vm.startCountDown();
                comp.unLock();
                dialogManager.closeWait();
            }).catch(function(err) {
                comp.unLock();
                dialogManager.closeWait();
                //多台设备登录时token过期，与刘威沟通无特殊code返回，只能如此判断
                if(err.msg.indexOf("请先登录") > -1 && !browser.WX){
                    dialogManager.alert("登录超时，请重新登录", {
                        okText:'好的'
                    }).then(function(){
                        storageMessager.send("loginSuc","");
                        webBridge.openUrl(vm.options.href.urlLogin, null, 1);
                    });
                    return;
                }
                dialogManager.toast(err.msg || "请求出错");
            });
        },
        startCountDown() {
            const vm = this;
            vm.isCountingDown = true;
            vm.$refs.countdown.start();
        },
        countdownend() {
            this.isCountingDown = false;
            this.$refs.countdown.reset();
        },
        onSubmitClicked() {
            const vm = this;
            if (!vm.canSubmit) {
                return;
            }
            const originParams = {
                cardCode: vm.cardCodeModel,
                cardPassword: vm.cardPassword,
                messageCode: vm.messageCode
            }
            const params = {
                cardCode: vm.cardCodeModel,
                cardPassword: crypt.encode(vm.cardPassword),
                messageCode: vm.messageCode
            };
            vm.checker.run(originParams).then(function () {
                if (!vm.isBindOperation) {
                    vm.submit(params);
                    return;
                }
                if (vm.checkPassword(originParams.cardPassword)) {
                    vm.submit(params);
                } else {
                    dialogManager.alert("密码过于简单，为确保账户安全，请到影院前台修改密码后再绑卡。");
                }
            }).catch(function (res) {
                dialogManager.toast(res.statusText);
            });
        },
        submit(params) {
            const vm = this;
            const _params = vm.isBindOperation ? {
                    cinema_code: vm.cinemaCode,
                    card_code: params.cardCode,
                    sms_code: params.messageCode,
                    password: params.cardPassword
                } : {
                    card_id: vm.cardID,
                    card_code: params.cardCode,
                    sms_code: params.messageCode,
                    password: params.cardPassword
                }
            if (comp.isLock()) {
                return;
            }
            comp.lock();
            vm.$http.post(vm.apiSubmit, _params).then(function(res) {
                let data = res.data || {};
                if (vm.hasPrizeChance && res.data.url && res.data.arrParams) {
                    let u = res.data.url;
                    let params = res.data.arrParams;
                    params = typeof params === "string" ? JSON.parse(params || {}) : params;
                    vm.$http.get(u, {
                        params: params
                    })
                        .then(resp => {
                            resp.data && myAxios.get(resp.data)
                                .then(response => {
                                    vm.prizeGot = true;
                                    vm.prizeList = response.data.prize;
                                    vm.showPrizeDialog(response.data.prize);
                                })
                                .catch(err => {
                                    showSuccessMsg()
                                })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                } else {
                    showSuccessMsg()
                }

                function showSuccessMsg() {
                    dialogManager.toast(res.msg || data.msg || "")
                        .then(vm.goTarget);
                }
                comp.unLock();
            }).catch(function(err) {
                comp.unLock();
                //多台设备登录时token过期，与刘威沟通无特殊code返回，只能如此判断
                if(err.msg.indexOf("请先登录") > -1 && !browser.WX){
                    dialogManager.alert("登录超时，请重新登录", {
                        okText:'好的'
                    }).then(function(){
                        storageMessager.send("loginSuc","");
                        webBridge.openUrl(vm.options.href.urlLogin, null, 1);
                    });
                    return;
                }
                dialogManager.toast(err.msg || "请求出错");
            });
        },
        checkPassword(pw) {
//            let consecutiveRE = /(?:(?:0(?=1)|1(?=2)|2(?=3)|3(?=4)|4(?=5)|5(?=6)|6(?=7)|7(?=8)|8(?=9)){3,}|(?:9(?=8)|8(?=7)|7(?=6)|6(?=5)|5(?=4)|4(?=3)|3(?=2)|2(?=1)|1(?=0)){3,})\d/;
//            let repeatRE = /([\d])\1{2,}/;
            let re = /(\d)\1{5,}|012345|123456|234567|345678|456789|987654|876543|765432|654321|543210/;
            let isStrong = !re.test(pw);
            return isStrong;
        },
        goTarget() {
            const vm = this;
            let url = vm.urlTarget;
            if (!url) {
                browser.WX ? history.go(-1) : webBridge.close(4);
                return;
            }
            browser.WX ? location.replace(url) : webBridge.popToSelectedController(url);
        },

        showPrizeDialog(prizeList) {
            const vm = this;
            dialogManager.open(paymentPrize, {
                prizeList,
                buts: [{text: "确定", type: "ok", id: "ok"}],
            })
                .then(vm.goTarget)
                .catch(err => {
                    console.log(err)
                })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../style/mixin";
.form {
    @include flex(1);
    @include display-flex();
    @include flex-direction(column);
    @include justify-content(space-between);
    height: 100vh;
}

.row {
    @include display-flex();
    @include align-items(center);
    margin-left: r(24);
    padding-right: r(24);
    line-height: r(100);
    border-bottom-width: 1px;
    border-bottom-style: solid;
    font-size: r(30);

    .label {
        width: r(176);
    }
    .content {
        @include flex(1);
    }
    input {
        width: 100%;
        font-size: r(30);
        padding: 0;
        margin: 0;
        border: 0;
    }

    &.row-4 {
        @include justify-content(center);
        height: r(60);
        line-height: r(60);
        font-size: r(22);
        text-align: center;
        border: 0;
    }
    &.row-5 {
        padding-top: r(22);
        padding-left: r(24);
        margin: 0;
        border: 0;
        line-height: r(32);
        font-size: r(22);
    }
}

.btn-vcode {
    min-width: r(200);
    height: r(62);
    line-height: r(62);
    text-align: center;
    border-width: r(2);
    border-style: solid;
    @include radius(rem(62px));
}

.footer {
    @include display-flex();
    @include justify-content(center);
    @include align-items(center);
    // position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: r(130);

    .btn-submit {
        width: r(702);
        height: r(82);
        line-height: r(82);
        @include radius(rem(41px));
        text-align: center;
        font-size: r(36);

        &.disabled {
            @include opacity(50);
        }
    }
}
</style>
