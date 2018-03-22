<template>
	<div class="m-movie">
		<div class="title vh-center">精明消费比一比<i class="icon-dialog-close" @click="close"></i></div>
		<div class="price scrolling" data-bind-scroll>
			<ul class="list">
				<li class="item vh-between" v-for="item in option" :class="item.channel_id <= 4 ? 'open' : ''">
					<div class="method vh-center" v-if="item.channel_id <= 4">
						<i class="icon icon-bg-card">{{icons[item.channel_id] || 'VIP'}}</i>
						<div>
							<span>{{item.channel_title}}</span>
							<template v-if="cardConfig.isSupportRegister || cardConfig && cardConfig.length == 0">
								<div class="btn vh-left" v-if="item.policyId" v-href="urlCreateCard"
								     :data-query="'policyId='+item.policyId"><span>去开卡</span><i class="arrow-right"></i>
								</div>
								<div class="btn vh-left" v-else-if="urlCardList" v-href="urlCardList"><span>去开卡</span><i
									class="arrow-right"></i></div>
							</template>
						</div>
					</div>
					<div class="method vh-center" v-else>
						<i :class="'icon icon-'+icons[item.channel_id]"></i><span>{{item.channel_title}}</span>
					</div>
					<div class="num vh-center"><i v-if="item.islowest == 1"
					                              class="icon-lost"></i><span>¥{{item.price}}</span></div>
				</li>
			</ul>
		</div>
	</div>
</template>
<script>
    import {bind, fire} from 'lib/comp/bus'

    export default {
        props: {
            option: {
                type: Array,
                default () {
                    return []
                }
            },
            urlCreateCard: String,
            urlCardList: String
        },
        data () {
            return {
                icons: {1: "海洋", 2: "VIP", 3: "权益", 4: "尊享", 5: "wx", 6: "my", 7: "tb", 8: "qq", 9: "bd", 10: "gwr"}
            }
        },
        mounted() {
            const vm = this;
			bind("setCardConfig", (data) => {
			    vm.cardConfig = data
			})
        },
        methods: {
            close () {
                this.$emit("close");
            }
        }
    }
</script>

<style lang="scss" scoped>
	@import "../../common/style/mixin";

	.m-movie {
		width: 100%;
		min-height: rem(500px);
		.title {
			height: rem(100px);
			@include font-size(32px);
			position: relative;
			.icon-dialog-close {
				position: absolute;
				right: rem(34px);
			}
		}
		.price {
			max-height: rem(900px);
			.list {
				padding: rem(16px 0 16px);
				margin-left: rem(34px);
			}
			.item {
				padding-right: rem(34px);
				height: rem(92px);
				&.open {
					.icon {
						@include font-size(20px);
						text-align: center;
						@include lt(50px);
					}
				}
				.icon {
					margin-right: rem(14px);
				}
				.method {
					@include font-size(28px);
				}
				.btn {
					margin-top: rem(8px);
					@include font-size(22px);
				}
				.arrow-right {
					@include arrow-right;
					margin-left: rem(6px);
				}
				.num {
					@include font-size(32px);
				}
				.icon-lost {
					margin-right: rem(20px);
				}
			}
		}
	}
</style>
