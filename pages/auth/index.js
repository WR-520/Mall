import {
  request
} from "../../request/index"
import regeneratorRuntime from '../../lib/runtime/runtime'
import {
  login
} from '../../utils/asyncWx'
Page({

  data: {

  },
  async handleGetUserInfo(e) {
    try{
    //   1 获取用户信息
    console.log(e.detail);
    const {
      encryptedData,
      rawData,
      iv,
      signature
    } = e.detail;
    const {
      code
    } = await login();
    console.log("code" + code);
    const loginParams = { encryptedData, rawData,iv,signature,code};
    // 发送请求 获取用户的token
    const res = await request({url:"/users/wxlogin",data:loginParams,method:"post"})
//  这里无法获取到token
    console.log("res"+ res);  
    // 从接口文档复制了一个token
    const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
    // 把token存入缓存中 同时跳转回上一个页面
    wx.setStorageSync('token', token);
    wx.navigateBack({
        delta:1
    })
   }catch(error){
       console.log(error);
   }
}
})
