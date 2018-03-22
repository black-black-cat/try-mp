<template>
    <div class="nav" ref="nav">
        <div :class="{'nav-list': true, 'nav-list-fixed': isFixed}">
            <!-- <div v-for="item in items" :class="{'nav-item': true, 'active': item.active}" :key="item.nav" :data-index="item.index" @click="onItemClicked(item.index)">{{item.nav}}</div> -->
            <swiper class="" :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper">
                <!-- slides -->
                <swiper-slide v-for="item in items" :key="item.nav" ref="mySlide">
                    <div :data-index="item.index" :class="{'nav-item': true, 'active': item.active}" @click="onItemClicked(item.index)">{{item.nav}}</div>
                </swiper-slide>
                <div class="nav-indicator" :style="{left: indicatorLeft
                    , width: indicatorWidth}">
                    <span></span>
                </div>
            </swiper>
        </div>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'common/plugin/swiper';
export default {
    props: {
        items: {
            type: Array,
            default() {
                return []
            }
        },
        activeItem: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    watch: {
        items(newVal) {
            const vm = this;
            if (vm.swiper) vm.swiper.update();
        },
        activeItem(newVal) {
            const vm = this;
            let index = newVal.index
            vm.swiper.slideTo(index);
            vm.setIndicatorPosition(index);
        }
    },
    data() {
        const vm = this;
        return {
            swiper: null,
            notNextTick: true,
            swiperOption: {
                initialSlide: vm.activeItem.index,
                slidesPerView: 6,
                observeParents: true,
                onTap(swiper) {

                },
                onSlideChangeEnd(swiper) {
                    let index = swiper.activeIndex;
                },
                onInit(swiper) {
                    let index = vm.activeItem.index;
                    vm.swiper = swiper;
                    vm.slideWidth = swiper.slides[0].offsetWidth;
                    vm.setIndicatorPosition(index);
                    vm.setScrolling();
                }
            },
            slideWidth: 0,
            activeSlideLeft: 0,
            scrolledParent: document.querySelector(".m-count"),
            isFixed: false
        }
    },
    computed: {
        activeIndex() {
            let filtered = this.items.filter(function(item, i) {
                return item.active;
            });
            if (filtered.length) {
                return filtered[0].index;
            } else {
                return 0;
            }
        },
        indicatorLeft() {
            const vm = this;
            return vm.activeSlideLeft + "px";
        },
        indicatorWidth() {
            const vm = this;
            return vm.slideWidth + "px";
        },
        itemWidth() {
            return this.indicatorWidth;
        }
    },
    components: {
        swiper,
        swiperSlide
    },
    methods: {
        onItemClicked(index) {
            const vm = this;
            vm.$emit("onItemClicked", {
                index
            });
        },
        setIndicatorPosition(index) {
            const vm = this;
            let left = vm.swiper.slides[index].offsetLeft;
            vm.activeSlideLeft = left;
        },
        setScrolling() {
            const vm = this;
            let rAF = requestAnimationFrame
                || webkitRequestAnimationFrame
                || function (func) {
                    setTimeout(func, 1000 / 60);
                };
            vm.scrolledParent.addEventListener("scroll", function () {
                rAF(function () {
                    vm.onScroll();
                });
            });
        },
        onScroll() {
            const vm = this;
            const nav = vm.$refs.nav;
            let top = nav.getBoundingClientRect().top;
            if (top < 0) {
                vm.isFixed = true;
            } else {
                vm.isFixed = false;
            }
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";

.nav::-webkit-scrollbar {
    display: none;
}

.nav {
    position: relative;
    text-align: center;
    font-size: r(32);

    .swiper-wrapper {
        position: relative;
    }



    &-list {
        position: relative;

        &:before {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            z-index: 3;
            width: 100%;
            height: r(6);
            @include transform(translate(0, 100%));
        }

        &.nav-list-fixed {
            position: fixed;
            left: 0;
            top: 0;
            z-index: 10;
        }
    }

    &-item {
        display: block;
        height: r(88);
        line-height: r(88);
        text-align: center;
    }

    &-indicator {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 50%;
        @include transition-duration(0.3s);
        >span {
            display: block;
            margin: auto;
            height: r(3);
            width: 2.5em;
        }
    }
}
</style>