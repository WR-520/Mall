// showToast封装
export const showToast = ({
  title,
  icon,
  duration
}) => {
  return new Promise((resolve, reject) => {

    wx.showToast({
      title,
      icon,
      duration,
      success:(res)=>{
          resolve(res)
      },
      fail: (err) => {
        reject(err);
      }
    })

  })
}
// promise形式的微信登录
export const login = () =>{
  return new Promise( (resolve,reject)=>{
    wx.login({
      timeout:10000,
      success:(result) => {
        resolve(result);
      },
      fail:(err)=>{
        reject(err);
      }
    })
  })
}
// 微信支付封装
export const requestPayment = (pay) =>{
   return new Promise((resolve,reject)=>{
     wx.requestPayment({
       ...pay,
       success:(result) =>{
         resolve(result);
       },
       fail: (err)=>{
         reject(err);
       }
     })
   })

} 