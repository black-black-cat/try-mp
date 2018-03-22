<template>
    <div class="m-register-policy" >
        <div class="container " >
            <div class="title header">{{this.title}}<i class="icon-dialog-close" @click="close"></i></div>
            <div  class="content scrolling"  data-bind-scroll v-html="options.content"></div>
        </div>
    </div>
</template>
<script>
export default {
    props: ["options"],
    data() {
        return {
            title: this.options.title || ""
        }
    },    
    methods: {
        close: function() {
            this.$emit("close");
        }
    },
    beforeMount(){
        /*let vm = this;
        if(!vm.description){
            const policy = vm.options.content;
            let $html = "";
            policy.forEach((item,idx)=>{
                if(item){
                    $html += "<h3 class='title'>"+ item.key +"</h3><p>"+ item.description +"</p>";
                }
            });
            vm.description = $html;
        }*/
    },
    mounted() {
        

    }
}
</script>

<style lang="scss">
@import '../../../common/style/_mixin.scss';
.m-register-policy {
    height:100vh;
    width: 100vw;
    @include display-flex();
    @include justify-content(flex-end);
    @include flex-direction();
    .container{
        padding:rem(35px 0);        
        min-height: rem(500px);
        .title{
            font-size: rem(32px);
        }
        .header{
            text-align: center;
            margin-bottom: rem(50px);
            position: relative;
            .icon-dialog-close{
                position: absolute;
                right:rem(36px);
            }
        }
        .content{
            padding:rem(0 34px);
            font-size: rem(24px);
            max-height: rem(725px);
            word-break: break-all;
            p{
                line-height: rem(42px);
            }
            .title{
                font-size: rem(24px);
                line-height: rem(50px);
            }
        }
    }    
}

</style>
