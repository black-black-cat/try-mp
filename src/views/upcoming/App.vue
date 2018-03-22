<template>
    <div class="m-count m-views-upcoming">
        <ul class="m-upcoming-tab fixed-top" v-if="show">
            <li class="item" v-href="options.href.urlHot" data-target="self">正在热映</li>
            <li class="item selected">即将上映</li>
            <li class="item vh-center hide"><span>票房榜</span><i class="arrow-right"></i></li>
        </ul>
        <div class="scrolling">
            <app-header :images="options.bannerImage"></app-header>
            <app-content :href="options.href" :image="image"></app-content>
        </div>
        <app-nav-items v-if="options.bottomNavItems">
            <app-item icon="home" selected="true" name="推荐"></app-item>
            <app-item icon="find" :href="options.bottomNavItems[1]" name="发现"></app-item>
            <app-item icon="store" :href="options.bottomNavItems[2]" name="商城"></app-item>
            <app-item icon="me" :href="options.bottomNavItems[3]" name="我的" :is-login="options.data.is_login" :ajax-url="options.href"></app-item>
        </app-nav-items>
    </div>
</template>

<script>
import appHeader from 'common/components/promotionSlides'
import appContent from './Content.vue'
import viewport from 'lib/comp/viewport'

export default {
    props: ["options", "proxy"],
    components: {
        appHeader,
        appContent
    },
    data () {
        return {
            image: this.options.bannerImage && this.options.bannerImage.length > 0,
            show: false,
            height: 312,
        }
    },
    mounted () {
        this.image && window.addEventListener("scroll", this.scroll);
        this.height = viewport.rem() / 75 * this.height;
        this.show = !this.image;
    },
    methods: {
        scroll () {
            this.show = window.scrollY > this.height;
        }
    }
}

</script>

<style lang="scss">
    @import '../../common/style/mixin';
    .m-upcoming-tab{
        @include display-flex;
        @include justify-content(space-around);
        @include align-items(center);
        @include height(100px);
        padding: rem(20px 20px 0);
        width: 100%;
        @include box-sizing;
        &.fixed-top{
            position: fixed;
            top: 0;
            left: 0;
            z-index: 12;
        }
        .item{
            @include font-size(28px);
            width: 100%;
            text-align: center;
            .arrow-right{
                @include arrow-right;
                margin: rem(3px -10px 0 10px);
            }
        }
        .selected{
            position: relative;
            &:before{
                content: "";
                position: absolute;
                @include wh(54px, 4px);
                bottom: rem(-24px);
                left: 50%;
                margin-left: rem(-27px);
            }
        }
    }
</style>
