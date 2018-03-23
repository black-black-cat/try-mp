<template>
  <div class="container">
    <a href="/pages/index.o/index.o" class="home">index.o</a>
    <a href="/pages/logs/logs" class="home">logs</a>
    <a href="/pages/counter/counter" class="home">counter</a>
    <!-- <web-view src="http://app.omnijoi.cn/v4.0/" @message="onWebViewMsg"></web-view> -->
  </div>
</template>

<script>
import card from '@/components/card'
const log = console.log

export default {
  data () {
    return {
      motto: 'Hello World',
      userInfo: {}
    }
  },

  components: {
    card
  },

  methods: {
    bindViewTap () {
      const url = '/pages/logs/logs'
      wx.navigateTo({ url })
    },
    getUserInfo () {
      // 调用登录接口
      wx.login({
        success: () => {
          wx.getUserInfo({
            success: (res) => {
              this.userInfo = res.userInfo
            }
          })
        }
      })
    },
    clickHandle (msg, ev) {
      console.log('clickHandle:', msg, ev)
    },
    toCounter () {
      const url = '/pages/counter/counter'
      wx.navigateTo({ url })
    },
    onWebViewMsg () {
      log(arguments)
    }
  }
}
</script>

<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}
</style>
