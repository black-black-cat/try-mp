<template>
	<div class="m-login-views m-count m-views-find-password">
		<div class="header">
			<div class="m-title">
				<i v-if="hide != 0" class="icon-close_1"  @click="close"></i>
				<div>找回密码</div>
			</div>
		</div>
		<div class="container">			 
			<div class="inputs inputs-find">
				<div class="input">
					<div class="vh-center"><i class="icon-mobile"></i></div>
					<input type="text" ref="mobile" placeholder="请输入手机号">
				</div>
				<div class="input">
					<div class="vh-center"><i class="icon-pwd"></i></div>
					<input type="text" class="code-input" ref="code" placeholder="请输入短信验证码">
					<div class="countdown" :class="{disabled: isCountingDown}" @click="vcode">
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
				<div class="input">
					<div class="vh-center"><i class="icon-key"></i></div>
					<input type="password" ref="pwd" v-on:input="monitor" placeholder="请输入6-20位字母、数字的新密码">
				</div>
				<div class="btn" ref="confirm" @click="confirm">确认</div>
			</div>
		</div>
	</div>
</template>

<script>
import regular from 'lib/form/regular'
import dialogManager from 'common/plugin/dialog'
import {isLock, lock, unLock} from 'lib/comp/bus'
import base64 from "lib/str/base64"
import countdown from "common/plugin/countdown";

export default {
    props: {
		type: {
			type: String,
			default: "find", // find | update | set
		},
		options: null,
		ajaxUrl:{
			type:String,
		},
		data: Object,
		hide:String
    },
    components:{
    	countdown,
    },
    data() {
        return {
            mobile: "",
	        msgCode: "",
	        password: "",
            isCountingDown: false,
            apiSendcode: this.ajaxUrl.urlActSendcode,
            apiFindPwd: this.ajaxUrl.urlActFindpassword
        }
    },
	methods: {
		initData(data){
			this.data = data;
			this.$refs.mobile.value = data.mobile;
		},
        vcode() {
            const vm = this;
			const mobile = this.$refs.mobile.value.trim();
            if(!regular.mobile(mobile)){
                dialogManager.toast("手机号格式错误！");
                return;
            }
            if (vm.isCountingDown) {
                return;
            }
			if(vm.isLock) return;
			vm.lock();
			vm.$http.get(vm.apiSendcode, {
				params: {
					mobile: mobile,
					type: 2
				}
			}).then(res => {

				vm.unLock();
				dialogManager.toast("验证码已经发送!");
				vm.startCountDown();
			}).catch(res => {
				vm.unLock();
				if(res.res.code == -2){
					dialogManager.toast("该手机号未注册过账号！");
                    /*dialogManager.confirm("该手机号未注册过账号！", {
                        okText: "立即注册",
                        cancelText:'取消',
                        ok: function() {
                             vm.$emit("reg",{
                                mobile: mobile
                             });
                        }
                    });*/
                }else{
                    dialogManager.toast(res.msg);
                }   
			})
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
		monitor() {
			const vm = this;
			const mobile = vm.$refs.mobile.value.trim();
			const code = vm.$refs.code.value.trim();
			const pwd = vm.$refs.pwd.value.trim();
			if(!!mobile && !!code && !!pwd) {
				vm.$refs.confirm.style.opacity = '1';
			} else {
				vm.$refs.confirm.style.opacity = '0.5';
			}
		},
		confirm () {
			const vm =this;
            const mobile = vm.$refs.mobile.value.trim();
            const code = vm.$refs.code.value.trim();
            const pwd = vm.$refs.pwd.value.trim();

            if(!regular.mobile(mobile)){
                dialogManager.toast("手机号格式不正确！");
                return;
            }else if(!regular.number(code) || code.length < 6){
                dialogManager.toast("验证码为6位数字！");
                return;
            } else if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/.test(pwd))) {
                dialogManager.toast("请输入6-20位字母、数字的密码！");
                return;
            }
            if(vm.isLock) return;
            vm.lock();
            vm.$http.get(vm.apiFindPwd, {
                params: {
                    mobile: mobile,
                    code: code,
                    password: base64.encode(pwd)
                }
            }).then(res => {
            	vm.unLock();
                dialogManager.toast("找回成功");
                setTimeout(()=>{
                	vm.$emit("suc");
                },600);
            }).catch(res => {
                vm.unLock();
                console.error(res);
                dialogManager.toast(res["msg"]);
            })
		},
		lock() {
			lock();
			dialogManager.wait();
		},
		unLock() {
			unLock();
			dialogManager.closeWait();
		},
		close(){
			this.$emit("close");
		}
	}
}
</script>

<style lang="scss" scoped>
@import "../../../common/style/mixin";
.m-login-views{
	height:100vh;
    .header {
        @include display-flex(flex);
        @include justify-content(space-between);
        height: rem(275px);
        .m-title{
            text-align: center;
            font-size: rem(34);
            padding: rem(59px 36px 0 36px);
            width:100%;
            .icon-close_1{
                position: absolute;
                left:rem(34px);
            }            
        }
    }
    .container{
    	padding: rem(0 70px);
    }
    input {
        padding-left: rem(12px);
        border: none;
        font-size: rem(32px);
        height:100%;
        width: 100%;
    }
    ::-webkit-input-placeholder {
        font-size: rem(32px);
    }
	.inputs {
		margin: rem(0 auto);
		.input {
			@include display-flex();
			@include align-items(center);
			height: rem(100px);
			margin-top: rem(28);
			.vh-center {
				width: rem(60);
			}
			.code-input{
				width:70%;
			}
			.countdown {
				@include wh(270, 42);
				font-size: rem(28);
				text-align: center;
				line-height: rem(42);
			}
		}
		.btn {
			height: rem(82);
			margin-top: rem(78);
			@include radius(rem(82px));
			text-align: center;
			line-height: rem(82);
			font-size: rem(36);
			@include opacity(50);
			@include transition(all ease-in 400ms);
		}
	}
}
</style>