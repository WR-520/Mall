// pages/goods_list/index.js
// 用户上滑页面 滚动条触底 开始加载下一页数据
// 1.先找到滚动条触底事件
// 2.判断是否有下一页数据
// 一、获取到总页数
// 总页数＝Math.ceil(总条数/页容量)
// 二、获取到当前页码
// 三、判断当前页码是否大于等于总页数

// 3.假如没有下一页数据 弹出一个提示框
// 4.假如还有下一页数据 来加载下一页数据

// 下拉刷新页面
// 一、触发下拉刷新事件 
// 二、重置数据数组
// 三、重置页码 设置为1
import regeneratorRuntime from '../../lib/runtime/runtime'
import {
  request
} from '../../request/index'
Page({
  data: {
    tabs: [{
      id: 0,
      value: "综合",
      isActive: true
    }, {
      id: 0,
      value: "销量",
      isActive: false
    }, {
      id: 2,
      value: "价格",
      isActive: false
    }],
    goodslist: []
  },
  //接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid || "";
    this.QueryParams.query = options.query||"";
   

    this.getGoodsList();
    console.log(options);
  },
  //获取商品列表数据
  async getGoodsList() {

    const res = await request({
      url: "/goods/search",
      data: this.QueryParams
    });
    // 获取总条数
    const total = res.total;
    //计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    this.setData({
      // 拼接商品列表数组
      goodslist: [...this.data.goodslist, ...res.goods]
    })

    //  关闭下拉刷新的窗口 如果没有调用下拉刷新窗口 直接关闭也不会报错
    wx.stopPullDownRefresh();
  },


  //标题点击事件 从子组件传递过来
  handleTabsItemChange(e) {
    //1.获取被点击的标题索引
    const {
      index
    } = e.detail.index;
    console.log(index);
    //2.修改源数组
    let {
      tabs
    } = this.data;
    tabs.forEach((val, i) => i === index ? val.isActive = true : val.isActive = false);
    //3.赋值到data中
    this.setData({
      tabs
    })
  },
  //滚动条触底事件
  onReachBottom() {
    // 判断还有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      console.log("没有下一页数据");
      wx.showToast({
        title: '没有下一页数据',
        icon: 'error'
      })

    } else {
      console.log("有下一页数据");
      this.QueryParams.pagenum++;
      this.getGoodsList({
        url: "/goods/search",
        data: this.QueryParams
      })
    }
  },
  // 下拉刷新事件
  onPullDownRefresh() {
    console.log("下拉刷新监听");
    this.setData({
      goodslist: []
    })
    this.QueryParams.pagenum = 1;
    this.getGoodsList();

  }
})
