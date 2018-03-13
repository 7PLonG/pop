;(function ($) {

    // type:msg,confirm,tip
    //  msg  长窗口，可展示多项内容，可以不传入popTit，并在popText传入HTML结构
    //  confirm 短小窗口,展示短小文案，用于确认性提示
    //  tip 提示窗口，几秒后消失

    const setPopDefault ={
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


    // 调用方式
    //$.pop('msg',{subBtn:'123',popTit:'tit',popText:'content',created:function(){alert(1)}})

    $.extend({
        "pop":
            function (type = 'confirm',
                          {
                              subBtn = setPopDefault.subBtn,
                              subCb= setPopDefault.subCb,
                              resBtn= setPopDefault.resBtn,
                              resCb= setPopDefault.resCb,
                              popTit= setPopDefault.popTit,
                              popText= setPopDefault.popText,
                              className= setPopDefault.className,
                              closeBtnOn= setPopDefault.closeBtnOn,
                              closeCb= setPopDefault.closeCb,
                              notClose= setPopDefault.notClose,
                              closeTime= setPopDefault.closeTime,
                              mark= setPopDefault.mark,
                              created= setPopDefault.created,
                          } = setPopDefault
                      ){
        // 函数主体

            // 定义变量
            const subClass = '';
            const scrollTop = window.pageYOffset
                    || document.documentElement.scrollTop
                    || document.body.scrollTop || 0;
            let scrollvalue = 0;

            // 内部函数事件：
            function markShow (){
                if(!$('.winMark').size()){
                    $('body').append('<div class="winMark"></div>');
                    $('.winMark').show();
                }else{
                    $('.winMark').show();
                }
            }
            function markClose() {
                $('.winMark').hide();
            }
            function stopscroll(){
                //  因会阻止弹窗内部滚动，被舍弃
                // document.addEventListener('touchmove',function(e){
                //     e.preventDefault();
                // },false);
                scrollvalue = $(window).scrollTop();
                $('body').css({'overflow':'hidden',
                    'position':'relative','left':0,'right':0,
                    'top':(-1*scrollvalue+'px')});
            }
            function rescroll(){
                // document.removeEventListener('touchmove',function(e){
                //     e.preventDefault();
                // },false);
                $('body').css({'overflow':'','position':'','top':'','left':'','right':''});
                $(window).scrollTop(scrollvalue);
                // 'position':'relative' PC上有显示问题，保留修改为fixed
            }
            function popRemove() {
                rescroll();
                markClose();
                // $('.pop').off().remove();
                popJQ.remove();
            }
            // 字符串模板
            const titPart = `
                <div class="pop_title">
                    <p>
                        ${popTit}
                    </p>
                </div>
            `;
            const contentPart = `
                <div class="pop_content">
                    <p>
                        ${popText}
                    </p>
                </div>
            `;

            // 事件结构模块

            // 关闭按钮模块
            const closeBtnPart =((closeBtnOn=closeBtnOn,closeCb=closeCb)=> {
                const closeBtnObj = {
                    str:`<a href="javascript:;" class="pop_close"></a>`,
                    fn: function () {
                        let CloseBtn = popJQ.find('.pop_close');
                        CloseBtn.on('click', function (event) {
                            event.stopPropagation();
                            closeCb();
                            if(notClose){
                                return
                            }
                            popRemove();
                        })
                    }
                };
                if(closeBtnOn){
                    return closeBtnObj
                }else {
                    return ''
                }
            })(closeBtnOn,closeCb);

            // 确认按钮模块
            const subBtnPart =((subBtn=subBtn,subCb=subCb)=> {
                const subBtnObj = {
                    str: `<a href="javascript:;" class="btn btn_sub"><span>${subBtn}</span></a>`,
                    fn: function () {
                            let SavBtn = popJQ.find('.btn_sub');
                                SavBtn.on('click', function (event) {
                                    event.stopPropagation();
                                    subCb();
                                    if(notClose){
                                        return
                                    }
                                    popRemove();
                                })
                        }
                };
                if(subBtn){
                    return subBtnObj
                }else {
                    return ''
                }
            })(subBtn,subCb);

            // 取消按钮模块
            const resBtnPart = ((resBtn=resBtn,resCb=resCb)=> {
                const resBtnPart = {
                    str:`<a href="javascript:;" class="btn btn_res"><span>${resBtn}</span></a>`,
                    fn:function () {
                        let ResBtn = popJQ.find('.btn_res');
                        ResBtn.on('click', function (event) {
                            event.stopPropagation();
                            resCb();
                            if(notClose){
                                return
                            }
                            popRemove();
                        })
                    }
                };
                if(resBtn){
                    return resBtnPart
                }else {
                    return ''
                }
            })(resBtn,resCb);
            // 按钮组字符串拼合
            const btnPart = `
                   <div class="btn_wrapper">
                        ${subBtnPart&&subBtnPart.str}                
                        ${resBtnPart&&resBtnPart.str}
                   </div>  
            `;

            //拼合弹窗外框 msg,confirm,tip
            let popString ='';
            switch (type)
            {
                case 'msg':
                    popString =`
                        <div class='pop pop_${type} ${className}'>
                            ${titPart}
                            ${closeBtnPart&&closeBtnPart.str}
                            ${contentPart}
                            ${btnPart}
                        </div>`;

                    break;
                case 'confirm':
                    popString =`
                        <div class='pop pop_${type} ${className}'>
                            ${titPart}
                            ${contentPart}
                            ${btnPart}    
                        </div>`;
                    break;
                case 'tip':
                    popString =`
                        <div class='pop pop_${type} ${className}'>
                            ${contentPart}    
                        </div>`;
                    break;
            }
            // const jqVer = parseInt($.fn.jquery);  //jq版本
            // let popJQ = '';
            // if(jqVer > 1 ){
            //     popJQ = $(popString);
            // }else{
            //     popJQ = $(popString.trim());
            // }
            let  popJQ = $(popString.trim());
            if(mark){
                // 判断是否有遮罩层
                markShow()
            }
            stopscroll(); // 阻止页面滚动
            $('body').append(popJQ);
            created();   //创建成功回调
            //事件注册
            subBtnPart && subBtnPart.fn();
            resBtnPart && resBtnPart.fn();
            closeBtnPart && closeBtnPart.fn();
            return popJQ    //链式调用
            //窗口特异化处理
                //定时关闭
            if (type === 'tip') {
                markClose();   //tip无遮罩
                if(notClose){
                    return
                }
                setTimeout(function () {
                    popJQ.addClass('hide');
                    popRemove()
                }, closeTime);
            }

        },

    });

})(window.jQuery);
