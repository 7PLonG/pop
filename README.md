# pop
jq+ES6 构成项目弹窗
 type:msg,confirm,tip
msg  长窗口，可展示多项内容，可以不传入popTit，并在popText传入HTML结构
confirm 短小窗口,展示短小文案，用于确认性提示
tip 提示窗口，几秒后消失

依赖JQ

    //$.pop('msg',{subBtn:'123',popTit:'tit',popText:'content',created:function(){alert(1)}})
    
    {
        subBtn:'',    // * 确认按钮文案，传入文字时自动调出
        subCb:function(){},  // 确认回调
        resBtn:'',          //取消按钮，默认不传入,触碰关闭
        resCb:function(){},  //取消回调
        popTit:'',
        popText:'',           // 内文字，
        className:'',          //传入类
        closeBtnOn:false,      //显示左上角X按钮
        closeCb:function(){},   //X回调
        notClose:false,   //为true时  resBtn，closeBtn不启用关闭功能
        closeTime:2000,   //type为tip时的关闭时长
        mark:true,         //是否遮罩层
        created:function(){},  //弹窗创建时回调

        // Return,
        // markAdd,
    };
