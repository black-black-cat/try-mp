<template>
    <div class="tabs">
        <tabs-nav :content="content" @onItemClicked="slideTo" ref="nav"></tabs-nav>
        <div class="content" :style="{height: contentHeight}">
            <swiper class="" :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper">
                <!-- slides -->
                <swiper-slide :key="0">
                    <info
                        :list="content[0].list"
                        :hrefs="options.href"
                        :firstAD="firstAD"
                        :ads="ads"
                    ></info>
                    <div class="tip-bottom" v-show="!content[0].isRemain && !content[0].isEmpty" :class="{opacity: isMoreLoading}"><span class="line"></span> 哦哟~到底了 <span class="line"></span></div>
                    <div class="error-wrapper" v-if="content[0].isEmpty">
                        <error :msg="'暂无影讯'" :refresh="'yes'"></error>
                    </div>
                </swiper-slide>
                <swiper-slide :key="1">
                    <activities
                        :list="content[1].list"
                        :options="options"
                        v-if="content[1].list && content[1].list.length"
                    ></activities>
                    <div class="tip-bottom" v-show="!content[1].isRemain && !content[1].isEmpty" :class="{opacity: isMoreLoading}"><span class="line"></span> 哦哟~到底了 <span class="line"></span></div>
                    <div class="error-wrapper" v-if="content[1].isEmpty">
                        <error :msg="'敬请期待'" :refresh="'yes'"></error>
                    </div>
                </swiper-slide>
            </swiper>
        </div>
        <scroll-load :node="scrolledContainer" :loading="isMoreLoading" :delta="10" defer="no" @load="loadMore()" ref="scrollLoad"></scroll-load>
        <!--<scroll-load :node="scrolledContainer_1" :loading="isMoreLoading" :delta="10" defer="no" @load="loadMore()" ref="scrollLoad"></scroll-load>-->
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'common/plugin/swiper';
import error from "common/components/error";
import Info from "./Info";
import Activities from "./Activities";
import TabsNav from "./TabsNav";
import dialogManager from "common/plugin/dialog";

function getInitialSlide() {
    let index = localStorage.getItem("find.initialSlide");
    if (index != null) {
        localStorage.removeItem("find.initialSlide");
    }
    return index || 0;
}
let _initialSlide = getInitialSlide();

export default {
    props: {
        data: {
            type: Object
        },
        options: {
            type: Object
        }
    },
    data() {
        const vm = this;
        return {
            firstAD: this.options.bannerImage ? this.options.bannerImage[0] : "",
            ads: this.options.bannerImage,
            isMoreLoading: false,
            activeIndex: null,
            content: [
                {
                    nav: "影讯",
                    active: false,
                    index: 0,
                    page: 1,
                    lastPage: false,
                    rows: 10,
                    list: [],
                    isRemain: true,
                    isEmpty: false,
                    apiList: vm.options.href.apiDiscoverys,
                }, {
                    nav: "活动",
                    active: false,
                    index: 1,
                    page: 1,
                    lastPage: false,
                    rows: 5,
                    list: [],
                    isRemain: true,
                    isEmpty: false,
                    apiList: vm.options.href.apiActivitys,
                 }
            ],
            contentHeight: null,
            notNextTick: true,
            swiperOption: {
                initialSlide: _initialSlide,
                onSlideChangeStart(swiper) {
                    let index = swiper.activeIndex;
                    vm.activate(index);
                    vm.scrolledContainer = swiper.slides[index];
                    vm.$refs.scrollLoad.node = vm.scrolledContainer;
                },
                onInit(swiper) {
                    let index = swiper.activeIndex;
                    vm.activate(index);
                    vm.swiper = swiper;
                    vm.scrolledContainer = swiper.slides[index];
//                    vm.scrolledContainer_1 = swiper.slides[index + 1];
                }
            },
            swiper: null
        }
    },
    computed: {
        activeIndex() {
            return this.content.filter((item) => item.ative).index || 0;
        }
    },
    mounted() {
        const vm = this;
        const navEl = vm.$refs.nav.$el;
        vm.contentHeight = (window.innerHeight - navEl.offsetHeight) + "px";
        vm.getInfoList();
        vm.getActiList();
    },
    components: {
        Info,
        Activities,
        swiper,
        swiperSlide,
        TabsNav,
        error
    },
    methods: {
        slideTo(data) {
            const vm = this;
            vm.swiper.slideTo(data.index);
            vm.activate(data.index);
        },
        activate(index) {
            this.content.forEach(function(item, i) {
                if (i === index) {
                    item.active = true;
                } else {
                    item.active = false;
                }
            });
            this.activeIndex = index;
        },
        getList(index) {
            const vm = this;
            const options = vm.content[index];
            const sl = vm.$refs.scrollLoad;
            if (options.page == 1 && !vm.isMoreLoading) {
                dialogManager.wait();
            }

            vm.$http.get(options.apiList, {
                params: {
                    page: options.lastPage === false ? options.page : options.lastPage + 1,
                    rows: options.rows
                }
            }).then((res) => {
                const data = options.index == 0 ? res.data : res.data.activities;
                let len = data.length;

                if (len) {
                    options.list = [...options.list, ...data];
                }

                options.isRemain = len == options.rows;
                if (!options.isRemain) {
                    options.lastPage = options.page;
                }

                if (!options.list.length) {
                    options.isEmpty = true;
                }

                vm.isMoreLoading = false;
                sl.result = false;
                dialogManager.closeWait();
            }).catch((errData) => {
                vm.isMoreLoading = false;
                sl.result = false;
                if (!options.list.length) {
                    options.isEmpty = true;
                }
                dialogManager.closeWait();
            })
        },

        getInfoList() {
            return this.getList(0);
        },
        loadMoreInfo() {
            const vm = this;
            const options = vm.content[0];
            if (options.isRemain) {
                options.page += 1;
            }
            vm.isMoreLoading = true;
            vm.getInfoList();
        },

        loadMore() {
            const vm = this;
            let map = {
                0: "loadMoreInfo",
                1: "loadMoreActi"
            };
            vm[map[vm.activeIndex]]();
        },

        getActiList() {
            return this.getList(1);
        },
        loadMoreActi() {
            const vm = this;
            const options = vm.content[1];
            if (options.isRemain) {
                options.page += 1;
            }
            vm.isMoreLoading = true;
            vm.getActiList();
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";
.tabs {
    @include display-flex();
    @include flex-direction(column);
    height: 100%;
}

.content {
    @include flex(1);
    height: 100%;

    .swiper-container {
        height: 100%;
    }
    .swiper-wrapper {
        height: 100%;
    }
    .swiper-slide {
        box-sizing: border-box;
        padding-bottom: rem(120px);
        overflow: auto;
        -webkit-overflow-scrolling: touch;
    }

    .tip-bottom {
        @include display-flex();
        @include justify-content(center);
        @include align-items(center);
        padding-top: r(24);
        padding-bottom: r(34);
        font-size: r(26);
        text-align: center;

        &.opacity {
            @include opacity(0);
        }

        .line {
            display: inline-block;
            width: r(40);
            height: 1px;
            margin: rem(auto 24px);
        }
    }
}
.m-views-find {
    padding-top: rem(20px);
    .m-scroll-loading {
        @include flex-direction(column);
        @include justify-content(space-between);
        position: fixed;
        bottom: rem(100px);
        width: 100%;
        z-index: 10;
        padding-bottom: 0.2rem;
    }
}

    .error-wrapper {
        padding-top: rem(200);
        text-align: center;
    }
</style>
