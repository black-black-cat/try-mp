<template>
    <swiper :options="swiperOption">
        <swiper-slide v-for="(item, index) in content.cards" :key="index">
            <member-card @qrcode="showQrCode" @show="showMore" :option="item" :content="content" :cardSkin="'member-card-'+(item.color+1)"/></swiper-slide>
        <swiper-slide v-if="isSupport('bind') || isSupport('Register')">
            <member-card type="2" :content="content" />
        </swiper-slide>
        <swiper-slide v-if="content.cinemaMode == 3">
            <member-card type="2" :content="content" />
        </swiper-slide>
    </swiper>
</template>
<script>
    import { swiper, swiperSlide } from 'common/plugin/swiper'
    import memberCard from './memberCard.vue'
    import popup from 'lib/layer/popup'
    import More from './More.vue'
    import QrCode from './QrCode.vue'
    import {array, object} from 'common/utils/defaultProps'

    export default {
        props: {
            content: object
        },
        data () {
            return {
                swiperOption: {
                    pagination: '.swiper-pagination',
                    slidesPerView: 'auto',
                    centeredSlides: true
                },
                m_more: null,
                m_qrCode: null,
            }
        },
        mounted () {
            const self = this;
            self.m_more = popup("<More @close='close' :option='option' :href='href' :card-config='cardConfig' :cinema-mode='cinemaMode'/>", {
                option: {
                    autoHide: true,
                    animate: {
                        name: "slide-bottom"
                    }
                },
                popup: {
                    data () {
                        return {
                            href: self.content.href,
                            option: {},
                            cardConfig: null,
                            cinemaMode: null
                        }
                    },
                    components: {
                        More
                    },
                    methods: {
                        close () {
                            self.m_more.hide();
                        }
                    }
                }
            });
            this.m_more.setPosition(0, "auto", "auto", 0);

            self.m_qrCode = popup("<qr-code @close='close' :option='option'/>", {
                option: {
                    autoHide: true,
                    animate: {
                        name: "slide-bottom"
                    }
                },
                popup: {
                    data () {
                        return {
                            href: self.href,
                            option: {}
                        }
                    },
                    components: {
                        QrCode
                    },
                    methods: {
                        close () {
                            self.m_qrCode.hide();
                        }
                    }
                }
            });
            this.m_qrCode.setPosition(0, "auto", "auto", 0);
        },
        methods: {
            showMore (item) {
                this.m_more.popup.option = item;
                this.m_more.popup.cardConfig = this.content.cardConfig;
                this.m_more.popup.cinemaMode = this.content.cinemaMode;
                this.m_more.show();
            },
            showQrCode (item) {
                this.m_qrCode.popup.option = item;
                this.m_qrCode.show();
            },
            isSupport(key) {
                key = key[0].toUpperCase() + key.slice(1);
                const vm = this;
                let mode = vm.content.cinemaMode;
                let support = vm.content.cardConfig;
                return mode != 3 && support["isSupport" + key]
            }
        },
        components: {
            swiper,
            swiperSlide,
            memberCard
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../common/style/mixin";
    .swiper-container{
        @include width(100%);
        padding: rem(50px 0);
    }
    .swiper-slide{
        @include wh(546px, 346px);
        margin: rem(0 30px);
        @include opacity(50);
        @include transition(all 0.3s ease);
    }
    .swiper-slide-active{
        @include opacity(100);
    }
</style>