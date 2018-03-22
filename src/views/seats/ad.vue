
<template>
    <div class="ad-container" v-if="data && data.img">
         <lazy-image class="img" :src="data.img" init-src="/images/common/702x286.jpg"></lazy-image>
         <ad-compass :ad="data" v-if="data.contentID"/>
    </div>
</template>

<script>
    /**
     * 广告
     */
    import href from "common/plugin/href";
    import adCompass from "common/components/adCompass"

    export default {
        props: {
            image: {
                type: String
            },
            data: {
                type: Object
            }
        },
        data() {
            return {}
        },
        components: {
            adCompass
        }
    }
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";
.ad-container {
    padding-bottom: r(24);
    padding-top: r(24);
    // padding-left: r(30);
    // padding-right: r(30);
    height: r(144);
    text-align: center;

    >img {
        width: 100%;
        max-height: 100%;
    }
}
</style>
