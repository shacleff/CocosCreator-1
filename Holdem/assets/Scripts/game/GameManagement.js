var GameManagement = {

    init:function(){
        WebSocket_js.init();
        /**桌内玩家信息 */
        this.deskPlayInfo = new Array(8);
        /**上桌玩家位置 */
        this.playerNode = [];
        /**公共牌 */
        this.communityCardsNode = [];
        /**赢家信息 */
        this.winstr = null;
    },

    sendJoinRoom:function(userId,roomId){
        var data = {};
        data.member_id = userId;
        data.room_id =  roomId;
        data.token = "";
        WebSocket_js.send("10001",data);
    },

    sendSitdown:function (seat,bring) {
        var index = parseInt(seat);//位置0-7

        //判断座位是否有人
        if(this.deskPlayInfo[index] != null && this.deskPlayInfo[index] != "" ){
            console.log("座位上已经有人");
            return;
        }else{
            var data = {"seat":index+1,"bring":bring};
            WebSocket_js.send("10002",data);
        }
    },




    receiveRoomInfo:function(data){
        if(data.players){
            for(var i=0; i<data.players.length; i++){
                var userInfo = data.players[i];
                var int = parseInt(userInfo.seat)-1;
                this.deskPlayInfo[int] = userInfo;
            }

            this.showSeatedPlayer();
        }
    },

    receiveSitdown:function(data){
        var seat = data.player.seat-1;
        this.deskPlayInfo[seat] = data.player;
        this.showSeatedPlayer();
    },

    /*
    * TODO 玩家信息在桌子上的显示问题
    * */
    showSeatedPlayer:function(){
        var isSelfUserId = false,index = -1;
        for(var i=0; i<this.deskPlayInfo.length; i++){
            //判断自己是否在桌内
            if(this.deskPlayInfo[i] != null && this.deskPlayInfo[i] != "" && GlobalUserInfo.userId == this.deskPlayInfo[i].member_id){
                isSelfUserId = true
                index = i;
            }
        }

        if(isSelfUserId && index != -1){
            //有就以自己为play0
            for(var i=0; i<this.playerNode.length ; i++){
                if(this.deskPlayInfo.length > index+i){
                    this.playerNode[i].data = this.deskPlayInfo[index+i];
                }else{
                    var int = index+i - this.deskPlayInfo.length;
                    this.playerNode[i].data = this.deskPlayInfo[int];
                }
            }
        }else{
            //没有就正常显示
            for(var i=0; i<this.playerNode.length ; i++){
                this.playerNode[i].data = this.deskPlayInfo[i];
            }
        }

        for(var i=0; i<this.playerNode.length ; i++){
            var data = this.playerNode[i].data;
            if(data != null && data != ""){
                this.playerNode[i].getChildByName("name").getComponent(cc.Label).string = data.nickname;
                this.playerNode[i].getChildByName("money").active = true;
                cc.find("money/label",this.playerNode[i]).getComponent(cc.Label).string = data.bring;
            }else{
                this.playerNode[i].getChildByName("name").getComponent(cc.Label).string = "";
                cc.find("money/label",this.playerNode[i]).getComponent(cc.Label).string = "";
            }
        }
    },

    //获得手牌信息
    receiveMatchBegan:function (data) {
        for(var i=0; i<this.playerNode.length; i++){
            for (var info in data.players) {
                var node;
                if (this.playerNode[i].data != null && this.playerNode[i].data != "" && data.players[info].member_id == this.playerNode[i].data.member_id) {
                    if (data.players[info].member_id == GlobalUserInfo.userId) {
                        node = this.playerNode[i].getChildByName("hand");
                        node.active = true;
                    } else {
                        node = this.playerNode[i].getChildByName("mingpai");
                        node.active = true;
                    }

                    var hand = this.adjustPokerNum(data.players[info].hand);

                    var poker1 = node.getChildByName("poke1");
                    UtilityClass.loadAtlas(poker1, "game/pokePlist", hand[0]);

                    var poker2 = node.getChildByName("poke2");
                    UtilityClass.loadAtlas(poker2, "game/pokePlist", hand[1]);
                }
            }
        }
    },

    receiveCommunityCards:function (data) {
        var list = data.poker_list;
        list = this.adjustPokerNum(list);

        for(var i=0 ; i<list.length ; i++){
            UtilityClass.loadAtlas(this.communityCardsNode[i],"game/pokePlist",list[i]);
        }
    },

    //TODO 手牌数字调整，以后有牌资源调整
    adjustPokerNum:function(list){
        for(var i=0; i<list.length; i++){
            if(list[i]==14 && list[i]==27 && list[i]==40 && list[i]==53){
                list[i] = list[i]-13;
            }
        }
        return list;
    },

    receiveBureauResults:function (data) {
        data = data.winner_list;
        this.winstr.getComponent(cc.Label).string = "玩家ID:"+data[0].member_id+",gold:"+data[0].gold;
    },
};
module.exports = GameManagement;

