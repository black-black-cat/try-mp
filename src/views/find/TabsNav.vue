<template>
    <div class="nav">
        <div class="nav-list">
            <div v-for="item in content"
            :class="{'nav-item': true, 'active': item.active}"
            :key="item.nav" :data-index="item.index" @click="onItemClicked(item.index)">{{item.nav}}</div>

            <div class="nav-indicator" :style="{left: indicatorLeft
                , width: indicatorWidth}">
                <span></span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        content: {
            type: Array,
            default() {
                return []
            }
        }
    },
    data() {

    },
    computed: {
        activeIndex() {
            let filtered = this.content.filter(function(item, i) {
                return item.active;
            });
            if (filtered.length) {
                return filtered[0].index;
            } else {
                return 0;
            }
        },
        indicatorLeft() {
            const vm = this;
            let size = vm.content.length;
            return vm.activeIndex / size * 100 + "%";
        },
        indicatorWidth() {
            const vm = this;
            let size = vm.content.length;
            return 1 / size * 100 + "%";
        }
    },
    methods: {
        onItemClicked(index) {
            this.$emit("onItemClicked", {
                index
            });
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";

.nav {
    position: relative;
    padding: rem(20px 75px 0);
    text-align: center;
    font-size: r(32);

    position: relative;
    &:before {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 3;
        width: 100%;
        height: r(6);
        @include transform(translate(0, 100%));
    }

    &-list {
        position: relative;
    }

    &-item {
        display: inline-block;
        width: 50%;
        height: r(88);
        line-height: r(88);
    }

    &-indicator {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 50%;
        @include transition-duration(0.3s);
        >span {
            display: block;
            margin: auto;
            height: r(3);
            width: 2.5em;
        }
    }
}
</style>