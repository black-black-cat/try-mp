<template>
    <div class="m-openvip-content">
        <div class="title">开通影城会员卡</div>
        <div><div class="name">会员名称</div><input type="text" placeholder="会员名称" ref="nick"></div>
        <div><div class="name">手机号码</div><div ref="mobile">{{this.user.mobile}}</div></div>
        <div><div class="name">验证码</div><input type="text" class="idtCode" v-focus  placeholder="请输入验证码" ref="code" v-on:input="getcode" onkeyup="this.value=this.value.replace(/\D/g,'')"><div class="code" :class="{disabled: isSend}" @click="getCode">{{text}}</div></div>
        <div><div class="name">设置密码</div><input type="password" placeholder="请输入密码" ref="pwdone" v-on:input="pwdone"></div>
        <div><div class="name">确认密码</div><input type="password" placeholder="请再次输入密码" ref="pwdtwo" v-on:input="pwdtwo"></div>
        <div><span class="check" @click="check"><i class="icon-hook2"></i></span>我已阅读的并同意<span class="condtion" @click="policy">《会员卡协议》</span></div>
    </div>
</template>
<script>
import {bus, isLock, lock, unLock, get} from 'lib/comp/bus';
import popup from 'lib/layer/popup';
import policy from './Policy.vue';
import regular from 'lib/form/regular';
import dialog from 'common/plugin/dialog';
import webBridge from 'common/utils/webBridge'
import browser from 'lib/util/browser'
import storageMessager from "lib/util/storageMessager"

export default {
    props: ["options"],
    data() {
        return {
            user: this.options.data.user,
            isSend: false,
            second: 59,
            tid: null,
            code: '',
            isDeal: false,
            pwd: '',
            nick: ''
        }
    },
    computed: {
        text () {
            if(!this.isSend) return "获取验证码";
            else return this.second + "秒可重发";
        }
    },
    methods: {
        getCode: function() {
            let vm = this;
            if(!this.$refs.nick.value.trim()) {
                dialog.toast("请输入会员名称");
                return;
            }
            if(this.isSend) return;
            if(isLock()) return;
            this.lock();
            this.mobile = this.$refs.mobile.innerHTML;
            this.$http.get(this.options.href.apiSendsms, {
                params: {mobile: this.mobile}
            }).then((res) => {
                dialog.toast(res["msg"]);
                this.isSend = true;
                this.$emit("sendend");
                this.unLock();
                this.timer();
            }).catch((res) => {
                this.unLock();                
                //多台设备登录时token过期，与刘威沟通无特殊code返回，只能如此判断
                if(res.msg.indexOf("请先登录") > -1 && !browser.WX){
                    dialog.alert("登录超时，请重新登录", {
                        okText:'好的'
                    }).then(function(){
                        storageMessager.send("loginSuc","");
                        webBridge.openUrl(vm.options.href.urlLogin, null, 1);
                    });
                    return;
                }
                dialog.toast(res.msg || "请求出错"); 
                this.$emit("sendend");
            });
        },
        init () {
            this.isSend = false;
            this.second = 59;
            clearInterval(this.tid);
            this.tid = null;
        },
        timer () {
            this.tid = setInterval(() => {
                this.second--;
                if(this.second <= 0){
                    this.init();
                }
            }, 1000);
        },
        check: function(ev) {
            const vm = this;
            let target = ev.target.children[0] ? ev.target.children[0] : ev.target;
            vm.nick = vm.$refs.nick.value.trim();
            vm.isDeal = target.classList.contains("icon-hook2") ? false : true;
            target.classList.toggle("icon-hook2");
            bus.$emit(get("payInfo"), {deal: vm.isDeal, nick: vm.nick});
        },
        getcode () {
            bus.$emit(get("getcode"), this.$refs.code.value);
        },
        pwdone: function() {
            let val = this.$refs.pwdone.value;
            if(val.length >= 6) {
                var reg = /^(-?\d+)$/;
                if(!reg.test(val)) {
                    this.$refs.pwdone.blur();
                    dialog.toast("请输入六位以上数字密码");
                    this.$refs.pwdone.value = '';
                    return;
                }

                if(!regular.strongPassword(val)) {
                    this.$refs.pwdone.blur();
                    dialog.toast("密码过于简单，请重新设置");
                    this.$refs.pwdone.value = '';
                    return;
                }
                bus.$emit(get("pwdone"), this.$refs.pwdone.value);
                bus.$emit(get("payInfo"), {deal: true, nick: this.$refs.nick.value.trim()});
            }
        },
        pwdtwo: function() {
            if(this.$refs.pwdone.value.length >= 6) {
                bus.$emit(get("pwdtwo"), this.$refs.pwdtwo.value);
            }
        },
        lock() {
            lock();
            dialog.wait();
        },
        unLock() {
            unLock();
            dialog.closeWait();
        },
        policy() {
            const vm = this;
            vm.m_dialog_policy = popup("<policy @close='close' :options='options'></policy>", {
                option: {
                    autoHide: true,
                    animate: {
                        name: "slide-bottom"
                    }
                },
                popup: {
                    data() {
                        return {
                            options: vm.options
                        };
                    },
                    methods: {
                        close() {
                            vm.m_dialog_policy.hide();
                        }
                    },
                    components: {
                        policy
                    }
                }
            });
            vm.m_dialog_policy.show(0, "auto", "auto", 0);
        }
    },
    mounted() {
        this.$refs.nick.value = this.user.nick ||"";
    },
    directives: {
        focus: {
            inserted: function(el) {
                el.focus();
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import "../../common/style/mixin";
.m-openvip-content {
    >div {
        @include display-flex(flex);
        @include align-items(center);
        padding-right: rem(24px);
        font-size: rem(28px);
        line-height: rem(100px);
    }
    >div:nth-child(n+2) {
        margin-left: rem(24px);
    }
    >div:last-child {
        border-bottom: none;
    }
    .title{
        padding-left: rem(24px);
        font-size: rem(30px);
    }
    .name {
        min-width: rem(176px);
    }
    input {
        //width: 100%;
        border: none;
        font-size: rem(32px);
        line-height: normal;
    }
    ::-webkit-input-placeholder {
        font-size: rem(30px);
    }
    .code {
        @include wh(200px, 62px);
        font-size: rem(26px);
        line-height: rem(62px);
        text-align: center;
        @include radius(rem(31px));
    }
    .check {
        @include wh(40px, 40px);
        margin-right: rem(16px);
        @include radius(100%);
        //text-align: center;
        .icon-hook2 {
            position: relative;
            top: rem(-25px);
            left: rem(4px);
        }
    }
    .idtCode {
        width: rem(340px);
    }
}
</style>