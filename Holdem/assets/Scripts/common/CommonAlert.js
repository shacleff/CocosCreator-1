cc.Class({
    extends: cc.Component,

    properties: {},

    onLoad:function () {
        var title = cc.find("label_0",this.node);
        var label = cc.find("label_1",this.node);

        title.getComponent(cc.Label).string = "提示";
        if(this.node.data.title != null && this.node.data.title != ""){
            title.getComponent(cc.Label).string = this.node.data.title;
        }

        label.getComponent(cc.Label).string = this.node.data.text;
    },


});