<template>
	<section class="m-settings-view">
		<div class="m-settings-content">
			<div class="layout-1">
				<div class="item" @click="changeMobile">
					<span class="lf-con">手机号</span>
					<span class="rt-con">
						<span class="text text_tel">{{mobile}}</span>
						<i class="arrow-right"></i>
					</span>
				</div>
				<div class="item" @click="changePwd">
					<span class="lf-con">密码</span>
					<span class="rt-con">
						<span class="text">设置</span>
						<i class="arrow-right"></i>
					</span>
				</div>
			</div>
			<div class="layout-1" v-if="!iswx">
				<div class="item" @click="update">
					<span class="lf-con">版本更新</span>
					<span class="rt-con">
						<span class="text"></span>
						<i class="arrow-right"></i>
					</span>
				</div>
				<div class="item" @click="clear">
					<span class="lf-con">清理缓存</span>
					<span class="rt-con">
						<span class="text">{{size}}</span>
						<i class="arrow-right"></i>
					</span>
				</div>
				<div class="item" v-href="options.href.urlAboutus">
					<span class="lf-con">关于{{title}}</span>
					<span class="rt-con">
						<span class="text"></span>
						<i class="arrow-right"></i>
					</span>
				</div>
			</div>
		</div>
		<div class="m-settings-foot" v-if="!iswx">
			<div class="button" @click="exit">退出登录</div>
		</div>
		<version-update v-if="!iswx" :show.sync="showUpdate" :appInfo="appInfo" :has-new="hasNew" :page="setting"/>
	</section>
</template>
<script>
    import {array, object} from 'common/utils/defaultProps'
    import findPwd from 'common/plugin/findPwd'
    import dialogManager from 'common/plugin/dialog'
    import {isLock, lock, unLock} from 'lib/comp/bus'
    import viewport from 'lib/comp/viewport'
    import shadow from "lib/str/shadow"
    import browser from "lib/util/browser"
	import webBridge from "common/utils/webBridge"
	import storageMessager from "lib/util/storageMessager"

    export default {
        props: {
            options: object
        },
        components:{
            findPwd
        },
        data () {
            return {
                height: 0,
                mobile:shadow(this.options.data.mobile, 3, 4),
                size:'0MB',
                hasPwd:this.options.data.hasPwd,
                appInfo: JSON.parse(this.options.data.appInfo || '{}'),
            	hasNew: null,
            	showUpdate: false,
            	setting: 'setting',
            	title: this.options.data.agreement.biz_title||'兜有电影',
            	ajaxUrl:this.options.href,
            	iswx: browser.WX,
            }
        },
        mounted () {
        	let vm = this;
        	if(!browser.WX){
        		setTimeout(vm.getSize(),1000);
        	}
    	},
        methods: {
            exit(){
            	let vm = this;
            	if(isLock()) return;			    
            	dialogManager.confirm("确定要退出登录吗？", {
            		okText: '确定',
            		cancelText: '取消',
            		ok : function(){  
            			vm.lock();          			
			            vm.$http.get(vm.options.href.apiLogout).then(res => {
			            	webBridge.logout();
			            	storageMessager.send("isLogin", '');
			            	dialogManager.toast("退出登录成功");
			            	vm.unLock();
		                    if(browser.WX){
		                    	location.href = vm.options.href.urlIndex
		                    }else{
		                    	webBridge.popToSelectedController(vm.options.href.urlIndex);
		                    }
			                               
			            }).catch(res => {
			                vm.unLock();
			                dialogManager.toast(res['msg']);
			            })
			    	}
            	})
            },
            getSize(){
            	webBridge.getCacheSize(res=>{            		
            		if(res.code == 0){
		                let mb = (parseFloat(res.data.cacheSize)/1024/1024).toFixed(1)+"MB";
		                this.size = mb;
            		}
            	});
            },
            clear(){
            	let vm = this;
            	if(isLock()) return;
            	if(parseFloat(vm.size) == 0 || parseFloat(vm.size) < 0) {
            		dialogManager.toast("亲，已经清干净了，请稍后再试！");
            		return;
            	}
            	vm.lock();
            	webBridge.clearCache(res=>{
            		vm.unLock();
            		if(res.code == 0) {
            			vm.size = "0MB";
            			dialogManager.toast("清理完成");
            		}else{
            			dialogManager.toast("清理失败，请稍后再试");
            		}
            	});
            },
            changePwd(){
            	let vm = this;
            	if(vm.hasPwd == 1){
            		if(browser.WX){
            			location.href = this.options.href.urlEditpassword;
            		}else{
            			webBridge.openUrl(this.options.href.urlEditpassword);
            		}
            	}else{
            		if(browser.WX){
            			location.href = this.options.href.urlFindpassword;
            		}else{
            			webBridge.openUrl(this.options.href.urlFindpassword, null, 1);
            		}
            	}
            },
            changeMobile(){          		
            	let vm = this;
            	if(browser.WX){
        			location.href = this.options.href.urlChangemobile;
        		}else{
        			webBridge.openUrl(this.options.href.urlChangemobile);
        		}
            },
            update(){
	            let vm = this;
	            if(!this.options.data.appInfo) return;
	            if(isLock())return;
	            vm.lock();
	            let version_code = vm.appInfo.version_code; 
	            let versionName = vm.appInfo.version_name;
	            webBridge.checkHaveNewApp(versionName, res=>{
	            	vm.unLock();
	                if(res.code != 0) {
	                	dialogManager.toast(res.msg);
                    	return;
	                };
	                let n = Number(version_code) - Number(res.data.versionCode);
	                if(res.data.alreadyDownload == 0 && n > 0){
	                    vm.hasNew = false;
	                    vm.showUpdate = true;
	                    if(n > 1) vm.appInfo.strong = 0;
	                }else if(res.data.alreadyDownload == 1){
	                    vm.hasNew = true;
	                    vm.showUpdate = true;
	                }else{
	                	dialogManager.toast("已经是最新版本了！");
	                	return;
	                }
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
        }
    }
</script>
<style lang="scss" scoped>
	@import "../../common/style/mixin";
	.m-settings-view{
		.arrow-right{
			@include arrow-right(0,8px);
			margin-left: rem(21px);
			top:rem(38px);
		}
		.m-settings-content{
			font-size: rem(30px);
			.layout-1{
				margin-bottom: rem(24px);
				padding:rem(0 24px);
				.item{
					@include display-flex();
					@include justify-content(space-between);
					@include flex-direction(row);
					height:rem(100px);
					line-height: rem(100px);
					&::last-child{
						border-bottom:rem(1px) solid 
					}
					.lf-con{
						text-align: left;
					}
					.rt-con{
						text-align: right;
						@include display-flex();
						@include flex-direction(row);						
						@include flex-wrap(nowrap);						
						.text{
							margin-right: rem(21px);							
						}						
					}
				}
			}
		}
		.m-settings-foot{
			position: fixed;
			bottom: 0;
			left:0;
			right:0;
			font-size: rem(32px);
			text-align: center;
			line-height: rem(98px);
			height:rem(98px);				
		}
	}	
</style>