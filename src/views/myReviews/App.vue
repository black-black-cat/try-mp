<template>
<div class="m-count scrolling">
    <media-object v-for="item in Array(9)" :key="item"></media-object>
    </div>
</template>

<script>
import mediaObject from "./mediaObject";

    export default {
        props: {

        },
        components: {
            mediaObject
        }
    }
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";


</style>

<style lang="scss">
html,body {
    height: 100%;
    overflow: hidden;
}
</style>

