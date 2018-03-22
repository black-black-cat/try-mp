<template>
    <find-pwd ref="findPwd" :ajax-url='ajaxUrl' :agreement="agreement" :hide="hideClose" @suc="suc" @close="close"></find-pwd>
</template>

<script>
import findPwd from 'common/plugin/findPwd/Content.vue'
import query from 'lib/json/query'
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"

export default {
    props: ["options"],
    components: {
        findPwd
    },
    data () {
        return {
            ajaxUrl: this.options.href,
            agreement: this.options.data.agreement,
            hideClose: 1
        }
    },
    mounted () {
        
    },
    methods: {
        close (){
            if(browser.WX){
                history.go(-1);
            }else{
                webBridge.close();
            } 
        },
        suc(){
            if(browser.WX){
                history.go(-1);
            }else{
                webBridge.close(4);
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
