import { trackerColoreMap, trackerColorMapBGRList } from '../../data/params'

import {
     message as Message
} from 'antd'
/**
 * layers: [{
        width: 630,
        height: 475,
        x1: 205,
        x2: 835,
        y1: 66,
        y2: 541,
        strokeStyle: "#0000ff",
        drawType: 'rect',
        labelOpt: {value: "001_5075903786", label: "人脸_0", selected: true},//非必须
   },{
        width: 630,
        height: 475,
        x1: 205,
        x2: 835,
        y1: 66,
        y2: 541,
        strokeStyle: "#0000ff",
        drawType: 'polar',
        polarData: [{x:10, y:2},{x:10, y:2},{x:10, y:2},{x:10, y:2}],
        labelOpt: {value: "001_5075903786", label: "人脸_0", selected: true},//非必须
 * }]
 */
class rectAngle {
    constructor() {
        this.c = null;
        this.ctx = null;
        this.startx = 0;//起始x坐标
        this.starty = 0;//起始y坐标
        this.endX = 0;
        this.endY = 0;
        this.eleWidth = 0;
        this.eleHeight = 0;
        this.leftDistance = "";
        this.topDistance = "";
        this.flag = 0; //是否点击鼠标的标志 0: 没有点击  1：点击鼠标
        this.operate = 0;//operate操作类型 0 无操作 1 画矩形框 2 拖动矩形框
        this.layers = [];//图层对象组
        this.currentR = "";//当前点击的矩形框
        this.dragging = false; // 是否是拖拽状态，true可拖拽状态；false划线状态不能拖动
        this.lineColor = "#0000ff"; // 划线默认颜色
        this.drawType = 'rect'; // 绘图类型 rect : 拉框； polar ：极点
        this.layers_polar = []; // 极点坐标 ： [{x:10, y:2},{x:10, y:2},{x:10, y:2},{x:10, y:2}]
    }
    $init(id, eleWidth, eleHeight) {
        // console.log(id)
        this.eleWidth = eleWidth;
        this.eleHeight = eleHeight;
        this.c = document.getElementById(id);
        // console.log(this.c)
        this.ctx = this.c.getContext("2d");
        this.c.width = eleWidth;
        this.c.height = eleHeight;
        this.clear();
    }
    mousedown = (e) => {
        // // console.log('mousedown')
        // this.startx = e.offsetX;
        // this.starty = e.offsetY;
        // this.currentR = this.isPointInRetc(this.startx, this.starty);
        // if (this.currentR) {
        //     this.leftDistance = this.startx - this.currentR.x1;
        //     this.topDistance = this.starty - this.currentR.y1;
        // }
        // this.ctx.strokeRect(this.endX, this.endY, 0, 0);
        // this.ctx.strokeStyle = this.lineColor;
        // this.ctx.lineWidth = 2;
        // this.flag = 1;

        this.endX = e.offsetX;
        this.endY = e.offsetY;
        this.ctx.save();
        this.ctx.setLineDash([5])
        this.c.style.cursor = "default";
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.lineColor;
        this.ctx.clearRect(0, 0, this.eleWidth, this.eleHeight)
        // 鼠标点击 && 画线操作 && 划线状态
        if (this.flag && this.operate == 1 && !this.dragging) {
            // console.log('按下划线：', this.startx, this.starty, this.endX, this.endY, e)
            this.ctx.strokeRect(this.startx, this.starty, this.endX - this.startx, this.endY - this.starty);
        }
        this.ctx.restore();
        this.reshow(this.endX, this.endY);

    }

    highlightSelectRect = (idArr, that) => {
        this.ctx.save();
        this.ctx.setLineDash([5])
        this.c.style.cursor = "default";
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.lineColor;
        this.ctx.clearRect(0, 0, this.eleWidth, this.eleHeight)
        this.ctx.restore();
        let select_item = this.reshowWithSelectID(idArr)

        if (select_item.length == 0 && that.state.mouseoverOpts.TooltipShow){
            that.setState({
                mouseoverOpts:{
                    TooltipShow: false,
                    top:0,
                    left:0,
                    text:''
                }
            })
        }
        if (select_item.length !== 0){
            that.setState({
                mouseoverOpts:{
                    TooltipShow: true,
                    top:select_item[0].y1,
                    left:select_item[0].x1+2,
                    text:Number(select_item[0].id)
                }
            })
        }

    }

