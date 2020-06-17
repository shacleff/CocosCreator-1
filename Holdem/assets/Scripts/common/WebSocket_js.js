 /**主通讯类 */
 var GameManagement = require("../game/GameManagement");

 window.WebSocket_js = {

     init:function(){
         this.ws = null;
         //if(cc.vv.Websocket) cc.vv.Websocket.ws = null;
         this.global_error_status = 0;
         this.canReConnect = 1;//允许重连，主动断掉连接/被踢出房间/房间无效/顶号等情况时不要自动重连

         this.heart_beat = 0;// 连续发两次心跳没回应的话就断线重连

         this.connect();
     },


     connect:function () {
         this.canReConnect = 1;
         this.createWebSocket();
     },

    createWebSocket:function () {
        console.log("创建长连接");
        var self = this;
        var realWsUrl = /*GlobalVariable.webSocketUrlDzpk*/"ws://192.168.0.115:8888/ws";
        // if(cc.vv.Global.gameSvrType=='short') realWsUrl = cc.vv.http.webSocketUrlShort;
        this.ws = new WebSocket(realWsUrl);

        this.ws.onopen = function(event) {
            self.onOpen(event);
            self.global_error_status = 0;
        };

        this.ws.onclose = function (event) {
            console.log("onClose");
            self.onClose(event);
        };

        this.ws.onerror = function (event) {
            console.log("onError");
        };

        this.ws.onmessage = function(event) {
            //console.log("addChild-net_error-3-"+cc.vv.Websocket.ws.readyState);
            this.heart_beat = 0
            console.log("onmessage");
            if (event.data == '') return
            var code = event.data.substring(0,5);
            var data = event.data.substring(5,event.data.length);
            data = JSON.parse( data );
            self.onMessage(code,data);
            // this.huifumMsg(data.data);
        };
    },

    onOpen:function (event) {
        console.log("onOpen");
    },

    onClose:function (event) {
        if(this.ws && this.ws.readyState==WebSocket.CLOSED){
            // if (cc.vv.Global.currentSceneControl.showNetError instanceof Function){
            //     this.unschedule(this.sendHeartbeat);
            //     let  tempWsId = cc.vv.Global.wsId;
            //     this.scheduleOnce(()=>{ if (cc.vv.Global.currentSceneControl && cc.vv.Global.currentSceneControl.showNetError instanceof Function) cc.vv.Global.currentSceneControl.showNetError(tempWsId)},3)
            // }
        }
    },

     //请求消息部分
     send: function(method, data){
         var aa = method+JSON.stringify(data);
         console.log(aa);
         // this.resetHeartbeatPlan();

         if(this.ws && this.ws.readyState==WebSocket.OPEN){
             this.ws.send(aa);
         }
     },

    //发送心跳
    sendHeartbeat:function(){
        this.sendUseraoqi()
    },

    // 心跳
    sendUseraoqi:function(){
        //console.log('this.heart_beat=======>'+this.heart_beat)
        if (this.heart_beat == 1){
            // 断线重连
            this.heart_beat = 0
            this.unschedule(this.sendHeartbeat);

            cc.vv.Global.currentSceneControl.heartChonglian()
        }
        else {
            this.heart_beat = 1
        }
        let data = {
        };
        this.send('user_aoqi', data)
        //console.log('this.heart_beat=======------------>'+this.heart_beat)
    },

    onMessage: function (code,data) {
        if(code == "20002"){
            //返回坐下信息
            GameManagement.receiveRoomInfo(data);
        }else if(code == "20003"){
            //返回坐下信息
            GameManagement.receiveSitdown(data);
        }else if(code == "20005"){
            //返回手牌信息
            GameManagement.receiveMatchBegan(data);
        }else if(code == "20006"){
            //返回公共牌信息
            GameManagement.receiveCommunityCards(data);
        }else if(code == "20007"){
            //返回本局结果
            GameManagement.receiveBureauResults(data);
        }
    },
 };