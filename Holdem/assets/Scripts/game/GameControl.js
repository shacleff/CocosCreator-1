var GameManagement = require("./GameManagement");
cc.Class({
    extends: cc.Component,

    properties: {
    },

    onLoad:function () {
        GlobalUserInfo.userId = Math.ceil(Math.random()*1000000);
        this.roomId = 1;
        GameManagement.init();
        for(var i =0; i<8 ; i++){
            var btn = cc.find("bg/playerNode/player_"+i,this.node);
            GameManagement.playerNode.push(btn);
            btn.getChildByName("head_btn").on("click",this.clickSitdown,this);
            btn.getChildByName("mingpai").active = btn.getChildByName("win_score").active = btn.getChildByName("money").active = false;
        }

        cc.find("bg/start_btn",this.node).on("click",this.clickJoinRoom,this);

        for(var i=0; i<5; i++){
            var poker = cc.find("bg/common/poke"+i,this.node);
            GameManagement.communityCardsNode.push(poker);
        }

        GameManagement.winstr = cc.find("bg/deskInfo/pot",this.node);

    },

    clickJoinRoom:function(){
        cc.find("bg/New Sprite",this.node).active = cc.find("bg/start_btn",this.node).active = false;
        GameManagement.sendJoinRoom(GlobalUserInfo.userId,this.roomId);
    },

    clickSitdown:function (event) {
        var data = {},bool = false;
        data.seat = event.clickEvents[0].customEventData;
        data.bring = 123;

        for(var i=0; i<GameManagement.deskPlayInfo.length; i++){
            if(GameManagement.deskPlayInfo[i] != null && GameManagement.deskPlayInfo[i] != "" && GlobalUserInfo.userId == GameManagement.deskPlayInfo[i].member_id){
                bool = true;
            }
        }

        if(!bool){
            GameManagement.sendSitdown(data.seat,data.bring);
        }

    },
});