    mousemove = (e, that) => {
        // if(!this.dragging)console.log('mousemove')
        this.endX = e.offsetX;
        this.endY = e.offsetY;
        this.ctx.save();
        this.ctx.setLineDash([5])
        this.c.style.cursor = "default";
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = this.lineColor;
        this.ctx.clearRect(0, 0, this.eleWidth, this.eleHeight)
        // 鼠标点击 && 画线操作 && 划线状态
        if (this.flag && this.operate == 1 && !this.dragging) {
            // console.log('按下划线：', this.startx, this.starty, this.endX, this.endY, e)
            this.ctx.strokeRect(this.startx, this.starty, this.endX - this.startx, this.endY - this.starty);
        }
        this.ctx.restore();
        let select_item = this.reshow(this.endX, this.endY);
        // console.log(select_item)
        if (select_item.length == 0 && that.state.mouseoverOpts.TooltipShow){
            that.setState({
                mouseoverOpts:{
                    TooltipShow: false,
                    top:0,
                    left:0,
                    text:''
                }
            })
        }
        if (select_item.length !== 0){
            that.setState({
                mouseoverOpts:{
                    TooltipShow: true,
                    top:this.endY,
                    left:this.endX+2,
                    text:Number(select_item[0].id)
                }
            })
        }

    }
    mouseup = (e) => {
        // console.log('mouseup')
        if (this.operate == 1 && !this.dragging) {
            this.layers.push(this.fixPosition({
                x1: this.startx,
                y1: this.starty,
                x2: this.endX,
                y2: this.endY,
                strokeStyle: this.lineColor,
                drawType: "rect"
            }))
        } else if (this.operate >= 3) {
            this.fixPosition(this.currentR)
        }

        this.currentR = null;
        this.flag = 0;
        this.reshow(this.endX, this.endY);
        this.operate = 0;
    }
    oncontextmenu = (e) => {
        // this.operate = 0;
        // this.clear();
        // return false;
    }
    mousemove_polar = (e) => {
        // console.log("mousemove_polar", e)
    }
    mouseup_polar = (e) => {
        // console.log("mouseup_polar", e)
    }
    // 极点鼠标事件--按下
    mousedown_polar = (e) => {
        let coord = {x: e.offsetX, y: e.offsetY};
        let x_dif0, y_dif0, x_dif1, y_dif1, x_dif2, y_dif2;
        switch (this.layers_polar.length) {
            case 0:
                this.layers_polar.push(coord)
                this.polarDrawPoint(this.layers_polar);
                break;
            case 1:
                x_dif0 = coord.x >= this.layers_polar[0].x;
                y_dif0 = coord.y >= this.layers_polar[0].y;
                if(x_dif0 && y_dif0){
                    this.layers_polar.push(coord)
                    this.polarDrawPoint(this.layers_polar);
                }else{
                    Message({type: "warning", message: "极右点绘制错误，请重新绘制!"})
                }
                break;
            case 2:
                y_dif0 = coord.y >= this.layers_polar[0].y;
                x_dif1 = coord.x <= this.layers_polar[1].x;
                y_dif1 = coord.y >= this.layers_polar[1].y;
                if(y_dif0 && x_dif1 && y_dif1){
                    this.layers_polar.push(coord)
                    this.polarDrawPoint(this.layers_polar);
                }else{
                    Message({ type: "warning", message: "极下点绘制错误，请重新绘制!" });
                }
                break;
            case 3:
                x_dif0 = coord.x <= this.layers_polar[0].x;
                y_dif0 = coord.y >= this.layers_polar[0].y;
                x_dif1 = coord.x <= this.layers_polar[1].x;
                x_dif2 = coord.x <= this.layers_polar[2].x;
                y_dif2 = coord.y <= this.layers_polar[2].y;
                if(x_dif0 && y_dif0 && x_dif1 && x_dif2 && y_dif2){
                    this.layers_polar.push(coord)
                    this.polarDrawPoint(this.layers_polar);
                    this.polarTurnRect(this.layers_polar);
                    this.layers_polar = [];
                }else{
                    Message({ type: "warning", message: "极左点绘制错误，请重新绘制!" });
                }
                break;
            default:
                break;
        }
        // if (this.layers_polar.length >= 0 && this.layers_polar.length < 3) {
        //     this.layers_polar.push(coord)
        //     this.polarDrawPoint(this.layers_polar);
        // } else if (this.layers_polar.length === 3) {
        //     this.layers_polar.push(coord)

        //     this.polarDrawPoint(this.layers_polar);
        //     this.polarTurnRect(this.layers_polar);

        //     this.layers_polar = [];
        // }
    }
    // 极点 绘制点坐标
    polarDrawPoint(podata) {
        this.ctx.fillStyle = this.lineColor;
        for (let i = 0; i < podata.length; i++) {
            this.ctx.beginPath();
            this.ctx.arc(podata[i].x, podata[i].y, 5, Math.PI*2,0);
            this.ctx.fill();
            this.ctx.closePath();
        }
    }
    // 四个极点坐标绘制矩形框
    polarTurnRect(podata) {
        let Xs = [], Ys = [];
        for (let i = 0; i < podata.length; i++) {
            Xs.push(podata[i].x);
            Ys.push(podata[i].y);
        }
        let x1 = Math.min.apply(null, Xs);
        let y1 = Math.min.apply(null, Ys);
        let x2 = Math.max.apply(null, Xs);
        let y2 = Math.max.apply(null, Ys);

        this.ctx.clearRect(0, 0, this.eleWidth, this.eleHeight)
        this.startx = x1; this.starty = y1; this.endX = x2; this.endY = y2;
        this.layers.push(this.fixPosition({
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            strokeStyle: this.lineColor,
            drawType: "polar",
            polarData: podata
        }))
        this.ctx.restore();

        this.reshow(this.endX, this.endY);
        this.drawType = "rect";
    }
    //
    echoDraw(x1, y1, x2, y2, w, h, id) {
        this.eleWidth = w;
        this.eleHeight = h;
        this.c = document.getElementById(id);
        this.ctx = this.c.getContext("2d");
        this.c.width = w;
        this.c.height = h;
        this.clear();

        this.startx = x1; this.starty = y1; this.endX = x2; this.endY = y2;
        this.layers.push(this.fixPosition({
            x1: x1,
            y1: y1,
            x2: x2,
            y2: y2,
            strokeStyle: this.lineColor,
        }))

        this.ctx.restore();
        this.reshow(this.endX, this.endY);
    }

