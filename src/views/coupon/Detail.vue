<template>
	<div class="coupon-detail">
		<div class="header">
			<div class="title">优惠券详情</div>
			<div class="btn-close" @click="hideDetail">
				<i class="icon-dialog-close"></i>
			</div>
		</div>
		<div class="body" data-bind-scroll>
			<div class="section-1">
				<div class="part-left">
					<div class="row-1">{{data.title}}</div>
					<div class="row-2">券号 {{data.code}}</div>
					<div class="row-3">有效期至 {{data.endtime}}</div>
				</div>
				<div class="part-right">
					<div class="content">
						<span class="small">&yen;</span>{{data.price}}
					</div>
				</div>
			</div>
			<div class="section-2">
				<div class="tip">不可与其他优惠活动叠加使用，暂不可抵扣服务费、改签费</div>
				<div class="list" v-if="data._usetype">
					<div class="title">使用须知</div>
					<p v-html="data._usetype"></p>
				</div>
			</div>

		</div>
	</div>
</template>

<script>
    import {object} from "common/utils/defaultProps";
    export default {
        props: {
            data: object
        },
        data() {
            return {}
        },

        methods: {
            hideDetail() {
                this.$emit("hide-detail");
            }
        }
    }
</script>

<style lang="scss" scoped>
	@import "../../common/style/mixin";

	.coupon-detail {
		width: 100vw;
		/*height: r(850);*/
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
			.section-1 {
				@include display-flex;
			    @include justify-content;
			    @include align-items(center);
				padding: rem(32px 32px 32px 8px);
				margin-left: rem(24px);

				.part-left {
					@include display-flex;
					@include flex-direction(column);
					@include justify-content(space-between);

					.row-1 {
						font-size: rem(32px);
					}

					.row-2 {
						padding-top: rem(14px);
						font-size: rem(26px);
					}

					.row-3 {
						padding-top: rem(24px);
						font-size: rem(22px);
					}
				}
				.part-right {
					@include wh(148px, 108px);
					font-size: rem(58px);
					line-height: rem(108px);
					text-align: center;
					.small {
						font-size: rem(36px);
					}
				}
			}
			.section-2 {
				.tip {
					padding: rem(24 32 50);
				}
				.list {
					padding: rem(0 32 50);
				}
			}
		}
	}
</style>