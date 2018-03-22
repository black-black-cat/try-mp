<template>
    
</template>
<script>
import popup from 'lib/layer/popup'
import register from './Content.vue'
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
        data:Object,
        agreement: Object
    },
    data() {
        return {
            m_register : null,
        }
    },
    mounted () {
        const self = this;
        self.m_register = popup("<register @close='close' @suc='registerSuc'  :ajax-url='ajaxUrl' ref='register' :data='data' :agreement='agreement'/>", {
            option: {
                /*overlay: {
                    color:"#fff",
                    opacity:1,
                },*/
                absolute: true,
                animate: {
                    name: "slide-right"
                }
            },
            popup: {
                data () {
                    return {
                        ajaxUrl: self.ajaxUrl,
                        data: self.data,
                        agreement: self.agreement
                    }
                },
                components: {
                    register
                },
                methods: {
                    close () {                            
                        self.m_register.hide();                                            
                    },
                    registerSuc(){                        
                        bus.$emit(get("registerSuc"));  
                        self.m_register.hide();                          
                    }
                }
            }
        });
        self.m_register.setFullScreen(true, true);
        self.m_register.setPosition(0, 0, 0, 0);
        self.show && self.m_register.show();
        bus.$once(self.m_register.get("show"), self.m_register.popup.$refs.register.init);
        bind(self.m_register.get("hide"), self.changeShow);
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
                this.m_register.show();
            }else{
                this.m_register.hide();
            }
        },
        data(bool){
            this.data = bool;
            this.m_register.popup.$refs.register.initData(bool);
        }
    }
}
</script>