    reshowWithSelectID(idArr) {
        let result = [];
        // if(!this.dragging)console.log('reshow')
        let allNotIn = 1;
        // let layers_reverse = [...this.layers].reverse();
        // layers_reverse.forEach(item => {
        this.layers.forEach((item, index) => {
            this.ctx.beginPath();
            this.ctx.lineWidth = 2;
            this.ctx.rect(item.x1, item.y1, item.width, item.height);
            // this.ctx.strokeStyle = item.strokeStyle;
            // this.ctx.strokeStyle = trackerColoreMap[index % trackerColoreMap.length];
            let [b, g, r] = trackerColorMapBGRList[Math.abs(item.id) % trackerColorMapBGRList.length]
            this.ctx.strokeStyle = `rgb(${r},${g},${b})`;


            // if(item.drawType === 'rect'){
                if (item.id !== -2){
                    this.render(item); // 鼠标当前所在坐标 只有一个框 时候 才可以拖拽
                }
            //
            // }

            idArr.forEach((id, index)=>{
                if (item.id == id) {
                    result.push(item)

                    this.ctx.fillStyle = `rgba(${r},${g},${b},0.7)`;
                    this.ctx.fill();

                    this.ctx.stroke();
                    this.drawArc(item)

                }
            })
            //

            this.ctx.stroke();
            this.drawArc(item)

            // if (item.id > 0 && (item.labelOpt.id.indexOf("person") != -1 || item.labelOpt.id.indexOf("body") != -1) ){
                this.drawText(item.id, item.x1, item.y1, (item.x2-item.x1), this.ctx.strokeStyle)
            // }

        })
        // 返回点所在框信息
        return result

    }

