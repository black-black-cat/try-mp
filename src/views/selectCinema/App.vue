<template>
    <app-cinema ref="cinema" :iphone-x="iphoneX" :url="url" :close-show="closeShow" @close="close"></app-cinema>
</template>

<script>
import appCinema from 'common/plugin/selectCinema/content.vue'
import query from 'lib/json/query'
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"

export default {
    props: ["options"],
    components: {
        appCinema
    },
    data () {
        return {
            url: this.options.href.apiCinemalist,
            closeShow: false,
            iphoneX:"selectCinema"
        }
    },
    mounted () {
        setTimeout(this.$refs.cinema.initShow, 0);
    },
    methods: {
        close (opt){
            const data = opt.data;
            let url = query.url(opt.url, {
                url: this.options.data.callbackUrl,
                a: data.area_code,
                ci: data.cinema_code
            })
            if(browser.WX){
                location.assign(url);
            }else{
                webBridge.openUrl(url,"self");
            }  
        }
    }
}

</script>

<style lang="scss">
    @import '../../common/style/mixin';
    .m-select-cinema{
        position: fixed !important;
    }
</style>
