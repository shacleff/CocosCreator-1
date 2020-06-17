var HallManagement = require("./HallManagement");
cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad:function () {
        this.pageView = cc.find("bg/top/pageView",this.node).getComponent(cc.PageView);
        this.page = cc.find("bg/top/page",this.node);

        var self = this;
        var time = new Date().getTime();
        var data = {
            "app_id":SiteConfig.app_id,
            "utoken":GlobalUserInfo.information.utoken,
            "session_id":GlobalUserInfo.information.session_id,
            "time_stamp":time,
        }

        var func = function(ret){
            if(ret.code == 4000){
                var data = {text:ret.msg};
                UtilityClass.loadAlertPrefab(self.node,data);
            }else if(ret.code == 200){
                var data =  ret.data;
                for(var i=0; i<data.aCount; i++){
                    var page = cc.instantiate(self.page);
                    page.data = data.dataList[i];
                    page.active = true;
                    UtilityClass.loadTexture(page,page.data.thumbnail);

                    self.pageView.addPage(page);
                    // page.on("click",)
                }
            }
        }

        HallManagement.sendSlideshow(data,func);

        this.schedule(() => {
            //一共多少页
            let count = this.pageView.getPages().length;
            //取当前页下序号
            let index = this.pageView.getCurrentPageIndex();
            //为最后一页，index为0，否则+1
            index = (index+1 >= count ? 0 : index + 1);
            //执行切换
            this.pageView.scrollToPage(index, 2);
        }, 3);


        for(var i=0; i<4; i++){
            cc.find("bg/bottom/toggle/toggle"+i,this.node).on(cc.Node.EventType.TOUCH_END,this.toggleClick,this);
        }
    },

    toggleClick:function (event) {
        for(var i=0; i<4; i++){
            cc.find("bg/bottom/toggle/toggle"+i,this.node).getComponent(cc.Toggle).isChecked = false;
        }

        var custom = event.target.getComponent(cc.Toggle).checkEvents[0].customEventData;
        this.showToggle(custom);
    },

    showToggle:function (custom) {
        cc.find("bg/bottom/toggle/toggle"+custom,this.node).getComponent(cc.Toggle).isChecked = true;

        if(custom == 0){

        }
    }


});