    reshow(x, y) {
        let result = [];
        // if(!this.dragging)console.log('reshow')
        let allNotIn = 1;
        // let layers_reverse = [...this.layers].reverse();
        // layers_reverse.forEach(item => {

        this.layers.forEach((item, index) => {
                this.ctx.beginPath();
                this.ctx.lineWidth = 2;
                this.ctx.rect(item.x1, item.y1, item.width, item.height);
                // this.ctx.strokeStyle = item.strokeStyle;
                // this.ctx.strokeStyle = trackerColoreMap[index % trackerColoreMap.length];
                let [b, g, r] = trackerColorMapBGRList[Math.abs(item.id) % trackerColorMapBGRList.length]
                this.ctx.strokeStyle = `rgb(${r},${g},${b})`;

                if (x >= (item.x1 - 10) && x <= (item.x1 + 10) && y <= (item.y2 - 10) && y >= (item.y1 + 10)) {
                    // this.resizeLeft(item);
                } else if (x >= (item.x2 - 10) && x <= (item.x2 + 10) && y <= (item.y2 - 10) && y >= (item.y1 + 10)) {
                    // this.resizeWidth(item);
                } else if (y >= (item.y1 - 10) && y <= (item.y1 + 10) && x <= (item.x2 - 10) && x >= (item.x1 + 10)) {
                    // this.resizeTop(item);
                } else if (y >= (item.y2 - 10) && y <= (item.y2 + 10) && x <= (item.x2 - 10) && x >= (item.x1 + 10)) {
                    // this.resizeHeight(item);
                } else if (x >= (item.x1 - 10) && x <= (item.x1 + 10) && y <= (item.y1 + 10) && y >= (item.y1 - 10)) {
                    if (this.dragging && item.drawType !== 'polar') this.resizeLT(item);
                } else if (x >= (item.x2 - 10) && x <= (item.x2 + 10) && y <= (item.y2 + 10) && y >= (item.y2 - 10)) {
                    if (this.dragging && item.drawType !== 'polar') this.resizeWH(item);
                } else if (x >= (item.x1 - 10) && x <= (item.x1 + 10) && y <= (item.y2 + 10) && y >= (item.y2 - 10)) {
                    if (this.dragging && item.drawType !== 'polar') this.resizeLH(item);
                } else if (x >= (item.x2 - 10) && x <= (item.x2 + 10) && y <= (item.y1 + 10) && y >= (item.y1 - 10)) {
                    if (this.dragging && item.drawType !== 'polar') this.resizeWT(item);
                }

                // 如果（鼠标当前坐标在当前矩形框内 && 是调整状态） 变成拖动
                if (this.ctx.isPointInPath(x, y) && this.dragging) {
                    if(item.drawType === 'rect'){ // 只有矩形框才可以拖
                        // 只有鼠标当前位置只有一个框的时候才可以拖拽
                        // let rectInLayer = [];
                        // this.layers.forEach((item, index)=>{
                        //     let x_in = x >= item.x1 && x <= item.x2;
                        //     let y_in = y >= item.y1 && y <= item.y2;
                        //     if(x_in && y_in){
                        //         rectInLayer.push(item);
                        //     }
                        // })
                        // if(rectInLayer.length == 1){
                        // if (item.id > 0 && (item.labelOpt.id.indexOf("person") != -1 || item.labelOpt.id.indexOf("body") != -1) ){
                        result.push(item)
                        // }
                        // console.log(item)
                        if (item.id !== -2){
                            this.render(item); // 鼠标当前所在坐标 只有一个框 时候 才可以拖拽
                        }

                        // }
                    }
                    allNotIn = 0;
                    // this.ctx.fillStyle = "rgba(84,153,224,0.7)";
                    this.ctx.fillStyle = `rgba(${r},${g},${b},0.7)`;
                    this.ctx.fill();
                }
                this.ctx.stroke();
                this.drawArc(item)

                // if (item.id > 0 && (item.labelOpt.id.indexOf("person") != -1 || item.labelOpt.id.indexOf("body") != -1) ){
                this.drawText(item.id, item.x1, item.y1, (item.x2-item.x1), this.ctx.strokeStyle)
                // }

            })



        // （按下了鼠标 && 可操作状态 && 变成拖动）
        if (this.flag && this.operate < 3 && allNotIn) {
            this.operate = 1
        }
        // this.layers = layers_reverse.reverse();

        // 返回点所在框信息
        return result

    }
    drawArc(item) {
        this.ctx.fillStyle = item.strokeStyle;
        this.ctx.beginPath();
        this.ctx.arc(item.x1, item.y1, 3, Math.PI*2,0);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.beginPath();
        this.ctx.arc(item.x1, item.y2, 3, Math.PI*2,0);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.beginPath();
        this.ctx.arc(item.x2, item.y1, 3, Math.PI*2,0);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.beginPath();
        this.ctx.arc(item.x2, item.y2, 3, Math.PI*2,0);
        this.ctx.fill();
        this.ctx.closePath();
        if(item.drawType === "polar"){
            for (let i = 0; i < item.polarData.length; i++) {
                this.ctx.beginPath();
                this.ctx.arc(item.polarData[i].x, item.polarData[i].y, 5, Math.PI*2,0);
                this.ctx.fill();
                this.ctx.closePath();
            }
        }
    }
    // 拖动
    render(rect) {
        this.c.style.cursor = "move";
        if (this.flag && this.operate == 0) { this.operate = 2; }
        if (this.flag && this.operate == 2) {
            if (!this.currentR) { this.currentR = rect }
            this.currentR.x2 += this.endX - this.leftDistance - this.currentR.x1
            this.currentR.x1 += this.endX - this.leftDistance - this.currentR.x1
            this.currentR.y2 += this.endY - this.topDistance - this.currentR.y1
            this.currentR.y1 += this.endY - this.topDistance - this.currentR.y1
        }
    }
    /** 判断当前点是否在 当前所有图形内 返回当前图形对象*/
    isPointInRetc(x, y) {
        let layers_reverse = [...this.layers].reverse();
        let len = layers_reverse.length;
        // let len = this.layers.length;
        for (let i = 0; i < len; i++) {
            if (layers_reverse[i].x1 < x && x < layers_reverse[i].x2 && layers_reverse[i].y1 < y && y < layers_reverse[i].y2) {
                return layers_reverse[i];
            }
            // if (this.layers[i].x1 < x && x < this.layers[i].x2 && this.layers[i].y1 < y && y < this.layers[i].y2) {
            //     return this.layers[i];
            // }
        }
    }
    fixPosition(position) {
        if (position.x1 > position.x2) {
            let x = position.x1;
            position.x1 = position.x2;
            position.x2 = x;
        }
        if (position.y1 > position.y2) {
            let y = position.y1;
            position.y1 = position.y2;
            position.y2 = y;
        }
        position.width = position.x2 - position.x1
        position.height = position.y2 - position.y1
        // if (position.width < 50 || position.height < 50) {
        //     position.width = 60;
        //     position.height = 60;
        //     position.x2 += position.x1 + 60;
        //     position.y2 += position.y1 + 60;
        // }
        return position
    }
    getCoord() {
        let res = null;
        if (this.layers.length) {
            res = this.layers;
        }
        return res;
    }
    clear() {
        this.layers = [];
        this.layers_polar=[];
        this.ctx.clearRect(0, 0, this.eleWidth, this.eleHeight);
        this.reshow();
    }

