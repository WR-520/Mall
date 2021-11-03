/*
 1 输入框绑定 值改变事件 input事件
    1 获取到输入框的值
    2 合法性判断
    3 检验通过 把输入框的值 发送到后台
    4 返回的数据打印到页面上
 2 防抖(防止抖动) 定时器
   0 防抖 一般用在输入框 防止重复输入 重复发送请求
   1 节流 一般使用在页面上拉和下拉
   1 定义一个全局的定时器id

*/

import {
    request
} from "../../request/index";
import {
    regeneratorRuntime
} from '../../lib/runtime/runtime'
Page({

    data: {
        goods: [],
        // 取消按钮是否显示
        isFocus:false,
        // 输入框的值
        inputValue:""
    },
    TimeId: -1,
    //  输入框的值改变了 就会触发事件
    handleInput(e) {
        // 1 获取输入框的值
        const {
            value
        } = e.detail;
        // 2 检查合法性
        if (!value.trim()) {
            // 值不合法
            this.setData({
                goods:[],
                isFocus:false
            })
            return;
        }
        this.setData({
            isFocus:true
        })
        //     3 准备发送请求数据
        clearTimeout(this.TimeId);
        this.TimeId = setTimeout(() => {
            this.qsearch(value);
        }, 2000)

    },

    // 发送请求获取搜索建议 数据
    async qsearch(query) {
        const res = await request({
            url: "/goods/qsearch",
            data: {
                query
            }
        });
        console.log("res",res);
        this.setData({
            goods: res
        })
    },
//    取消按钮
    handleCancel(){
      this.setData({
          inputValue:"",
          isFocus:false,
          goods:[]
      })
    }
})