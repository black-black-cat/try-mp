<template>
	<div class="m-version-update">
        <div class="m-container">
        	<div class="m-header"></div>
			<div class="content">
				<h3 class="title">升级到新版本</h3>
	                <div class="discription" v-html="description"></div>
			</div>
			<div class="m-footer" >
	            <div class="button cancel" v-if="cancel" @click="hide">暂不更新</div>
				<div class="button ok" @click="download">{{okText}}</div>
			</div>
        </div>
	</div>
</template>

<script>

    import {object} from "common/utils/defaultProps";
    import dialogManager from "common/plugin/dialog";
    import browser from "lib/util/browser"
    import webBridge from "common/utils/webBridge"

	export default {
	    props: ["appInfo"],
	    data() {
	        return {
                okText: "立即下载",
                description: this.appInfo.description
	        }
	    },
	    computed:{
	    	cancel(){
	    		return this.appInfo.strong != 1 ? false : true;
	    	},

	    },
		methods: {
			hide(){
				this.$emit("hide");
			},
			init(hasNew){
				if(hasNew){
					this.okText = "立即更新";
					this.cancel = false;
				}else{
					this.okText = "立即下载";
				}
			},
			download(){
				let vm = this;
				let url = browser.IOS ? vm.appInfo.url_ios : vm.appInfo.url_android;
				webBridge.downLoadApp({
                    url: url,
                    versionName: vm.appInfo.version_name
                }, res=>{
                	if(res.code != 0) vm.$emit("hide");
                });
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import '../../style/_mixin.scss';
    .m-version-update{
    	@include display-flex();
    	@include flex-direction(column);
    	@include justify-content(center);
    	@include align-items(center);
    	height:100vh;
        .m-container{
        	width:rem(559px);
	        margin:rem(0 96px);
	        @include radius(rem(20px));
	        font-size: rem(24px);
	        .m-header{
	            position: relative;
	            top:rem(-35px);
	            height:rem(207px);
	            width:100%;
	        }
	        .content{
	        	padding:rem(0 41px);
	        	.title{
	        		font-size: rem(34px);
	        		line-height: rem(50px);
	        	}
	        	.discription{
	        		line-height: rem(40px);
	        	}
	        }
	        .m-footer{
	        	text-align: center;
		    	padding:rem(40px 0);
		    	font-size: rem(36px);
		    	@include display-flex();
		    	@include flex-direction(row);
		    	@include justify-content(center);
		    	.button{
		    		@include wh(238px, 72px);
		    		line-height: rem(72px);
		    		text-align: center;
		    		margin:rem(0 18px);
		    		@include radius(rem(35px));
		    		display: inline-block;
		    	}
	        }
        }
    }
	
</style>