    // 计算鼠标位置，根据位置来拉框调整框线位置 start
    resizeLeft(rect) {
        this.c.style.cursor = "w-resize";
        if (this.flag && this.operate == 0) { this.operate = 3; }
        if (this.flag && this.operate == 3) {
            if (!this.currentR) { this.currentR = rect }
            this.currentR.x1 = this.endX
            this.currentR.width = this.currentR.x2 - this.currentR.x1
        }
    }
    resizeTop(rect) {
        this.c.style.cursor = "s-resize";
        if (this.flag && this.operate == 0) { this.operate = 4; }
        if (this.flag && this.operate == 4) {
            if (!this.currentR) { this.currentR = rect }
            this.currentR.y1 = this.endY
            this.currentR.height = this.currentR.y2 - this.currentR.y1
        }
    }
    resizeWidth(rect) {
        this.c.style.cursor = "w-resize";
        if (this.flag && this.operate == 0) { this.operate = 5; }
        if (this.flag && this.operate == 5) {
            if (!this.currentR) { this.currentR = rect }
            this.currentR.x2 = this.endX
            this.currentR.width = this.currentR.x2 - this.currentR.x1
        }
    }
    resizeHeight(rect) {
        this.c.style.cursor = "s-resize";
        if (this.flag && this.operate == 0) { this.operate = 6; }
        if (this.flag && this.operate == 6) {
            if (!this.currentR) { this.currentR = rect }
            this.currentR.y2 = this.endY
            this.currentR.height = this.currentR.y2 - this.currentR.y1
        }
    }
    resizeLT(rect) {
        this.c.style.cursor = "se-resize";
        if (this.flag && this.operate == 0) { this.operate = 7; }
        if (this.flag && this.operate == 7) {
            if (!this.currentR) { this.currentR = rect }
            this.currentR.x1 = this.endX
            this.currentR.y1 = this.endY
            this.currentR.height = this.currentR.y2 - this.currentR.y1
            this.currentR.width = this.currentR.x2 - this.currentR.x1
        }
    }
    resizeWH(rect) {
        this.c.style.cursor = "se-resize";
        if (this.flag && this.operate == 0) { this.operate = 8; }
        if (this.flag && this.operate == 8) {
            if (!this.currentR) { this.currentR = rect }
            this.currentR.x2 = this.endX
            this.currentR.y2 = this.endY
            this.currentR.height = this.currentR.y2 - this.currentR.y1
            this.currentR.width = this.currentR.x2 - this.currentR.x1
        }
    }
    resizeLH(rect) {
        this.c.style.cursor = "ne-resize";
        if (this.flag && this.operate == 0) { this.operate = 9; }
        if (this.flag && this.operate == 9) {
            if (!this.currentR) { this.currentR = rect }
            this.currentR.x1 = this.endX
            this.currentR.y2 = this.endY
            this.currentR.height = this.currentR.y2 - this.currentR.y1
            this.currentR.width = this.currentR.x2 - this.currentR.x1
        }
    }
    resizeWT(rect) {
        this.c.style.cursor = "ne-resize";
        if (this.flag && this.operate == 0) { this.operate = 10; }
        if (this.flag && this.operate == 10) {
            if (!this.currentR) { this.currentR = rect }
            this.currentR.x2 = this.endX
            this.currentR.y1 = this.endY
            this.currentR.height = this.currentR.y2 - this.currentR.y1
            this.currentR.width = this.currentR.x2 - this.currentR.x1
        }
    }
    // 计算鼠标位置，根据位置来拉框调整框线位置 end

