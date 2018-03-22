<template>
	<section class="m-aboutUs-view">
		<div class="m-aboutUs-head">
			<div class="logo-img">
				<lazy-image :src="agreement.biz_logo" init-src="/images/common/aboutUs-logo.png"/>
			</div>
			<div class="intr name">{{agreement.biz_title}}</div>
			<div class="intr ver">{{version}}</div>
		</div>
		<div class="m-aboutUs-content">
			<div class="layout-1">
				<div class="item" v-show="agreement.tel">
					<span class="text">客服电话：</span>
					<span class="text right"  @click="call">{{agreement.tel||""}}</span>
				</div>
				<div class="item" v-show="agreement.service">
					<span class="text">客服时间：</span>
					<span class="text right" >{{agreement.service||""}}</span>
				</div>
				<div class="item" v-show="agreement.wx">
					<span class="text">微信：</span>
					<span class="text right" >{{agreement.wx||""}}</span>
				</div>
				<div class="item" v-show="agreement.blog">
					<span class="text">微博：</span>
					<span class="text right" >{{agreement.blog||""}}</span>
				</div>
				<div class="item" v-show="agreement.net">
					<span class="text">网址：</span>
					<span class="text right" >{{agreement.net||""}}</span>
				</div>				
			</div>
		</div>
		<div class="m-aboutUs-foot">{{agreement.ver || ""}}</div>
	</section>
</template>
<script>
    import {array, object} from 'common/utils/defaultProps'
    import dialogManager from 'common/plugin/dialog'
    import {fire, get} from 'lib/comp/bus'
    import viewport from 'lib/comp/viewport'

    export default {
        props: {
            options: object
        },
        data () {
            return {
            	agreement:this.options.data.agreement,
            	appInfo:JSON.parse(this.options.data.appInfo||'{}')  	
            }
        },
        computed:{
        	version(){
        		let rv = navigator.userAgent.match(/AppVersion\/\d{1}[.]\d{1}/);
        		return rv ? ('V '+ rv[0].split("/")[1]) : ""; 
        	}
        },
        methods:{
        	call(){
        		window.location.href = "tel://" + this.agreement.tel;
        	}
        }
    }
</script>
<style lang="scss" scoped>
	@import "../../common/style/mixin";
	.m-aboutUs-view{
		padding:rem(42px);
		.arrow-right{
			@include arrow-right(0,8px);
			margin-left: rem(21px);
			top:rem(38px);
		}
		.m-aboutUs-head{
			padding: rem(99px 0 57px 0);
			.logo-img{
				@include wh(180px, 180px);
				margin: 0 rem(243px);
				img{
					width: 100%;
					@include radius(rem(32px));
				}
			}
			.intr{
				text-align: center;
				margin-top: rem(24px);
			}
			.name{
				font-size: rem(34px);
			}
			.ver{
				font-size: rem(28px);
			}
		}
		.m-aboutUs-content{
			font-size: rem(28px);
			.layout-1{
				padding:rem(0 24px);
				.item{
					height:rem(100px);
					line-height: rem(100px);
					.right{
						padding-left: rem(25px);
					}
				}
			}
		}
		.m-aboutUs-foot{
			position: fixed;
			bottom: rem(24px);
			left:0;
			right:0;
			font-size: rem(20px);
			text-align: center;			
		}
	}	
</style>