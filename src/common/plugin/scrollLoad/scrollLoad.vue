<template>
    <transition name="fade" @after-leave="afterLeave">
        <div class="m-scroll-loading" v-if="loading">
            <div class="ani-loading vh-center"><span class="ani-1"></span><span class="ani-2"></span><span class="ani-3"></span></div>
            <div class="text">{{ text }}</div>
        </div>
    </transition>
</template>
<script>
    import debounce from 'lib/util/debounce'
    import getScrollNode from 'common/utils/getScrollNode'
    import delay from 'lib/util/delay'
    import transform from 'common/utils/transform'

    export default {
        props: {
            delta: {
                type: Number,
                default: 0
            },
            defer: {
                type: String,
                default: "yes"
            },
            loading: {
                type: Boolean,
                default: false
            },
            text: {
                type: String,
                default: "正在拼命加载"
            },
            node: null
        },
        data () {
            return {
                bindNode: null,
                lastScrollTop: 0,
                result: false,
                debounced: null,
                delay: null,
                startResolve: null,
                scrollNode: null
            }
        },
        mounted () {
            this.debounced = debounce(this.scroll, 20);
            this.delay = delay(this.animate, 10);
        },
        watch: {
            node (node) {
                this.bindNode = getScrollNode(node);
                this.scrollNode = this.bindNode === window ? document.body : this.bindNode;
                this.bind();
            },
            loading (bool) {
                if(bool){
                    this.unbind();
                    this.startResolve && this.startResolve();
                }
            }
        },
        methods: {
            pos () {
                const clientHeight = this.scrollNode === document.body ? document.documentElement.clientHeight : this.scrollNode.clientHeight;
                const scrollTop = this.scrollNode.scrollTop;
                const top = this.scrollNode.scrollHeight - clientHeight;
                return {height: clientHeight, scrollTop: scrollTop, top: top};
            },
            animate () {
                const pos = this.pos();
                const mod = pos.top - pos.scrollTop - this.delta;
                if(mod <= 0 && mod >= -30){
                    this.delay.cancel();
                    new Promise(resolve => {
                        this.startResolve = resolve;
                        this.$emit("load", {top: pos.scrollTop});
                    }).then(() => {
                        if(this.node !== document.body){
                            this.scrollNode.scrollTop = pos.top;
                            this.node.style.cssText = transform(300, 0, -50, true);
                            this.startResolve = null;
                        }
                    });
                }else if(pos.top - pos.scrollTop > 0){
                    this.delay.cancel();
                    this.result = false;
                }
            },
            afterLeave () {
                const pos = this.pos();
                const bool = pos.top - pos.scrollTop <= 100;
                const isDefer = this.defer === "yes";
                if(isDefer && this.node !== document.body){
                    this.node.style.cssText = transform(bool ? 300 : 0, 0, 0, true);
                }
                if(bool){
                    delay((p) => {
                        this.scrollNode.scrollTop = pos.scrollTop - p * 15;
                        if(p === 1) this.bind();
                    }, 300).ani(true);
                }else{
                    isDefer && (this.scrollNode.scrollTop = pos.scrollTop + 50);
                    this.delay.append(() => {
                        this.bind();
                    }, 300);
                }

            },
            bind () {
                this.bindNode.addEventListener("scroll", this.debounced);
            },
            unbind () {
                this.bindNode.removeEventListener("scroll", this.debounced);
                this.result = false;
            },
            scroll () {
                const pos = this.pos();
                if (!this.result && pos.scrollTop > this.lastScrollTop && (pos.top - pos.scrollTop) <= this.delta) {
                    this.result = true;
                    if(this.defer === "yes"){
                        this.delay.run();
                    }else{
                        this.$emit("load", {top: pos.scrollTop});
                    }
                }
                this.lastScrollTop = pos.scrollTop;
            },
            destroy () {
                this.unbind();
                this.bindNode = null;
                this.$destroy();
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../../common/style/mixin";
    .m-scroll-loading{
        @include display-flex;
        @include flex-wrap(wrap);
        @include align-content(space-between);
        @include justify-content(center);
        @include wh(200px, 70px);
        margin: 0 auto;
        .ani-loading{
            .ani-1,.ani-2,.ani-3{
                @include wh(26px);
                @include radius(100%);
                margin: rem(0 26px);
                @include animation-name(aniScaleLoading);
                @include animation-iteration-count(infinite);
                @include animation-duration(1s);
                @include animation-timing-function(linear);
            }
            .ani-2{
                @include animation-delay(0.2s);
            }
            .ani-3{
                @include animation-delay(0.4s);
            }
        }
        .text{
            text-align: center;
            @include font-size(24px);
        }
    }

    .fade-enter-active{
        transition: all .3s linear;
    }
    .fade-leave-active{
        transition: all .05s linear;
     }
    .fade-enter {
        @include translateY(100%);
    }
    .fade-leave-to{
        @include opacity(0);
    }

    @include keyframes(aniScaleLoading){
        0%,50%,100%{
            @include scale(1);
        }
        25%{
            @include scale(1.5);
        }
    }
</style>