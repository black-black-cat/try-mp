<template>
    <div
        class="m-coupon-ticket"
        :class="{selected: selected, default: type == 'default', disabled: type == 'disabled', snack: type == 'snack', common: type == 'common'}"
        @click="ticketClicked"
    >
        <div class="wrapper">
            <div class="bg-img">
                <lazy-image :src="getBgImgSrc()"></lazy-image>
            </div>
            <div class="part-left">
                <div class="row-1">{{data.title}}</div>
                <div class="row-2">
                    {{data.type}}
                    <p>{{data.remark}}</p>
                </div>
                <div class="row-3">有效期至 {{data.endtime}}
                    <div class="arrow icon-coupon-arrow" @click.stop="showDetail">
                        <!--<i class="icon-coupon-arrow"></i>-->
                    </div>
                </div>
            </div>

            <div class="part-right">
                <div class="content"><span>&yen;</span>{{data.price}}</div>
            </div>
        </div>

        <div class="divide">
            <div class="disc"></div>
            <div class="disc"></div>
        </div>

        <div class="mark" v-if="type == 'disabled'">
             <lazy-image :src="createMark()"></lazy-image>
        </div>

        <div class="hook" v-if="selected">
            <i class="icon-hook"></i>
        </div>
    </div>
</template>

<script>
    import {object} from "common/utils/defaultProps";
    import urlUtil from "lib/util/URL";

    export default {
        props: {
            data: object,
            selected: Boolean,
            index: {
                type: Number,
            }
        },
        data() {
            return {
                bgImg: "/images/common/coupon-#.png",
                markImg: "/images/common/#.png",
                mark: ""
            }
        },
        watch: {

        },
        mounted() {
            var chooseCoupon = JSON.parse(localStorage.getItem(`coupon.selectedItems${urlUtil.parse(location.href).queryJson.ordercode}`));
            if(!!chooseCoupon && chooseCoupon.length > 0) {
                this.selected = chooseCoupon[0].code == this.data.code ? true : false;
            }

        },
        computed: {
            type() {
                const vm = this;
                let usetype = vm.data.usetype;
                let disabled = vm.data.status == 3 || vm.data.status == 4;
                return disabled ? "disabled"
                    : usetype == 3 ? "common"
                        : usetype == 2 ? "snack"
                            :"default"
            }
        },
        components: {

        },
        methods: {
            showDetail() {
                const vm = this;
                vm.$emit("showDetail", vm.data)
            },
            getBgImgSrc() {
                const vm = this;
                let usetype = vm.data.usetype;
                let imgName = usetype == 3 ? "cut"
                    : usetype == 2 ? "corn"
                        : "film";
                let src = vm.bgImg.replace(/#/, imgName);
                return src;
            },
            getAccount() {
                return urlUtil.parse(location.href).queryJson.account || "";
            },
            ticketClicked() {
                const vm = this;
                vm.$emit("ticketClicked", vm.index, vm.type)
            },
            createMark() {
                const vm = this;
                const map = {
                    3: "ticket-disabled",
                    4: "ticket-used"
                };
                let key = vm.data.status;
                let url = vm.markImg.replace(/#/, map[key]);
                vm.mark = url;
                return url;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../style/mixin";

    .m-coupon-ticket {
        position: relative;
        @include wh(702px, 240px);
        @include radius(rem(12px));
        overflow: hidden;

        >.wrapper {
            position: relative;
            @include display-flex;
            @include justify-content;
            @include wh(702px, 240px);

        }

        .divide {
            position: absolute;
            top: 0;
            right: rem(214);
            width: 0;
            height: 100%;
            .disc {
                position: absolute;
                left: rem(-15);
                @include wh(30px, 30px);
                @include radius(rem(20px));

                &:nth-of-type(1) {
                    top: rem(-15px);
                    bottom: auto;
                }
                &:nth-of-type(2) {
                    top: auto;
                    bottom: rem(-15rem);
                }
            }
        }

        .mark {
            position: absolute;
            top: 50%;
            right: rem(244);
            @include translate(0, -50%);
            @include wh(140, 140);

            >img {
                @include wh(100%, 100%);
            }
        }

        .hook {
            @include display-flex();
            @include justify-content(flex-end);
            @include align-items(flex-start);
            position: absolute;
            right: 0;
            top: 0;
            @include wh(66);

            >i {
                margin: rem(10);
            }
        }

        .part-left {
            @include box-sizing(border-box);
            @include flex(1);
            padding: rem(30);
            @include display-flex();
            @include flex-direction(column);

            .row-2 {
                @include flex(1);
                padding-top: rem(8px);
                font-size: rem(46px);

                >p {
                    padding-top: rem(18);
                    font-size: rem(26)
                }
            }

            .row-1,.row-3 {
                font-size: rem(26);
            }

            .row-3 {
                position: relative;
            }
        }

        .part-right {
            @include display-flex;
            @include justify-content(center);
            @include align-items(center);
            width: rem(214px);
            @include box-sizing(border-box);
            padding: rem(30);

            >.content {
                font-size: rem(98);
                >span {
                    font-size: rem(42);
                }
            }
        }

        .arrow {
            display: inline-block;
            vertical-align: bottom;
        }

        .bg-img {
            position: absolute;
            bottom: rem(-20);
            left: 40%;
            width: rem(145);

            >img {
                width: 100%;
            }
        }
    }
</style>
