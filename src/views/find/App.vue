<template>
    <div class="m-count">
        <tabs :data="options.data"
        :options="options"
        ></tabs>
        <app-nav-items v-if="options.bottomNavItems">
            <app-item icon="home" :href="options.bottomNavItems[0]" name="推荐"></app-item>
            <app-item icon="find" selected="true" name="发现"></app-item>
            <app-item icon="store" :href="options.bottomNavItems[2]" name="商城"></app-item>
            <app-item icon="me" :href="options.bottomNavItems[3]" name="我的" :is-login="options.data.is_login" :ajax-url="options.href"></app-item>
        </app-nav-items>
    </div>
</template>

<script>
import Tabs from "./Tabs";
export default {
    props: ["options"],
    data(){
        return {
        }
    },
    methods:{
        
    },
    components: {
        Tabs
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";
.m-count {
    @include display-flex();
    @include flex-direction(column);
    height: 100%;
    overflow: hidden;
}
</style>

<style lang="scss">
@import "../../common/style/mixin";
html,
body {
    height: 100%;
}
</style>
