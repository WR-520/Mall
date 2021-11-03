import {
  request
} from "../../request/index";
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
   orders: [
    {
      "order_id": 428,
      "user_id": 23,
      "order_number": "HMDD20190802000000000428",
      "order_price": 13999,
      "order_pay": "0",
      "is_send": "否",
      "trade_no": "",
      "order_fapiao_title": "个人",
      "order_fapiao_company": "",
      "order_fapiao_content": "",
      "consignee_addr": "广东省广州市海珠区新港中路397号",
      "pay_status": "1",
      "create_time": 1564731518,
      "update_time": 1564731518,
      "order_detail": null,
      "goods": [
        {
          "id": 717,
          "order_id": 428,
          "goods_id": 43986,
          "goods_price": 13999,
          "goods_number": 1,
          "goods_total_price": 13999,
          "goods_name": "海信(Hisense)LED55MU9600X3DUC 55英寸 4K超高清量子点电视 ULED画质 VIDAA系统",
          "goods_small_logo": "http://image5.suning.cn/uimg/b2c/newcatentries/0000000000-000000000160455569_1_400x400.jpg"
        }
      ],
      "total_count": 1,
      "total_price": 13999
    }
  ],
    //Tabs数据
    tabs: [{
      id: 0,
      value: '全部',
      isActive: true
    }, {
      id: 1,
      value: '待付款',
      isActive: false
    }, {
      id: 2,
      value: '待发货',
      isActive: false
    }, {
      id: 3,
     value: '退款/退货',
      isActive: false
    }]
  },
  onShow(options){
    const token = wx.getStorageSync('token');
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index',
      })
      return;
    }
    console.log(options);//undefined
    let pages= getCurrentPages();
    let currentPage = pages[pages.length-1];
    const {type} = currentPage.options;
    this.getOrders(type);
  },
  //获取订单列表的方法
  async getOrders(type){ 
     const res = await request({url:"/my/orders/all",data:{type}})
     this.setData({
       orders:res.orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString()) }))
     })
     this.changeTitleByIndex(type-1);
  },
  // 根据标题的索引来激活选中标题数组
  changeTitleByIndex(index){
    let {tabs} = this.data;
    tabs.forEach( (v,i) => i === index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
 
  },
  handleTabsItemChange(e){
      const {index} = e.detail; 
      this.getOrders(index.index+1)
  }
})