<template>
    <div class="m-count scrolling" ref="container">
        <info-article :data="data.arrDiscovery"></info-article>
        <info-movie v-if="false"></info-movie>
        <info-info :options="options"></info-info>
        <info-comments :options="options" v-if="false"></info-comments>
        <!-- <info-category
        :apiNavData="options.href.apiTags"
        :apiContentData="options.href.apiDiscovery"
        ></info-category> -->
        <backto v-if="container" :listened="container" :homeUrl="urlIndex"></backto>
    </div>
</template>

<script>
import InfoArticle from "./Article";
import InfoMovie from "./Movie";
import InfoInfo from "./Info";
import InfoComments from "./Comments";
import InfoCategory from "./Category";
import backto from "common/plugin/backto";
export default {
    props: {
        options: {
            type: Object
        }
    },
    data() {
        return {
            data: this.options.data || {},
            container: null,
            urlIndex: this.options.href.urlIndex
        }
    },
    mounted() {
        this.container = this.$refs.container
    },
    components: {
        InfoArticle,
        InfoMovie,
        InfoInfo,
        InfoComments,
        InfoCategory,
        backto
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";
.m-count {
    /* @include display-flex();
    @include flex-direction(column); */
    height: 100%;
}
</style>

<style lang="scss">
@import "../../common/style/mixin";
html,
body {
    height: 100%;
}
</style>
