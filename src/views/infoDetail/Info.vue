<template>
    <div class="info" v-if="infos.length && filmCode">
        <div class="header">
            <div class="title">相关影讯</div>
            <div
                class="more"
                v-if="isMore"
                v-href="hrefs.urlMorediscoverys"
                :data-query="'film_code=' + filmCode"
            >更多
                <i class="arrow-right"></i>
            </div>
        </div>
        <news-item :data="item" v-for="(item, index) in infos" :key="index" :url="item.href"></news-item>
    </div>
</template>

<script>
import NewsItem from "common/components/mediaObjectNews"
import URL from "../../lib/util/URL"
import query from "../../lib/json/query"
export default {
    props: {
        options: null
    },
    data() {
        const vm = this;
        return {
            hrefs: vm.options.href,
            tagID: vm.options.data.arrDiscovery.tag_id,
            filmCode: vm.options.data.arrDiscovery.film_code,
            articleID: vm.options.data.arrDiscovery.id,
            infos: [],
            infosNoSliced: [],
        }
    },
    computed: {
        apiRelativeInfo() {
            return this.hrefs.apiDiscovery
        },
        isMore() {
            return this.infosNoSliced.length > 3
        },
        filmCode() {
            return this.options.data.arrDiscovery.film_code || ""
        }
    },
    mounted() {
        this.getRelativeInfo();
    },
    components: {
        NewsItem
    },
    methods: {
        getRelativeInfo() {
            const vm = this;
            vm.$http.post(vm.apiRelativeInfo, {
                film_code: vm.filmCode
            }).then(res => {
                let data = res.data || [];
                vm.infosNoSliced = data;
                data = data.filter(item => item.id != vm.articleID);
                data = data.length > 3 ? data.slice(0, 3) : data;
                data.forEach((item) => {
                    item.href = query.url(vm.hrefs.urlFind, {id: item.id});
                });
                vm.infos = [...vm.infos, ...data];
                console.dir(vm.infos)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
@import "../../common/style/mixin";

.info {
    margin: rem(24px auto 24px);
}

.header {
    @include display-flex();
    @include justify-content(space-between);
    min-height: r(80);
    margin-left: r(24);
    padding-right: r(24);
    border-bottom: r(1) solid transparent;

    .title,
    .more {
        line-height: r(80);
        font-size: r(30);
        .arrow-right {
            @include arrow-right;
        }
    }

    .more {
        // @include flex(0);
        width: r(120);
        text-align: right;
    }
}
</style>
