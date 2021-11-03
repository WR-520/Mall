import {
  request
} from "../../request/index"
import regeneratorRuntime from '../../lib/runtime/runtime'
// pages/category/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧菜单数据
    leftMenuList: [],
    //右侧内容
    rightContent: [],
    //被点击的
    currentIndex: 0,
    //右侧内容滚动条距离顶部的距离
    scrollTop:0
  },
  //接口的返回数据
  Cates: [],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
 
    // 先判断本地存储中有没有旧数据
    // 没有旧数据 直接发送新请求
    // 有旧数据 同时 旧的数据也没有过期 就使用本地存储中的旧数据

    // 1.获取本地存储中的数据 （小程序中也是存在本地存储技术）
    const Cates = wx.getStorageSync('cates')
    // 2.判断数据是否存在
    if (!Cates) {
      // 不存在 发送请求获取数据
      this.getCates();
    } else {
      //有旧的数据 定义过期时间
      if (Date.now() - Cates.time > 10000) {
        //重新发送请求
        this.getCates();
        
      } else {
        //可以使用旧数据
        console.log("可以使用旧数据");
        this.Cates = Cates.data;
        //构造左侧大菜单数据
        let leftMenuList = this.Cates.map(v => v.cat_name)
        //构造右侧商品数据
        let rightContent = this.Cates[0].children;
        //右侧内容的滚动条距离顶部的距离
        scrollTop: 0;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }

  },

 
  async getCates() {
    // request({
    //   url: "/categories"
    // }).then(res => {
    // })
    //1.使用ES7的async和await 来发送请求
    const res = await request({url:"/categories"});
        this.Cates = res;
       //构造左侧大菜单数据
       let leftMenuList = this.Cates.map(v => v.cat_name)
       //构造右侧商品数据
       let rightContent = this.Cates[0].children;
       //右侧内容的滚动条距离顶部的距离
       scrollTop: 0;
       this.setData({
         leftMenuList,
         rightContent
       })
      //已确保有数据 把接口的数据存入到本地存储中
      wx.setStorageSync("cates", {
        time: Date.now(),
        data: this.Cates
      })

  },
  //左侧菜单的点击事件
  handleItemTap(e) {

    const {
      index
    } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children;

    this.setData({
      currentIndex: index,
      rightContent,
      //重新设置  右侧内容的scrollview标签距离顶部的距离
    })
    
    this.setData({
      scrollTop:0
    })
    console.log(this.data.scrollTop)
  }

})
