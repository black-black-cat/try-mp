import Fly from 'flyio/dist/npm/wx'
const fly = new Fly()

// code状态码200判断
fly.interceptors.response.use((res) => {
  if (res.data.code !== 0 && res.data.error !== 0) {
    console.log('暂无数据！');
    return Promise.reject({
      type: 0,
      msg: res.data.msg,
      res: res.data
    });
  }
  return res.data;
}, (error) => {
  console.log('promise error:' + error);
  return Promise.reject({
    type: -2,
    msg: "请求出错!",
    res: error
  })
});

export default fly
