<template>
  <div class="container">
    <app v-if="dataReady"></app>
  </div>
</template>

<script>
import App from './App1'
const log = console.log

export default {
  data () {
    return {
      dataReady: false
    }
  },

  components: {
    App
  },

  methods: {

  },

  created () {

    // 调用应用实例的方法获取全局数据
    // this.getUserInfo(() => {
    //   console.log(arguments)
    // })
    // log('created')
  },

  onLoad ()　{
    let sys = wx.getSystemInfoSync()
    console.log(sys)
    console.log(this.$root.$mp.query)
    console.log(navigator)
  },

  onShow () {
    const vm = this

    // 请求页面数据
    vm.$http.get('https://easy-mock.com/mock/5a4c47086b0cfc253a3f994d/dyh5/web/myorder/snacklist')
      .then((res) => {
        vm.dataReady = true
        log(res)
      })
  }
}
</script>
