<template>
<img :src="initSrc != '' ? initSrc : 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAABBJREFUeNpi/v//PwNAgAEACQsDAUdpTjcAAAAASUVORK5CYII='"/>
</template>
<script>
    const string = {type: String, default: ""};
    export default {
        props: {
            src: string,
            initSrc: string,
            errorSrc: string,
            scale: string,
            autoDestroy: {//是否自动销毁
                type: String,
                default: "yes"//|no
            }
        },
        data () {
            return {
                img: null,
                cdn: ""//http://php.sztest.mopon.cn/dyh5/web
            }
        },
        mounted () {
            this.loadImage();
        },
        watch: {
            src () {
                this.loadImage();
            }
        },
        methods: {
            cdnUrl (src) {
                if(!/^(\/images\/common)/.test(src)) return src;
                return this.cdn + src;
            },
            setSrc (src) {
                this.$el.src = this.cdnUrl(src);
                this.$emit("load", src);
            },
            setPos () {
                if(!/^\d+\.?\d*$/.test(this.scale)) return;
                if(this.img.width / this.img.height > this.scale){
                    this.$el.style.width = "auto";
                    this.$el.style.height = "100%";
                }else{
                    this.$el.style.width = "100%";
                    this.$el.style.height = "auto";
                }
            },
            loadImage () {
                if(this.src === ""){
                    this.err();
                    return;
                }
                this.img = new Image();
                this.img.src = this.src;
                if (this.img.complete) {
                    this.suc();
                } else {
                    this.img.onload = this.suc;
                    this.img.onerror = this.err;
                }
            },
            suc () {
                this.setSrc(this.src);
                this.setPos();
                this.$emit("suc", {src: this.src, width: this.img.width, height: this.img.height});
                this.destroy();
            },
            err () {
                if(this.errorSrc !== ""){
                    this.setSrc(this.errorSrc);
                }
                this.$emit("err", {src: this.src});
                this.destroy();
            },
            destroy () {
                if(this.autoDestroy === "no") return;
                this.img = null;
                this.$destroy();
            }
        }
    }
</script>