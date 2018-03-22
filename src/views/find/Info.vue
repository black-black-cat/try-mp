<template>
<div class="info">
    <div class="ad-container" v-if="firstAD">
        <Card v-for="(ad, i) in ads" :key="i" :data="ad" :imgSrc="ad.img" :title="ad.title" :hrefs="hrefs" :exceptive="true"></Card>
    </div>
    <ul>
        <li class="info-item" v-for="(item, i) in listWithUrl" :key="item.id">
            <media-object :data="item"
            :url="item._url"
            :time="item.show_time"
            ></media-object>
        </li>
    </ul>
</div>
</template>

<script>
import MediaObject from "common/components/mediaObjectNews";
import Card from "./Card";
import query from "lib/json/query";
export default {
    props: {
        list: {
            type: Array,
            default() {
                return [];
            }
        },
        hrefs: {
            type: Object,
            default() {
                return {};
            }
        },
        firstAD: {
            type: Object
        },
        ads: {
            type: Array
        }
    },
    data() {
        return {
            urlArticle: this.hrefs.urlFind
        }
    },
    computed: {
        listWithUrl() {
            const vm = this;
            let ret = vm.list.map(function(item) {
                return Object.assign({}, item, {
                    _url: query.url(vm.urlArticle, {
                        id: item.id
                    })
                });
            });
            return ret;
        }
    },
    components: {
        MediaObject,
        Card
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";
.ad-container {
    @include clearfix();
}
.info {
    /*margin-bottom: r(120);*/
}
</style>
