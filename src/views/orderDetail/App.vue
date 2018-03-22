<template>
    <div class="scrolling m-views-orderDetail">
        <app-content :options="options.data"></app-content>
    </div>
</template>

<script>
import appContent from './Content.vue'

export default {
    props: ["options", "proxy"],
    components: {
        appContent
    }
}

</script>

<style lang="scss">
    @import '../../common/style/mixin';
</style>
