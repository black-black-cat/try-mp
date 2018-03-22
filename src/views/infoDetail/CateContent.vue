<template>
    <div class="cate-content">
        <!-- <placeholder v-show="isPlaceholderShow"></placeholder> -->
        <swiper class="" :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper">
            <!-- slides -->
            <swiper-slide v-for="(item, j) in data" :key="j">
                <template v-if="item.arr.length">
                <media-object v-for="(val, i) in item.arr" :key="i"
                :data="val"
                :time="val.show_time"
                :url="appendQuery(urlGoDetail, val.id)"
                ></media-object>
                </template>
                <placeholder v-else-if="isPlaceholderShow"
                msg="空空如也~"
                ></placeholder>
            </swiper-slide>

        </swiper>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'common/plugin/swiper';
import { array , object } from "common/utils/defaultProps";
import placeholder from "common/components/error";
import MediaObject from "common/components/mediaObjectNews";
import query from "lib/json/query";

export default {
    props: {
        data: array,
        activeItem: object,
        apiContentData: {
            type: String,
            default: ""
        }
    },
    data() {
        const vm = this;
        return {
            swiper: null,
            notNextTick: true,
            swiperOption: {
                initialSlide: vm.activeItem.index,
                observeParents: true,
                autoHeight: true,
                onTap(swiper) {

                },
                onSlideChangeEnd(swiper) {
                    let index = swiper.activeIndex;

                    vm.$emit("slided", {
                        index: index
                    });
                    if (!vm.data[index].got) {
                        return;
                    }
                    vm.togglePlaceholder(index);
                },
                onInit(swiper) {
                    vm.swiper = swiper;
                }
            },
            isPlaceholderShow: false,
        }
    },
    computed: {
        urlGoDetail() {
            return this.apiContentData.replace(/[^\/]*$/, "view");
        }
    },
    watch: {
        data:{
            deep: true,
            handler(newVal) {
                const vm = this;
                console.log("data", newVal, vm.activeItem);
                vm.togglePlaceholder(vm.activeItem.index);
            }
        }
    },
    components: {
        swiper,
        swiperSlide,
        placeholder,
        MediaObject
    },
    mounted() {
        console.dir(this.data)
    },
    methods: {
        slideTo(index) {
            this.swiper.slideTo(index);
        },
        togglePlaceholder(index) {
            const vm = this;
            if (!vm.data[index].arr.length) {
                vm.isPlaceholderShow = true
            } else {
                vm.isPlaceholderShow = false
            }
        },
        appendQuery(url, id) {
            return query.url(url, {
                id: id
            });
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";

.cate-content {
    position: relative;
    height: r(500);
    overflow: visible;

    .m-error {
        position: absolute;
        top: r(200);
        left: 50%;
        @include transform(translate(-50%, 0));
    }
}

.swiper-slide {
    position: relative;
    min-height: r(500);
    .m-error {
        position: absolute;
        top: r(200);
        left: 50%;
        @include transform(translate(-50%, 0));
    }
}
</style>
