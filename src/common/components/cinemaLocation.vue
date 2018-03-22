<template>
    <div class="m-cinema-location">
        <div class="display" @click="showCinema">
            <div class="display-row-1">{{name}}</div>
            <div class="display-row-2">地址：{{address}}</div>
        </div>
        <div class="select" v-if="canSelect" @click="changeCinema">
            <div class="select-row-1">
                <i class="icon-location-1"></i>
            </div>
            <div class="select-row-2">更换</div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        name: {
            type: String,
            default: "nuknown"
        },
        address: {
            type: String,
            default: "nuknown"
        },
        canSelect: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {

        }
    },
    components: {

    },
    methods: {
        showCinema () {
            this.$emit("show");
        },
        changeCinema () {
            this.$emit("change");
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../style/mixin";
.m-cinema-location {
    @include display-flex();
    @include align-items(center);
    min-height: r(148);
    padding: rem(24px 0 24px 24px);
    margin-bottom: r(24);
    @include box-sizing(border-box);

    .display {
        @include flex(1);
        line-height: 1.2;

        &-row-1 {
            font-size: r(32);
            margin-bottom: r(28);
        }
        &-row-2 {
            font-size: r(24);
        }
    }

    .select {
        width: r(136);
        text-align: center;
        border-left-width: r(1);
        border-left-style: solid;

        &-row-2 {
            margin-top: r(14);
        }
    }
}
</style>
