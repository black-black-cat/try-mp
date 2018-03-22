<template>
    <app-content :options="options"/>
</template>

<script>
import appContent from './Content.vue'
import query from 'lib/json/query'
import browser from "lib/util/browser"
import webBridge from "common/utils/webBridge"

export default {
    props: ["options"],
    components: {
        appContent
    },
    data () {
        return {
            
        }
    },
    mounted () {
        
    },
    methods: {
        
    }
}

</script>

