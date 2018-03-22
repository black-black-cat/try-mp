<template>
    <div class="m-guide-view">
        <swiper :options="swiperOption" ref="swiper" v-if="images.length > 0">
            <swiper-slide v-for="(item, index) in images" :key="index">
                <div class="img-wrapper" @click="toIndex(index)">
                    <lazy-image :src="item" init-src="/images/common/750x312.jpg"/>
                </div>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'common/plugin/swiper'
import query from 'lib/json/query'
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"

export default {
    props: ["options"],
    components: {
        swiper,
        swiperSlide
    },    
    data () {
        return {
            swiperOption: {
                pagination: '.swiper-pagination',
                paginationClickable: false,
                autoplay: 3000,
                effect : 'fade',
            },
            images: this.options.data.images,
            urlIdex: this.options.href.urlIdex
        }
    },
    mounted () {
        
    },
    methods: {
        toIndex(index){
            if(index != this.images.length-1) return;
            webBridge.openUrl(this.urlIdex,"self");
        }
    }
}

</script>

<style lang="scss">
    @import '../../common/style/mixin';
    .m-guide-view{
        height:100vh;
    }
</style>
