<template>
    <div class="list" ref="list">
        <div class="item" v-for="item in options">
            <div class="title">
                <div>{{item.cinema_name}}</div>
                <template v-if="item.order_status == '1'">
                    <app-time :time='{"create": item.create_date
                    , "expire": item.expire_date, "now": nowtime}'
                    :data="item"
                    @countdownEnd="resetData"
                    ></app-time>
                </template>
                <template v-else-if="item.order_status == '4'">
                    <div v-if="item.ticket_status == '3'" class="error">{{item.ticket_status_name}}</div>
                    <div v-if="item.ticket_status == '1'" class="status">{{item.ticket_status_name}}</div>
                    <div v-if="item.ticket_status == '2'" class="due">{{item.ticket_status_name}}</div>
                    <div v-if="item.ticket_status == '5'" class="status">{{item.ticket_status_name}}</div>
                    <div v-if="item.ticket_status == '6'" class="error">{{item.ticket_status_name}}</div>
                </template>
                <template v-else-if="item.order_status == '2' || item.order_status == '6'">
                    <div class="due">{{item.order_status_name}}</div>
                </template>
                <template v-else>
                    <div class="status">{{item.order_status_name}}</div>
                </template>
            </div>
            <div class="info">
                <div>
                    <span>{{item.film_name}}</span>{{item.show_type_name}}&nbsp;x{{item.seats.length}}
                </div>
                <div>{{item.show_time}}</div>
                <div class="snack" v-for="son in item.snacks">
                    <div>{{son}}</div>
                </div>
            </div>
            <app-common :options="item"></app-common>
        </div>
        <div class="blank" v-if="this.blank">
            <div><img src="/images/common/error.png" alt=""></div>
            <div>空空如也~</div>
        </div>
        <div class="more" v-if="this.more">——哦呦~到底了——</div>
    </div>
</template>
<script>
import dialogManager from 'common/plugin/dialog';
import appCommon from './Common';
import appTime from './Time';

export default {
    props:  {
        options: null,
        nowtime: null,
        more: false,
        blank: false
    },
    data() {
        return {}
    },
    components: {
        appTime,
        appCommon
    },
    methods: {
        resetData() {
            this.$emit("resetData", {
                count: 0
            });
        }
    }
}
</script>
