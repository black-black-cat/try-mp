<template>
    <div class="media">
        <div class="left">
            <lazy-image src="/images/common/img2.png"></lazy-image>
        </div>
        <div class="right">
            <div class="row">哈哈哈哈哈哈哈哈哈哈哈</div>
            <div class="section">
                <div class="section-row">
                    <span>我评：</span>
                    <div class="star-rating"><star-rating :rating="rating"></star-rating></div>
                    <span>3.0分</span>
                </div>
                <div class="section-content">
                    {{shortReviewContent && !isTextExpanded ? shortReviewContent : reviewContent}}
                </div>
                <div class="section-control" v-if="shortReviewContent" @click="toggleExpand">
                        <div :class="{'arrow-right': true, 'active': isTextExpanded}"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import starRating from "common/plugin/starRating/starRating";

export default {
    props: {
        rating: {
            type: Number,
            default: 3
        }
    },
    data() {
        return {
            isTextExpanded: false,
            charLimit: 55,
            reviewContent: "哈".repeat(88)
        }

    },
    computed: {
        shortReviewContent() {
            const vm = this;
            if (vm.reviewContent.length > vm.charLimit) {
                return this.reviewContent.slice(0, vm.charLimit) + "...";
            }
            return false
        },
        shorted() {
            return this.reviewContent.length > this.shortReviewContent.length - 3
        }
    },
    components: {
        starRating
    },
    methods: {
        toggleExpand() {
            const vm = this;
            vm.isTextExpanded = !vm.isTextExpanded;
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";

.media {
    padding: r(30) r(24) r(26) 0;
    margin-left: r(24);
    border-bottom-width: r(1);
    border-bottom-style: solid;

    @include display-flex();

    .left {
        width: r(142);
        margin-right: r(20);
        @include radius(rem(10px));
        text-align: center;

        >img {
            width: 100%;
            @include radius(rem(10px));
        }
    }

    .right {
        @include flex(1);
        >.row {
            min-height: r(34);
            padding-top: r(10);
            padding-bottom: r(10);
            font-size: r(34);
        }
        .section {
            margin-top: r(22);
            @include radius(rem(10px));
            padding-left: r(24);
            padding-right: r(24);
            padding-bottom: r(18);

            .section-row {
                @include display-flex();
                @include justify-content(flex-start);
                @include align-items(center);
                padding-top: r(20);
                padding-bottom: r(16);
                font-size: r(28);
            }
            .section-content {
                font-size: r(24);
                line-height: r(38);
            }
            .section-control {
                text-align: center;
                padding-top: r(10);
            }
            .arrow-right {
                display: inline-block;
                @include arrow-right();
                @include transform(rotate(90deg));
                @include transition-duration(0.3s);

                &.active {
                    @include transform(rotate(270deg));
                }
            }
            .star-rating {
                @include transform(scale(0.6));
                margin-left: r(-40);
                margin-right: r(-40);
                margin-top: r(4);
            }
        }
    }
}
</style>
