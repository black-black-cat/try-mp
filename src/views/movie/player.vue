<template>
    <div class="container player" v-if="active" @touchmove="prevent" ref="container">
        <div class="close-btn" @click="hidePlayer">
            <i class="icon-dialog-close"></i>
        </div>
        <video class="video"
            controls
            :autoplay="video.autoplay"
            preload="auto"
            x-webkit-airplay="allow"
            x5-video-player-type="h5"
            :src="video.src"
            :poster="video.poster"
            @touchmove="prevent"

        >
        </video>
    </div>
</template>

<script>
import {object, boolean} from "common/utils/defaultProps";

export default {
    props: {
        active: boolean(false),
        video: object
    },
    data() {
        return {
            memo: document.documentElement.scrollTop || document.body.scrollTop
        }
    },
    watch: {
        active(newVal) {
            const vm = this;
            if (!vm.box) {
                vm.box = document.querySelector(".m-count");
            }
            if (!newVal) {
                vm.box.style.removeProperty("position");
                vm.box.style.removeProperty("top");
                document.documentElement.scrollTop = vm.memo;
                document.body.scrollTop = vm.memo;
                return;
            }

            vm.memo = document.documentElement.scrollTop || document.body.scrollTop
            vm.box.style.position = "fixed";
            vm.box.style.top = (-vm.memo) + "px";


            vm.$nextTick(() => {
                // vm.$refs.container.style.top = (document.documentElement.scrollTop || document.body.scrollTop) + "px";
                vm.$refs.container.style.top = 0 + "px";
            })
        }
    },

    methods: {
        hidePlayer() {
            this.$emit("hide", false);
        },
        prevent(ev) {
            console.log("touchmove")
            ev.preventDefault();
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/_mixin";
.container {
    position: fixed;
    z-index: 11;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    @include display-flex();
    @include flex-direction(column);
    @include justify-content(center);
}
.close-btn {
    position: absolute;
    z-index: 1;
    top: r(50);
    right: r(30);
}
.video {
    width: 100%;
    max-height: 100vmin;
}
</style>
