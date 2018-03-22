<template>
    <div class="movie">
        <div class="left">
            <lazy-image initSrc="/images/common/292x410.jpg"></lazy-image>
            <div class="btn-play">
                <i class="icon icon-play-white"></i>
            </div>
        </div>
        <div class="center">
            <div class="row-1">哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</div>
            <div class="row-2">
                <span class="badge">
                    <span>3D</span>
                    <span>IMAX</span>
                </span>
            </div>
            <div class="row-3">哈哈哈哈v哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</div>
            <div class="row-4">哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈</div>
        </div>
        <div class="right">
            <div class="row-1">
                哼哼哈哈ssyy
            </div>
            <div class="row-2">
                <div class="btn btn-ticket">呵呵</div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    props: {

    },
    components: {

    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";

.movie {
    @include display-flex();
    @include flex-shrink(0);
    box-sizing: border-box;
    width: 100%;
    margin: rem(24px auto);
    padding: rem(24px);

    .left {
        position: relative;
        @include wh(144px, 200px);

        >img {
            width: 100%;
            height: 100%;
        }
        .btn-play {
            position: absolute;
            left: 50%;
            top: 50%;
            @include transform(translate(-50%, -50%));
        }
    }
    .btn-play {
        @include display-flex();
        @include justify-content(center);
        @include align-items(center);
        @include wh(50px, 50px);
        @include radius(rem(50px));
        >.icon {

        }
    }

    .center {
        @include flex(1);
        padding: rem(0 18px);

        .row-1 {
            @include font-size(34px);
            line-height: r(44px);
            margin: rem(5px 0);
        }

        .row-2 {
            margin: rem(14px 0);
        }

        .row-3 {
            @include font-size(28px);
            line-height: r(35px);
            margin: rem(21px 0);
        }

        .row-4 {
            @include font-size(22px);
            line-height: r(28px);
        }
    }
    .badge {
        display: inline-block;
        @include display-flex();
        width: r(96);
        height: r(24);
        border-width: r(1);
        border-style: solid;
        @include radius(rem(20px));
        overflow: hidden;

        >span {
            display: inline-block;
            height: 100%;
            @include font-size(18px);
            line-height: r(24);
            text-align: center;

            &:nth-child(1) {
                width: r(35);
            }

            &:nth-child(2) {
                @include flex(1);
                @include radius(0 rem(12px) rem(12px) 0);
            }
        }
    }

    .right {
        // @include display-flex();
        // @include flex-direction(column);
        // @include justify-content(center);
        // @include align-items(center);
        padding-top: .75rem;
        width: r(128);
        .row-1 {
            margin-bottom: r(14);
            text-align: center;
        }

        .row-2 {

        }
    }
    .btn-ticket {
        padding: 0.5em 1em;
        text-align: center;
        @include font-size(29px);
        border-radius: 2em;
    }
}
</style>
