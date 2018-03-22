<template>
</template>
<script>
import popup from 'lib/layer/popup'
import findPwd from './Content.vue'
import {bind, bus, get} from 'lib/comp/bus'
import dialogManager from 'common/plugin/dialog'
import query from 'lib/json/query'
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"

export default {
    props: {
        show: Boolean,
        ajaxUrl: {
            type: String
        },
        data: Object
    },
    data() {
        return {
            m_findPwd : null, 
        }        
    },
    mounted () {
        const self = this;
        self.m_findPwd = popup("<find-pwd @close='close' @suc='findPwdSuc' :ajax-url='ajaxUrl' ref='pwd'/>", {
            option: {
                /*overlay: {
                    color:"#fff",
                    opacity:1,
                },*/
                animate: {
                    name: "slide-right"
                }
            },
            popup: {
                data () {
                    return {
                        ajaxUrl: self.ajaxUrl,
                    }
                },
                components: {
                    findPwd
                },
                methods: {
                    close () {                            
                        self.m_findPwd.hide();                                            
                    },
                    findPwdSuc(){
                        this.$emit("findPwdSuc");  
                        self.m_findPwd.hide();                            
                    },
                }
            }
        });
        self.m_findPwd.setFullScreen(true, true);
        self.m_findPwd.setPosition(0, 0, 0, 0);
        self.show && self.m_findPwd.show();
        bind(self.m_findPwd.get("hide"), self.changeShow);
    },
    methods: {
        changeShow () {
            this.$emit('update:show', false);
            //父模块绑定 :show.sync=""
        }
    },
    watch: {
        show (bool) {
            if(bool) {
                this.m_findPwd.show();
            }else{
                this.m_findPwd.hide();
            }
        },
        data(bool){
            this.data = bool;
            this.m_findPwd.popup.$refs.pwd.initData(bool);
        }
    }
}
</script>

