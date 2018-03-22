<template>
    <div class="list">
        <div class="tabs" ref="tab"><div data-index="0" class="active" @click="choose">消费</div><div data-index="1" @click="choose">积分</div></div>
        <swiper :options="mySwiper" ref="swiper">
            <swiper-slide>
                <div class="item">
                    <div class="time">
                        <div>08-30</div>
                        <div>18:20</div>
                    </div>
                    <div class="add">
                        <div>+200</div>
                        <div>前台充值</div>
                    </div>
                    <div class="balance">¥299</div>
                </div>
            </swiper-slide>
            <swiper-slide>
                <div class="item">
                    <div class="time">
                        <div>08-30</div>
                        <div>18:20</div>
                    </div>
                    <div class="add">
                        <div>+200</div>
                        <div>前台充值</div>
                    </div>
                    <div class="balance">299分</div>
                </div>
            </swiper-slide>
        </swiper>
    </div>
</template>
<script>
import { swiper, swiperSlide } from 'common/plugin/swiper';
export default {
    data() {
        const vm = this;
        return{
            mySwiper: {
                speed: 400,
                onSlideChangeStart(ev) {
                    for(let item in vm.$refs.tab.children) {
                        if(vm.$refs.tab.children[item].nodeType == 1) {
                            if(vm.$refs.tab.children[item].dataset.index != ev.activeIndex) {
                                vm.$refs.tab.children[item].classList.remove("active");
                            } else {
                                vm.$refs.tab.children[item].classList.add("active");
                            }
                        }
                    }
                }
            }
        }
    },
    components: {
        swiper,
        swiperSlide
    },
    methods: {
        choose(ev) {
            let vm = this;
            let target = ev.target;
            target.classList.add("active");
            vm.$refs.swiper.swiper.slideTo(target.dataset.index);
            for(let item in vm.$refs.tab.children) {
                if(vm.$refs.tab.children[item].nodeType == 1) {
                    if(vm.$refs.tab.children[item].dataset.index != target.dataset.index) {
                        vm.$refs.tab.children[item].classList.remove("active");
                    }
                }
            }
        }
    }
} 
</script>
<style lang="scss" scoped>
@import '../../common/style/_mixin.scss';
.m-views-inquire .list{
    margin-top: rem(24px);
    .tabs {
        @include display-flex(flex);
        @include justify-content(center);
        @include align-items(center);
        height: rem(80px);
        font-size: rem(32px);
        line-height: rem(80px);
        >div {
            position: relative;
            padding: rem(0 50px);
        }
        .active{
            &:after {
                display: inline-block;
                content: '';
                position: absolute;
                right: rem(55px);
                bottom: 0;
                width: rem(60px);
                height: rem(3px);
            }
        }
    }
    .item {
        margin-left: rem(24px);
        @include display-flex(flex);
        @include justify-content(space-between);
        @include align-items(center);
        height: rem(110px);
        .time {
            width: rem(246px);
            font-size: rem(24px);
            line-height: rem(38px);
        }
        .add {
            @include flex(1);
            font-size: rem(32px);
            div:nth-child(2) {
                margin-top: rem(10px);
            }
        }
        .balance {
            padding-right: rem(24px);
            font-size: rem(36px);
        }
    }
    .item:last-child {
        border-bottom: none;
    }
}
</style>
