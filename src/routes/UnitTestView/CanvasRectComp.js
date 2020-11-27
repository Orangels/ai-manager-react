import {
    Card, Popconfirm, Button, Icon, Table, Divider, BackTop, Affix, Anchor, Form, InputNumber, Input, Select,
    Cascader, Tag, message, Tabs
} from 'antd'
import { toJS } from 'mobx'
import axios from 'axios'
import CustomBreadcrumb from '../../components/CustomBreadcrumb/index'
import {_fetch, transform_grade, getGrade, dateFormat, deepCopy, timestamp2Date, _GET} from '../../utils/utils'
import LoadableComponent from '../../utils/LoadableComponent'
import {inject, observer} from "mobx-react";
import { PERSONALMESSIONLIST, HOST } from '../../utils/url_config'
import { isAuthenticated } from '../../utils/Session'
import rectAngle from './canvas-rect'
import React, {Component} from "react";

export default class CanvasRectComp extends Component{
    constructor(props) {
        super(props);
        this.state = {
            mouseoverOpts:{
                TooltipShow: false,
                top:0,
                left:0,
                text:''
            },
            layers: [],
            canvasRectObj: new rectAngle(),
            ctx_l: null,
            transform: "scale(1)",
            drawType: "rect",
            top: 0,
            left: 0
        }
        this.echoRectangle = this.echoRectangle.bind(this)
        this.startCreate = this.startCreate.bind(this)
        this.init = this.init.bind(this)
        this.canvasMouseLeave = this.canvasMouseLeave.bind(this)
        this.canvasMouseEnter = this.canvasMouseEnter.bind(this)
        this.canvasContextMenu = this.canvasContextMenu.bind(this)
        this.canvasMouseDown = this.canvasMouseDown.bind(this)
        this.canvasMouseMove = this.canvasMouseMove.bind(this)
        this.clearCanvas = this.clearCanvas.bind(this)
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let { optlayers, optcolor, trans, position } = nextProps

        // console.log(optlayers)

         let transform = trans ? `scale(${trans / 100})` : "scale(1)"

        this.state.canvasRectObj.layers = JSON.parse(
          JSON.stringify(optlayers)
        );
        this.state.canvasRectObj.lineColor = optcolor;

        this.setState({
            layers:optlayers,
            transform: transform,
            left:position.left,
            top:position.top
        })

    }

    init() {
        let w = this.refs.canvas_rect.offsetWidth;
        let h = this.refs.canvas_rect.offsetHeight;
        let canvasRectObj = this.state.canvasRectObj
        canvasRectObj.$init(this.props.canvas_rect_id, w, h);
        this.canvasMouseLeave();
        this.canvasMouseEnter();
    }

    canvasMouseLeave() {
        let canvasRectObj = this.state.canvasRectObj
        canvasRectObj.c.onmouseleave = () => {
            this.state.canvasRectObj.c.onmousedown = null;
            this.state.canvasRectObj.c.onmousemove = null;
            this.state.canvasRectObj.c.onmouseup = null;
            this.state.canvasRectObj.c.oncontextmenu = null;
        };
    }

    canvasMouseEnter() {
        let canvasRectObj = this.state.canvasRectObj
        canvasRectObj.c.onmouseenter = () => {
            this.state.canvasRectObj.c.onmousedown = this.canvasMouseDown;
            this.state.canvasRectObj.c.onmousemove = this.canvasMouseMove;
            // this.state.canvasRectObj.c.onmouseup = this.canvasMouseUp;
            this.state.canvasRectObj.c.oncontextmenu = this.canvasContextMenu;
        };
    }

    canvasMouseDown(e) {
        if (this.props.canvasmouseFunc){
            if (this.state.drawType === "rect") {
                this.state.canvasRectObj.mousedown(e);
            }
            else {
                this.state.canvasRectObj.mousedown_polar(e);
            }
            // this.$emit("canvasmousedown", e);
            this.props.canvasmousedown(e)
        }
    }

    canvasMouseMove(e) {
        if (this.state.drawType === "rect") {
            this.state.canvasRectObj.mousemove(e, this);
            if (this.props.mousemoveRootMap || false){
                // console.log(this.state.mouseoverOpts.text)
                this.props.canvasMouseMove(Number(this.state.mouseoverOpts.text))
            }
        } else {
            this.canvasRectObj.mousemove_polar(e);
        }
        // this.$emit("canvasmousemove", e);
    }

    canvasMouseUp(e) {
        if (this.drawType === "rect") {
            this.canvasRectObj.mouseup(e);
        } else {
            this.canvasRectObj.mouseup_polar(e);
        }
        this.$emit("canvasmouseup", e);

        // 拖拽生成框 完成后 操作
        this.turnToDrag(); //改变为拖拽状态
    }

    canvasContextMenu(e) {
        // this.$emit("canvascontextmenu", e);

        if (this.props.canvascontextmenu){
            this.props.canvascontextmenu(e)
        }
        e.preventDefault();
    }

    // 回显数据
    echoRectangle() {
        // this.init();
        // let canvasRectObj = this.state.canvasRectObj
        // console.log(JSON.parse(JSON.stringify(this.state.layers)))
        // canvasRectObj.clear();
        // canvasRectObj.layers = JSON.parse(JSON.stringify(this.state.layers));
        // canvasRectObj.reshow();
        // this.startCreate(true);

        this.init();
        this.state.canvasRectObj.clear();
        this.state.canvasRectObj.layers = JSON.parse(JSON.stringify(this.state.layers));
        this.state.canvasRectObj.reshow();
        this.startCreate(true);
    }

    // 复位---清空当前所有划线
    clearCanvas() {
        this.state.canvasRectObj.clear();
    }

    reshowCanvas() {
        this.state.canvasRectObj.layers = JSON.parse(JSON.stringify(this.state.layers));
        this.state.canvasRectObj.reshow();
    }

    // 开始拖拽-- 划线装态
    startCreate(flag) {
        this.state.canvasRectObj.dragging = flag; // false:划线状态; true:拖拽状态
    }

    render() {
        let props = this.props;

        return (
            <div
                className="canvas-panel"
                ref="canvas_panel"
                style={{
                    transform: this.state.transform,
                    top: this.state.top,
                    left:this.state.left
                }}
            >
                {props.children}
                <Tag color={'#0AA0AA'} style={{
                    position: 'absolute',
                    top:this.state.mouseoverOpts.top,
                    left:this.state.mouseoverOpts.left,
                    display: this.state.mouseoverOpts.TooltipShow ? 'inline' : 'none',
                    zIndex: 99,
                    fontSize:20
                }}>
                    {`id:${this.state.mouseoverOpts.text}`}
                </Tag>
                <canvas className="canvas_rect" id={this.props.canvas_rect_id} ref="canvas_rect"></canvas>
                <canvas id="canvas_subline" ref="canvas_subline"></canvas>
            </div>
        )
    }

}