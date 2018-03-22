<template>
    <div class="info-article" ref="article">
        <div class="section-1">{{data.title}}
        </div>
        <div class="section-2">
            <div class="col-1">{{data.ui_source}} {{data.showtime}}</div>
            <div class="col-2" v-if="false">xxxx</div>
            <div class="col-3" v-if="data.tag_title">
                <div class="badge">
                    {{data.tag_title}}
                </div>
            </div>
        </div>
        <div class="section-3" v-if="data.coverimg">
            <lazy-image :src="data.coverimg" initSrc="/images/common/702x286.jpg"></lazy-image>
        </div>
        <div class="section-4" :class="{expanded: isContentExpanded, short: isShortArticle}" ref="contentWrapper">
            <p ref="contentInner" v-html="data.content">

            </p>
            <p>作者：{{data.author}}</p>
        </div>
        <div class="section-5" v-if="!isShortArticle">
            <div class="switch" @click="toggleContent">
                <span>{{isContentExpanded ? "收起" : "全文"}}</span>
                <i class="arrow" :class="{'arrow-down': !isContentExpanded,'arrow-up': isContentExpanded}"></i>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    data() {
        return {
            isContentExpanded: false,
            isShortArticle: true,
            windowHeight: window.innerHeight
        }
    },
    computed: {
        // isShortArticle() {
        //     const vm = this;
        //     // return vm.$refs.contentInner.offsetHeight < vm.$refs.contentWrapper.offsetHeight
        //     return vm.$refs.article.offsetHeight < 3 * vm.windowHeight
        // }
    },
    mounted() {
        const vm = this;
        vm.isShortArticle = vm.$refs.article.offsetHeight < 3 * vm.windowHeight;
    },
    components: {

    },
    methods: {
        toggleContent() {
            this.isContentExpanded = !this.isContentExpanded;
        },
        pxToRem(num) {
            let w = window.innerWidth;
            return w / 750 * num;
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";
.info-article {
    padding: rem(24px 24px 30px);
    @include transition-duration(0.3s);

    .section-1 {
        @include font-size(36px);
    }
    .section-2 {
        @include display-flex();
        @include justify-content(space-between);
        @include align-items(center);
        @include font-size(24px);
        margin: rem(24px auto);

        .col-1 {}
        .col-2 {
            @include flex(1);
            margin-left: 1.5em;
        }

        .badge {
            padding: rem(0 16px);
            @include radius(rem(5px));
            @include font-size(20px);
            @include box-sizing(border-box);
            line-height: r(34);
        }
    }
    .section-3 {
        margin: rem(24px auto);
        text-align: center;
        >img {
            width: r(702);
        }
    }
    .section-4 {
        // height: r(290);
        height: 200vh;
        @include font-size(28px);
        line-height: 1.5;
        overflow: hidden;
        @include transition-duration(0.3s);

        >p {
            @include font-size(28px);
            line-height: r(48);
        }

        &.expanded {
            height: auto;
        }

        &.short {
            height: auto;
        }
    }

    .section-5 {

        margin: rem(30px auto 5px);
        text-align: center;

        .switch {
            display: inline-block;
            @include box-sizing(border-box);
            width: r(214);
            height: r(60);
            border-width: r(2);
            border-style: solid;
            @include radius(rem(30px));
            @include font-size(28px);
            line-height: r(60);

            >span {
                margin-right: r(10)
            }
        }

        .arrow {
            @include arrow-right;
            @include transition-duration(0.4s);
            vertical-align: middle;

            &-down {
                @include transform(rotate(90deg));
            }

            &-up {
                @include transform-origin(0 50%);
                @include transform(rotate(-90deg));
            }
        }
    }
}
</style>

<style lang="scss">
@import "../../common/style/mixin";
.section-4 {
    >p {
        img {
            max-width: 100%;
            margin: rem(24px auto);
        }
    }
}
</style>

