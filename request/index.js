// 同时发送异步代码的次数
let ajaxTimes = 0;
export const request = (params) => {
// 判断url中是否带有 /my/ 请求的是私有路径 带上header token
   let header ={...params.header};
   if(params.url.includes("/my/")){
    //  拼接header 带上token
    header["Authorization"] = wx.getStorageSync('token');
   }
   ajaxTimes++; 
  //定义公共的url
  const baseURL = "https://api-hmugo-web.itheima.net/api/public/v1"
  // 加载中图标
  wx.showLoading({
    title: '',
    mask: true
  })
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header,
      url: baseURL + params.url,
      success: (result) => {
        resolve(result.data.message)
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
         ajaxTimes--;
         if(ajaxTimes === 0 )
         wx.hideLoading();
      }
    })
  })
}
