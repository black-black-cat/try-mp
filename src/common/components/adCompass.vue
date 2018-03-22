<template>
	<lazy-image class="hide" :src="src" init-src="/images/common/750x312.jpg"/>
</template>
<script>
    export default {
        props: {
            ad: Object
        },
        data () {
            return {
                
            }
        },
        computed: {
            src(){
                if(!this.ad) return "";
                return `${this.ad.statImgUrl || ""}?position_no=${this.ad.positionNO || ""}&adid=${this.ad.contentID || ""}&tenantKey=${this.ad.tenantKey || ""}`
            }
        }
    }
</script>