    //获取文字宽, 高
    textSize = (fontSize,fontFamily,text) => {
        let span = document.createElement("span");
        let result = {};
        result.width = span.offsetWidth;
        result.height = span.offsetHeight;
        span.style.visibility = "hidden";
        span.style.fontSize = fontSize;
        span.style.fontFamily = fontFamily;
        span.style.display = "inline-block";
        document.body.appendChild(span);
        if(typeof span.textContent != "undefined"){
            span.textContent = text;
        }else{
            span.innerText = text;
        }
        result.width = parseFloat(window.getComputedStyle(span).width) - result.width;
        result.height = parseFloat(window.getComputedStyle(span).height) - result.height;
        return result;
    }

    // 文字
    drawText = (showText, x, y, width, bgColor='#22AA50') => {
        if (width > this.eleWidth / 12){
            width = this.eleWidth / 12
        }else if (width < this.eleWidth / 18) {
            width = this.eleWidth / 18
        }

        this.ctx.save();

        const size = 0.4*width;
        // const size = 20;
        // const size = 0.22*width;

        this.ctx.font = size + 'px Microsoft Yahei';

        // this.ctx.textAlign = 'center';
        this.ctx.textAlign = 'start';

        // if (this.state.rangeValue >= 55) {
        //   ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
        // }
        //
        // if (this.state.rangeValue < 55) {
        //   ctx.fillStyle = "rgba(06, 85, 128, 0.8)";
        // }

        if (showText !== -1){
            let textWidth = this.ctx.measureText("id:"+showText.toString()).width;
            let textHeight = this.ctx.measureText("1").width * 2;
            this.ctx.beginPath();
            this.ctx.lineWidth = 2;
            this.ctx.rect(x-1, y-textHeight, textWidth+2, textHeight);
            this.ctx.strokeStyle = bgColor;
            this.ctx.stroke();
            this.ctx.fillStyle = bgColor;
            this.ctx.fill();

            this.ctx.fillStyle = "rgba(255, 255, 255, 1)";

            // ctx.fillText(~~this.nowRange + 'h', r, r + size / 2);
            // ctx.fillText(this.state.showText, r, r + size / 2);

            this.ctx.fillText("id:"+showText.toString(), x, y);

            this.ctx.restore();
        }
    }

}

export default rectAngle