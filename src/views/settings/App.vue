<template>
    <app-content :options="options"/>
</template>

<script>
import appContent from './Content.vue'
import query from 'lib/json/query'

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

