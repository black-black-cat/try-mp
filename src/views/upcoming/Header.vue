<template>
    <swiper class="m-index-banner" :options="swiperOption" ref="swiper" v-if="images.length > 0">
        <swiper-slide v-for="(item, index) in images" :key="index"><lazy-image v-href="item.url" :src="item.img" init-src="/images/common/750x312.jpg"/></swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
</template>
<script>
    import { swiper, swiperSlide } from 'common/plugin/swiper'

    export default {
        props: {
            images: {
                type: Array,
                default () {
                    return []
                }
            }
        },
        data () {
            return {
                swiperOption: {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    autoplay: 3000
                }
            }
        },
        components: {
            swiper,
            swiperSlide
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../common/style/mixin";
    @import "../../common/style/variable";
    .swiper-container{
        @include wh(100%, 312px);
        img{
            width: 100%;
            height: 100%;
        }
    }
</style>