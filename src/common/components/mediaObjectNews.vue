<template>
    <div class="m-media-object-news" @click="goArticle"  v-href="data.href">
        <div class="mo-left">
            <lazy-image :src="data.coverimg" initSrc="/images/common/192x144.jpg"></lazy-image>
        </div>
        <div class="mo-right">
            <div class="row-1">{{data.title}}</div>
            <div class="row-last">
                <div class="row-last-left">{{time || data.show_time}}</div>
                <!--  -->
                <div class="row-last-right" v-if="comments">
                    <i class="icon-eye"></i>
                    <span>333</span>
                    <i class="icon-msg"></i>
                    <span>333</span>
                </div>
                <!-- 显示分类标签 -->
                <div class="row-last-right" v-else>
                    <div class="badge">{{data.tag_title}}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import openUrl from "common/utils/openUrl";

export default {
    props: {
        time: {
            type: String,
            default: ""
        },
        data: {
            type: Object
        },
        url: {
            type: String,
            default: ""
        }
    },
    components: {

    },
    methods: {
        goArticle() {
            const vm = this;
            if (!vm.url) {
                return;
            }
            openUrl(vm.url);
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../style/mixin";

.m-media-object-news {
    @include display-flex();
    @include justify-content(center);
    @include align-items(center);
    margin-left: r(24);
    padding: r(34) 0;
    padding-right: r(24);
    border-bottom-width: r(1);
    border-bottom-style: solid;

    .mo-left {
        overflow: hidden;
        position: relative;
        @include wh(190, 144);
        margin-right: r(24);
        text-align: center;
        @include radius(rem(10px));
        >img {
            width: 100%;
            @include transform(translate(0, -50%));
            position: absolute;
            top: 50%;
            left: 0;
            // height: 100%;
            // border-radius: r(10);
        }
    }

    .mo-right {
        @include flex(1);
        @include display-flex();
        @include flex-direction(column);
        @include justify-content(space-between);
        height: r(150);
        .row-1 {
            width: 100%;
            @include line-clamp(2);
            @include font-size(28px);
        }
        .row-last {
            @include display-flex();
            @include justify-content(space-between);
            @include align-items(center);
            @include font-size(24px);
            &-right {
                @include display-flex();
                @include justify-content(space-between);
                @include align-items(center);
                text-align: right;

                .badge {
                    padding: rem(0 16px);
                    @include radius(rem(5px));
                    @include font-size(20px);
                    @include box-sizing(border-box);
                    line-height: r(34);
                }
            }
        }
    }
}
</style>
