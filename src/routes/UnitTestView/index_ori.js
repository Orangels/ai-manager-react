import React from 'react'
import {
  Card, Popconfirm, Button, Icon, Table, Divider, BackTop, Affix, Anchor, Form, InputNumber, Input, Select,
  Cascader, Tag, Message, Tabs, Row, Col, Modal, Progress
} from 'antd'
import {toJS} from 'mobx'
import axios from 'axios'
import CustomBreadcrumb from '../../components/CustomBreadcrumb/index'
import {_fetch, transform_grade, getGrade, dateFormat, deepCopy, timestamp2Date, _GET, _POST} from '../../utils/utils'
import LoadableComponent from '../../utils/LoadableComponent'
import {inject, observer} from "mobx-react";
import {markMgtData, markMgtTemp, HOST, markMgtDataReID} from '../../utils/url_config'
import {isAuthenticated} from '../../utils/Session'
import './UnitTestView.less'
import CanvasRectComp from './CanvasRectComp.js'

// const CanvasRectComp = LoadableComponent(() => import('./CanvasRectComp.js'))

let local_url = HOST()

const FormItem = Form.Item

let marking_data = {
  "code": 0,
  "message": "OK",
  "data": {
    "complete_num": 0,
    "count": 42,
    "pic_list": [{
      "name": "P2_30_bot.png",
      "is_collection": false,
      "mark": [],
      "whd": {
        "width": 2880,
        "height": 960,
        "depth": 3
      },
      "pic_info": [],
      "path": "127.0.0.1:8000/dataset/2p_dataset/P2_30_bot.png",
      "id": "5f992744a539c4e26ddedaa6"
    }],
    "is_collection": false,
    "page_num": 1
  }
}

@Form.create()
class UnitTestView extends React.Component {
  // 构造
  constructor(props) {
    super(props);
    // 初始状态
    this.state = {
      modal_visible: false,
      user_name: '',
      checked: true,
      canvas_reid_0: {
        options: {
          layers: [],
          color: "#0000ff",
          transform: 100, // 缩放 0.1 、0.2 、0.3.... 1.0 、1.1  ... 2.0 ;步长0.1 范围 [0.1, 2.0]
          position: {
            top: 0,
            left: 0
          }
        },
        isDragging: false, // true: 拖拽状态; false: 画框线
        layersTemp: [],
        labeList: [],// 标注对象
        tagList: [], // 标签列表
        labelCreated: {
          value: [],
          option: [
            // { label: "", value: 122 }
          ]
        },
        currentImgData: {
          id: '',
          props: {
            // src: '',
            src: '127.0.0.1:8000/dataset/2p_dataset/P2_30_bot.png',
            name: '',
            width: 1280,
            height: 960,
            depth: 3,
            isCollection: false,
            domWidth: 0,
            domHeight: 0
          },
          labelChecked: [],
          tagChecked: []
        },
        temp_pic_info: [],//获取照片数据时候，后台标签信息暂存，保存时候再回传。后台逻辑是覆盖非update，所以
        refs: this.refs.canvasPanel
      },
      canvas_last_reid_0: {
        options: {
          layers: [],
          color: "#0000ff",
          transform: 100, // 缩放 0.1 、0.2 、0.3.... 1.0 、1.1  ... 2.0 ;步长0.1 范围 [0.1, 2.0]
          position: {
            top: 0,
            left: 0
          }
        },
        isDragging: false, // true: 拖拽状态; false: 画框线
        layersTemp: [],
        labeList: [],// 标注对象
        tagList: [], // 标签列表
        labelCreated: {
          value: [],
          option: [
            // { label: "", value: 122 }
          ]
        },
        currentImgData: {
          id: '',
          props: {
            // src: '',
            src: '127.0.0.1:8000/dataset/2p_dataset/P2_30_bot.png',
            name: '',
            width: 1280,
            height: 960,
            depth: 3,
            isCollection: false,
            domWidth: 0,
            domHeight: 0
          },
          labelChecked: [],
          tagChecked: []
        },
        temp_pic_info: [],//获取照片数据时候，后台标签信息暂存，保存时候再回传。后台逻辑是覆盖非update，所以
        refs: this.refs.canvasPanel_last_2p
      },
      canvas_last_reid_1: {
        options: {
          layers: [],
          color: "#0000ff",
          transform: 100, // 缩放 0.1 、0.2 、0.3.... 1.0 、1.1  ... 2.0 ;步长0.1 范围 [0.1, 2.0]
          position: {
            top: 0,
            left: 0
          }
        },
        isDragging: false, // true: 拖拽状态; false: 画框线
        layersTemp: [],
        labeList: [],// 标注对象
        tagList: [], // 标签列表
        labelCreated: {
          value: [],
          option: [
            // { label: "", value: 122 }
          ]
        },
        currentImgData: {
          id: '',
          props: {
            // src: '',
            src: '127.0.0.1:8000/dataset/2p_dataset/center_30.png',
            name: '',
            width: 1024,
            height: 1024,
            depth: 3,
            isCollection: false,
            domWidth: 0,
            domHeight: 0
          },
          labelChecked: [],
          tagChecked: []
        },
        temp_pic_info: [],//获取照片数据时候，后台标签信息暂存，保存时候再回传。后台逻辑是覆盖非update，所以
        refs: this.refs.canvasPanel_last_center
      },
      // options: {
      //   layers: [],
      //   color: "#0000ff",
      //   transform: 100, // 缩放 0.1 、0.2 、0.3.... 1.0 、1.1  ... 2.0 ;步长0.1 范围 [0.1, 2.0]
      //   position: {
      //     top: 0,
      //     left: 0
      //   }
      // },

      // isDragging: false, // true: 拖拽状态; false: 画框线
      // layersTemp: [],

      keyboardShow: false, //false : 快捷键展示面板
      active: "",
      labeList: [],// 标注对象
      tagList: [], // 标签列表
      // labelCreated: {
      //   value: [],
      //   option: [
      //     // { label: "", value: 122 }
      //   ]
      // },
      num: 1,
      theme: 'black',
      task_id: '', // 个人任务id
      data_id: '', // 数据集id
      mession_id: '', // 任务id
      is_collection: false, // 是否是收藏跳转过来的
      wholeVar: {
        total: 0,
        finished: 0,
        percentage: 0,
        currentIndex: 0,
        isCollection: false
      },
      // currentImgData: {
      //   id: '',
      //   props: {
      //     // src: '',
      //     src: '127.0.0.1:8000/dataset/2p_dataset/P2_30_bot.png',
      //     name: '',
      //     width: 1280,
      //     height: 960,
      //     depth: 3,
      //     isCollection: false,
      //     domWidth: 0,
      //     domHeight: 0
      //   },
      //   labelChecked: [],
      //   tagChecked: []
      // },
      // lastPerImgData: {
      //   id: '',
      //   props: {
      //     // src: '',
      //     src: '127.0.0.1:8000/dataset/2p_dataset/P2_30_bot.png',
      //     name: '',
      //     width: 1280,
      //     height: 960,
      //     depth: 3,
      //     isCollection: false,
      //     domWidth: 0,
      //     domHeight: 0
      //   },
      //   labelChecked: [],
      //   tagChecked: []
      // },
      // lastCenterImgData: {
      //   id: '',
      //   props: {
      //     // src: '',
      //     src: '127.0.0.1:8000/dataset/2p_dataset/center_30.png',
      //     name: '',
      //     width: 1024,
      //     height: 1024,
      //     depth: 3,
      //     isCollection: false,
      //     domWidth: 0,
      //     domHeight: 0
      //   },
      //   labelChecked: [],
      //   tagChecked: []
      // },
      // temp_pic_info: [],//获取照片数据时候，后台标签信息暂存，保存时候再回传。后台逻辑是覆盖非update，所以
      whellTime: null
    };

    this._getHerfRouterParams = this._getHerfRouterParams.bind(this)
    this._getImgList = this._getImgList.bind(this)
    this._getTemplate = this._getTemplate.bind(this)

    this.echoDraw = this.echoDraw.bind(this)
    this.echoTag = this.echoTag.bind(this)
    this.echoMark = this.echoMark.bind(this)
    this.updateLabelOpts = this.updateLabelOpts.bind(this)

    this._mouseup = this._mouseup.bind(this)
    this._mousedown = this._mousedown.bind(this)
    this._isDraggingChange = this._isDraggingChange.bind(this)
    // this._contextmenu = this._contextmenu.bind(this)
    // this.deleLayer = this.deleLayer.bind(this)
    this._initCanvasDom = this._initCanvasDom.bind(this)
    this._reUpdateLayers = this._reUpdateLayers.bind(this)

    this.prevPage = this.prevPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.saveInfo = this.saveInfo.bind(this)
    this.clearCanvas = this.clearCanvas.bind(this)
  }

  prevPage() {
    if (this.state.wholeVar.currentIndex <= 1) return;
    let wholeVar = deepCopy(this.state.wholeVar)
    wholeVar.currentIndex -= 1; // 请求下一页
    this.setState({
      wholeVar
    }, () => {
      this.clearCanvas();
      this._getImgList();
    })
  }

  nextPage(flag = 'next') {
    // 如果是当前表主页面：
    // 是从收藏按钮跳转进来的（this.is_collection == true): 如果当前是取消收藏状态，那么下一次请求数据仍然请求当前页码；
    // 如果是非收藏按钮跳转进来的 ： 那么请求下一次数据页码加一
    if (flag === 'save') {
      console.log('保存, 下一张')
      this.saveInfo(
        (res)=> {
          // console.log(this.wholeVar)
          if(this.state.wholeVar.currentIndex > (this.state.wholeVar.finished + 1)) return;
          if(!(this.is_collection && !this.canvas_reid_0.currentImgData.props.isCollection)){
            this.state.wholeVar.currentIndex += 1; // 请求下一页
            if(this.state.wholeVar.currentIndex > this.state.wholeVar.total){
              // this.$router.push({ path: "/task-center"});
              return;
            }
          }
          this.clearCanvas();
          this._getImgList();
        }
      )
    } else {

      let wholeVar = deepCopy(this.state.wholeVar)
      wholeVar.currentIndex += 1; // 请求下一页

      if (this.state.wholeVar.currentIndex > this.state.wholeVar.finished) return;
      if (!(this.state.is_collection && !this.state.currentImgData.props.isCollection)) {
        if (wholeVar.currentIndex > wholeVar.total) {
          // this.$router.push({ path: "/task-center"});
          Message.info("已经是最后一张了")
          return;
        }
      }

      this.setState({
        wholeVar: wholeVar
      }, () => {
        this.clearCanvas();
        this._getImgList();
      })

    }
  }

  // 保存
  saveInfo(callback) {
    let tempLayers = this.refs.canvasPanel.state.canvasRectObj.layers;

    // 标注信息
    let mark_info   = [];
    let domWidth    = this.state.canvas_reid_0.currentImgData.props.domWidth;
    let domHeight   = this.state.canvas_reid_0.currentImgData.props.domHeight;
    let imgWidth    = this.state.canvas_reid_0.currentImgData.props.width;
    let imgHeight   = this.state.canvas_reid_0.currentImgData.props.height;

    for (let i = 0; i < tempLayers.length; i++) {
      if(tempLayers[i].drawType === "rect"){
        mark_info.push({
          key:  tempLayers[i].labelOpt.id,
          name: tempLayers[i].labelOpt.name,
          tool: tempLayers[i].labelOpt.type,
          color: tempLayers[i].strokeStyle,
          coordinate: [
            {
              x: Math.floor((tempLayers[i].x1 * imgWidth)/domWidth),
              y: Math.floor((tempLayers[i].y1 * imgHeight)/domHeight)
            }, {
              x: Math.floor((tempLayers[i].x2 * imgWidth)/domWidth),
              y: Math.floor((tempLayers[i].y2 * imgHeight)/domHeight)
            }
          ],
          id: tempLayers[i].id
        });
      }else{
        mark_info.push({
          key:  tempLayers[i].labelOpt.id,
          name: tempLayers[i].labelOpt.name,
          tool: tempLayers[i].labelOpt.type,
          color: tempLayers[i].strokeStyle,
          coordinate: [
            {
              x: Math.floor((tempLayers[i].polarData[0].x * imgWidth)/domWidth),
              y: Math.floor((tempLayers[i].polarData[0].y * imgHeight)/domHeight)
            }, {
              x: Math.floor((tempLayers[i].polarData[1].x * imgWidth)/domWidth),
              y: Math.floor((tempLayers[i].polarData[1].y * imgHeight)/domHeight)
            }, {
              x: Math.floor((tempLayers[i].polarData[2].x * imgWidth)/domWidth),
              y: Math.floor((tempLayers[i].polarData[2].y * imgHeight)/domHeight)
            }, {
              x: Math.floor((tempLayers[i].polarData[3].x * imgWidth)/domWidth),
              y: Math.floor((tempLayers[i].polarData[3].y * imgHeight)/domHeight)
            }
          ]
        });
      }
    }
    // 标签信息
    let pic_info = []; let tag_id_arr = [];

    let params = {
      pic_id:     this.state.canvas_reid_0.currentImgData.id,
      data_id:    this.state.data_id,
      mession_id: this.state.mession_id,
      mark_info:  mark_info,
      pic_info:   pic_info,
      user_name: this.state.user_name
    };
    console.log(params)
    _fetch(local_url + markMgtDataReID, params, (res) => {
      if (res.code == 0) {
        if(callback) callback();

      } else {
        Message.error('保存数据失败')
      }
    })
  }

  _initCanvasDom(flag) {
    // let app = document.getElementById('app').clientHeight;
    let app = document.documentElement.clientHeight
    document.getElementsByClassName('UnitTestView')[0].style.height = app + 'px';//初始化高度

    if (!this.state.canvas_reid_0.currentImgData.props.src) return;

    let ww = document.getElementsByClassName('anno-r-content')[0].clientWidth;
    let hh = document.getElementsByClassName('anno-r-content')[0].clientHeight;

    let ww_canvas_last_reid_0 = document.getElementById('canvas_img_id_last_2p').clientWidth;
    let hh_canvas_last_reid_0 = document.getElementById('canvas_img_id_last_2p').clientHeight;

    console.log(ww_canvas_last_reid_0)
    console.log(hh_canvas_last_reid_0)


    // 以高为准，计算宽度是否超出当前屏幕
    let _ww = ((hh - 40) * this.state.canvas_reid_0.currentImgData.props.width) / this.state.canvas_reid_0.currentImgData.props.height;
    let _hh = hh - 40;

    if (_ww > (ww - 40)) { //超出，则以宽度为准计算当前图片大小
      console.log("超出 **********")
      _ww = (ww - 40);
      _hh = ((ww - 40) * this.state.canvas_reid_0.currentImgData.props.height) / this.state.canvas_reid_0.currentImgData.props.width;

    }
    // let _ww = (hh * this.currentImgData.props.width)/this.currentImgData.props.height;
    // let _hh = hh;
    // if (_ww > ww) { //超出，则以宽度为准计算当前图片大小
    //     _ww = ww;
    //     _hh = (ww * this.currentImgData.props.height)/this.currentImgData.props.width;
    // }
    // let _ww = ((hh-44) * this.currentImgData.props.width)/this.currentImgData.props.height;
    // let _hh = hh;
    // if (_ww > ww) { //超出，则以宽度为准计算当前图片大小
    //     _ww = ww;
    //     _hh = ((ww-44) * this.currentImgData.props.height)/this.currentImgData.props.width;
    // }
    //

    let canvas_reid_0 = deepCopy(this.state.canvas_reid_0);
    let canvas_last_reid_0 = deepCopy(this.state.canvas_last_reid_0);

    canvas_reid_0.currentImgData.props.domWidth = _ww
    canvas_reid_0.currentImgData.props.domHeight = _hh

    canvas_last_reid_0.currentImgData.props.domWidth = ww_canvas_last_reid_0
    canvas_last_reid_0.currentImgData.props.domHeight = hh_canvas_last_reid_0

    // 还有更新已经回显的 框线以及点坐标
    if (flag !== 'init') this._reUpdateLayers();

    canvas_reid_0.options.position = {
      top: 0,
      left: 0
    }
    this.setState({
      canvas_reid_0,
      canvas_last_reid_0
    })
  }

  _reUpdateLayers() {
    let layers = [];
    let canvas_reid_0 = this.state.canvas_reid_0
    let domWidth = this.state.canvas_reid_0.currentImgData.props.domWidth;
    let domHeight = this.state.canvas_reid_0.currentImgData.props.domHeight;

    console.log(domHeight)

    let imgWidth = this.state.canvas_reid_0.currentImgData.props.width;
    let imgHeight = this.state.canvas_reid_0.currentImgData.props.height;
    let layersTemp = this.state.canvas_reid_0.layersTemp
    for (let i = 0; i < canvas_reid_0.layersTemp.length; i++) {
      canvas_reid_0.layersTemp[i].x1 = (layersTemp[i].x1 * domWidth) / imgWidth;
      canvas_reid_0.layersTemp[i].x2 = (layersTemp[i].x2 * domWidth) / imgWidth;
      canvas_reid_0.layersTemp[i].y1 = (layersTemp[i].y1 * domHeight) / imgHeight;
      canvas_reid_0.layersTemp[i].y2 = (layersTemp[i].y2 * domHeight) / imgHeight;
      canvas_reid_0.layersTemp[i].width = Math.abs(layersTemp[i].x1 - layersTemp[i].x2);
      canvas_reid_0.layersTemp[i].height = Math.abs(layersTemp[i].y1 - layersTemp[i].y2);

      layers.push(canvas_reid_0.layersTemp[i]);
    }

    this.setState({
      canvas_reid_0: canvas_reid_0
    }, ()=>{
      // let _this = this;
      // async function fn() {
      //   await _this.refs.canvasPanel.clearCanvas();
      //   // await _this.$set(_this.options, "layers", JSON.parse(JSON.stringify(layers)));
      //   await _this.refs.canvasPanel.reshowCanvas();
      // }
      // fn();
    })
  }

  _getHerfRouterParams() {
    let routerParams = window.location.search
    let params = {}
    if (routerParams.indexOf("?") != -1) {
      let str = routerParams.substr(1)
      let strs = str.split("&")
      for (let i = 0; i < strs.length; i++) {
        params[strs[i].split("=")[0]] = strs[i].split("=")[1]
      }
    }
    return params
  }

  // 获取照片数据
  _getImgList() {
    let cache_num = 0
    let params = {
      personal_mession_id: this.state.task_id, // 个人任务id
      is_collection: this.state.is_collection, // 是否是收藏跳转过来的
      pic_num: this.state.wholeVar.currentIndex, // 获取第几张图片 0: 首次进来，取未标注的第一条
      cache_num: cache_num, // 要缓存数量 0 ：一张   1：三条
      user_name: this.state.user_name
    };

    _GET(local_url + markMgtDataReID, params, (json) => {
      console.log(json)

      if (json.code == 0) {
        let res = json.data;
        // console.log("数据：", res)
        if (!res.is_collection && (res.count === res.complete_num)) {
          return;
        }
        //
        let wholeVar = {
          total: res.count,
          finished: res.complete_num,
          percentage: Math.round(res.complete_num * 100 / res.count),
          currentIndex: res.page_num,
          isCollection: res.is_collection
        }
        //
        let picList = res.pic_list[cache_num + 1];
        let lastPerImgData_picList = res.pic_list[cache_num];

        let lastPerImgData = {
          id: lastPerImgData_picList.id,
          props: {
            src: lastPerImgData_picList.path,
            name: lastPerImgData_picList.name,
            width: lastPerImgData_picList.whd.width,
            height: lastPerImgData_picList.whd.height,
            depth: lastPerImgData_picList.whd.depth,
            isCollection: lastPerImgData_picList.is_collection,
            domWidth: 0,
            domHeight: 0
          },
          labelChecked: lastPerImgData_picList.mark,
          tagChecked: lastPerImgData_picList.pic_info
        }


        let currentImgData = {
          id: picList.id,
          props: {
            src: picList.path,
            name: picList.name,
            width: picList.whd.width,
            height: picList.whd.height,
            depth: picList.whd.depth,
            isCollection: picList.is_collection,
            domWidth: 0,
            domHeight: 0
          },
          labelChecked: picList.mark,
          tagChecked: picList.pic_info
        }

        let canvas_reid_0 = deepCopy(this.state.canvas_reid_0)
        let canvas_last_reid_0 = deepCopy(this.state.canvas_last_reid_0)
        canvas_reid_0.currentImgData = currentImgData
        canvas_last_reid_0.currentImgData = lastPerImgData

        this.setState({
          canvas_reid_0: canvas_reid_0,
          canvas_last_reid_0: canvas_last_reid_0,
          wholeVar: wholeVar
        }, () => {
          // console.log(this.state.canvas_reid_0.currentImgData)
          this._initCanvasDom('init');
          setTimeout(() => {
            this.echoDraw()
          }, 500);
        })
      } else {
        Message.warning("照片数据查询失败!");
      }
    })

    // this._initCanvasDom('init');
  }

  // 获取模板数据
  _getTemplate() {
    let params = {
      personal_mession_id: this.state.task_id,
      user_name: this.state.user_name
    };

    _GET(local_url + markMgtTemp, params, (json) => {
      console.log(json)
      let res = json;
      if (res.code == 0) {
        // 1
        let element_tag_list = res.data.element_tag_list; // 标注对象
        let labeList = [];
        for (let i = 0; i < element_tag_list.length; i++) {
          labeList.push({
            id: element_tag_list[i].key,
            name: element_tag_list[i].name,
            type: element_tag_list[i].tool,
            color: element_tag_list[i].color
          })
        }
        // 1
        // 2
        let pic_tag_list = res.data.pic_tag_list; // 标签
        let tagList = [];
        for (let i = 0; i < pic_tag_list.length; i++) {
          tagList.push({
            tag_id: pic_tag_list[i].key,
            tag_name: pic_tag_list[i].name,
            operation: pic_tag_list[i].operation,
            tag_option: pic_tag_list[i].option_list,
            tag_selected: [],
          })
        }
        this.setState({
          labeList,
          tagList
        }, () => {
          console.log(this.state.labeList)
        })

        // 2
        // this.$message({ type: "success", message: "模板查询成功!" });
      } else {
        Message.warning('模板查询失败!')
      }


    })
  }

  clearCanvas() {
    // 清空canvas划线
    this.refs.canvasPanel.clearCanvas();
    // 清空临时存储layers

    let state_canvas_arr = [deepCopy(this.state.canvas_reid_0), deepCopy(this.state.canvas_last_reid_0), deepCopy(this.state.canvas_last_reid_0)]

    state_canvas_arr.forEach((value, index)=>{
      value.layersTemp = [];
      // 清空下拉选择内容
      value.labelCreated.value  = [];
      value.labelCreated.option = [];
      value.options.transform = 100;
    })
    this.setState({
      canvas_reid_0:state_canvas_arr[0],
      canvas_last_reid_0:state_canvas_arr[1],
      canvas_last_reid_1:state_canvas_arr[2],
    })
  }

  // 回显
  echoDraw() {

    let canvas_reid_0 = deepCopy(this.state.canvas_reid_0)
    let canvas_last_reid_0 = deepCopy(this.state.canvas_last_reid_0)

    this.echoTag();
    this.echoMark(canvas_reid_0, 0);
    this.echoMark(canvas_last_reid_0, 1);
  }

  // 标注标签回显
  echoTag() {
    let nowHasTagArray = [];
    let tagcheck = deepCopy(this.state.canvas_reid_0.currentImgData.tagChecked);
    let tagList = deepCopy(this.state.tagList)
    let canvas_reid_0 = deepCopy(this.state.canvas_reid_0)
    for (let i = 0; i < tagList.length; i++) {
      for (let j = 0; j < tagcheck.length; j++) {
        if (this.state.tagList[i].tag_id === tagcheck[j].key) {
          if (tagList[i].operation === 'single') {
            tagList[i].tag_selected = tagcheck[j].value[0];
          } else {
            tagList[i].tag_selected = tagcheck[j].value;
          }
          nowHasTagArray.push(tagcheck[j].key);
        }
      }
    }
    // 找出当前模板标签 没有的标签数据，暂存起来，保存回传给后台
    let temp_pic_info = [];
    for (let i = 0; i < tagcheck.length; i++) {
      if (nowHasTagArray.indexOf(tagcheck[i].key) == -1) {
        temp_pic_info.push(tagcheck[i]);
      }
    }
    canvas_reid_0.temp_pic_info = temp_pic_info
    this.setState({
      tagList: tagList,
      canvas_reid_0: canvas_reid_0
    })
  }

  // 标注框回显
  echoMark(canvas_params, tag=0) {

    let state_tag = ['canvas_reid_0', 'canvas_last_reid_0', 'canvas_last_reid_1'];

    let refsArr = [this.refs.canvasPanel, this.refs.canvasPanel_last_2p, this.refs.canvasPanel_last_center]

    let opts = canvas_params.currentImgData.labelChecked;
    console.log(opts)
    let labelCreated = canvas_params.labelCreated;
    let num = this.state.num;
    let layers = [];
    let domWidth = canvas_params.currentImgData.props.domWidth;
    let domHeight = canvas_params.currentImgData.props.domHeight;

    console.log(domWidth)
    console.log(domHeight)

    let imgWidth = canvas_params.currentImgData.props.width;
    let imgHeight = canvas_params.currentImgData.props.height;
    for (let i = 0; i < opts.length; i++) {
      let idx = opts[i].key + "_" + Math.ceil(Math.random() * 10e10);
      if (opts[i].tag_tool === "bndbox") {
        let x1 = (opts[i].coordinate[0].x * domWidth) / imgWidth;
        let x2 = (opts[i].coordinate[1].x * domWidth) / imgWidth;
        let y1 = (opts[i].coordinate[0].y * domHeight) / imgHeight;
        let y2 = (opts[i].coordinate[1].y * domHeight) / imgHeight;
        layers.push({
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          id: opts[i].idNum || -2,
          width: Math.abs(x1 - x2),
          height: Math.abs(y1 - y2),
          strokeStyle: opts[i].color,
          drawType: "rect",
          labelOpt: {
            id: opts[i].key,
            name: opts[i].tag_name,
            type: opts[i].tag_tool,
            idx: idx
          }
        })
      } else {
        let coords = opts[i].coordinate;
        let Xs = [], Ys = [];
        for (let i = 0; i < coords.length; i++) {
          coords[i].x = (coords[i].x * domWidth) / imgWidth;
          coords[i].y = (coords[i].y * domHeight) / imgHeight;
          Xs.push(coords[i].x);
          Ys.push(coords[i].y);
        }
        let x1 = Math.min.apply(null, Xs);
        let x2 = Math.max.apply(null, Xs);
        let y1 = Math.min.apply(null, Ys);
        let y2 = Math.max.apply(null, Ys);
        layers.push({
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          width: Math.abs(x1 - x2),
          height: Math.abs(y1 - y2),
          strokeStyle: opts[i].color,
          drawType: "polar",
          polarData: coords,
          labelOpt: {
            id: opts[i].key,
            name: opts[i].tag_name,
            type: opts[i].tag_tool,
            idx: idx
          }
        })
      }

      labelCreated.value.push(idx); // 添加下拉选项
      num += 1;
    }
    let layersTemp = JSON.parse(JSON.stringify(layers));

    canvas_params.options.layers = deepCopy(JSON.parse(JSON.stringify(layers)))
    console.log(layersTemp)
    this.setState({
      num: num,
      [state_tag[tag]]: canvas_params
    }, () => {
      setTimeout(() => {
        refsArr[tag].echoRectangle();
        this.updateLabelOpts();
      }, 0);
    })

  }

  updateLabelOpts() {

  }

  componentDidMount() {

    let mark_router_data = this._getHerfRouterParams();

    let task_id = mark_router_data.id || "";
    let data_id = mark_router_data.data_id || "";
    let mession_id = mark_router_data.mession_id || "";
    let is_collection = mark_router_data.is_collection === "false" ? false : true;
    let user_name = mark_router_data.user_name || ""

    this.setState({
      task_id,
      data_id,
      mession_id,
      is_collection,
      user_name,
    }, () => {
      // console.log(this.state.currentImgData)
      let _this = this

      async function fn() {
        await _this._getTemplate();
        await _this._getImgList();
      }

      fn()

      // this._initCanvasDom('init');
    })

    // let picList = marking_data.data.pic_list[0];
    // let currentImgData = {
    //   id: picList.id,
    //   props: {
    //     src: picList.path,
    //     name: picList.name,
    //     width: picList.whd.width,
    //     height: picList.whd.height,
    //     depth: picList.whd.depth,
    //     isCollection: picList.is_collection,
    //     domWidth: 0,
    //     domHeight: 0
    //   },
    //   labelChecked: picList.mark,
    //   tagChecked: picList.pic_info
    // }
    // this.setState({
    //   currentImgData: currentImgData
    // }, () => {
    //   console.log(this.state.currentImgData)
    //   this._initCanvasDom('init');
    // })
  }

  componentWillUnmount() {
  }

  _mouseup(e) {
    let drawType = this.refs.canvasPanel.canvasRectObj.drawType;
    if (drawType === "polar") return; // 如果当前是 极点模式那么禁止直行其他操作，等待矩形绘制完成

    if (this.isDragging) {
      // 如果是拖拽，那么更新临时layers；
      // 对比 当前显示的框 中 数据发生改变的 框id；替换相应的框位置数据
      this.updateTempLayers();
    } else {
      //判断是否是画框
      let newVal = this.refs.canvasPanel.canvasRectObj.layers;
      let optLayers = this.options.layers;
      if (newVal.length !== optLayers.length) {
        // 如果新建，那么添加新的layer
        this.addLabelCreated();
      }
    }
    // 清空label的选择状态
    setTimeout(() => {
      this.active = "";
    }, 0);
  }

  _mousedown(e) {
    // console.log(e)
    let newVal = this.refs.canvasPanel.state.canvasRectObj.layers;
    if(!newVal.length) return;
    this.rectInLayer = [];
    newVal.forEach((item, index)=>{
      let x_in = e.offsetX >= item.x1 && e.offsetX <= item.x2;
      let y_in = e.offsetY >= item.y1 && e.offsetY <= item.y2;
      if(x_in && y_in){
        this.rectInLayer.push(item);
      }
    })
    if(this.rectInLayer.length == 1){
      console.log(this.rectInLayer[0])
      this.setState({
        modal_visible: true
      }, ()=>{
        let ReID_input = document.getElementsByClassName('ReID_input')[0]
        if (ReID_input){
          setTimeout(()=>{
            ReID_input.focus()
            ReID_input.select()
          }, 100)
        }
      })
    }else{
      return;
    }
  }

  _isDraggingChange(e) {
    this.setState({
      isDragging: e
    })
  }

  // _contextmenu(e) {
  //     let newVal = this.refs.canvasPanel.state.canvasRectObj.layers;
  //     if(!newVal.length) return;
  //     let rectInLayer = [];
  //     newVal.forEach((item, index)=>{
  //         let x_in = e.offsetX >= item.x1 && e.offsetX <= item.x2;
  //         let y_in = e.offsetY >= item.y1 && e.offsetY <= item.y2;
  //         if(x_in && y_in){
  //             rectInLayer.push(item);
  //         }
  //     })
  //     if(rectInLayer.length == 1){
  //         console.log(rectInLayer[0])
  //     }else{
  //         return;
  //     }
  // }

  handleSubmit = e => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        console.log(err)
        Message.warning('请先填写正确的表单')
      } else {
        let { id } = values
        // 更新 reid 逻辑
        console.log(`id 为 ${id}`)

        //更新 id
        let newVal = this.refs.canvasPanel.state.canvasRectObj.layers;
        if(!newVal.length) return;
        newVal.forEach((item, index)=>{
          if (this.rectInLayer[0].labelOpt.idx === item.labelOpt.idx){
            item.id = parseInt(id)
          }
        })
        let canvas_reid_0 = deepCopy(this.state.canvas_reid_0)
        canvas_reid_0.options.layers = newVal;
        this.setState({
          modal_visible: false,
          canvas_reid_0: canvas_reid_0
        }, ()=>{
          this.refs.canvasPanel.echoRectangle()
        });
      }
    });

    e.preventDefault();
  }

  handleOk = e => {
    this.handleSubmit(e)
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      modal_visible: false,
    });
  };

  render() {

    const {getFieldDecorator, getFieldValue} = this.props.form
    const formItemLayout = {
      labelCol: {
        xs: {span: 24},
        sm: {span: 4},
      },
      wrapperCol: {
        xs: {span: 24},
        sm: {span: 12},
      },
    };

    return (
      <Row className="UnitTestView">
        <Modal
          title="ID"
          visible={this.state.modal_visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          ref = {refs=>this.modal = refs}
        >
          <Form layout='horizontal' style={{margin: '0 auto'}} onSubmit={this.handleSubmit}>
            <FormItem label='id: ' {...formItemLayout}>
              {
                getFieldDecorator('id', {
                  initialValue:"",
                  rules: [
                    {
                      pattern: /^\d+$/,
                      required: true,
                      message: '请输入正确的id (数字)'
                    }
                  ]
                })(
                  <Input className={'ReID_input'} autofocus="autoFocus" />
                )
              }
            </FormItem>
          </Form>
        </Modal>
        <Col span={3} style={{
          backgroundColor: '#303336',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <Row gutter={16} style={{marginTop: 20}}>
            <Col span={12} style={{
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Icon className={this.state.wholeVar.currentIndex <= 1 ? 'disabled' : ''} type="left-circle" theme="filled" style={{
                fontSize: '24px',
                color: '#08c'
              }} onClick={this.prevPage}/>
            </Col>
            <Col span={12} style={{
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Icon className={this.state.wholeVar.currentIndex >= this.state.wholeVar.total ? 'disabled' : ''} type="right-circle" theme="filled" style={{
                fontSize: '24px',
                color: '#08c'
              }} onClick={this.nextPage.bind(this, 'save')}/>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={22} style={{
              display: 'flex',
              justifyContent: 'center',
              color:'white'
            }}>
              {`${this.state.wholeVar.finished} /  ${this.state.wholeVar.total}`}
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={22} type="flex" justify="center" style={{
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Progress percent={this.state.wholeVar.percentage} />
            </Col>
          </Row>
          <Row gutter={16} style={{marginTop: 20}}>
            <Col span={12} style={{
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Icon className={this.state.wholeVar.currentIndex <= 1 ? 'disabled' : ''} type="left-circle" theme="filled" style={{
                fontSize: '24px',
                color: '#08c'
              }} onClick={this.prevPage}/>
            </Col>
            <Col span={12} style={{
              display: 'flex',
              justifyContent: 'center'
            }}>
              <Icon className={this.state.wholeVar.currentIndex > this.state.wholeVar.finished ? 'disabled' : ''} type="right-circle" theme="filled" style={{
                fontSize: '24px',
                color: '#08c'
              }} onClick={this.nextPage}/>
            </Col>
          </Row>
          <Row type="flex" justify="center">
            <Col span={22} style={{
              display: 'flex',
              justifyContent: 'center',
              color:'white'
            }}>
              {`${this.state.wholeVar.currentIndex} / ${this.state.wholeVar.finished+1}`}
            </Col>
          </Row>
        </Col>
        <Col className="anno-r-content" span={21} style={{
          height: '100%',
          backgroundColor: '#222426'
        }}>
          <Row style={{height: '50%'}} gutter={16} type="flex" align="middle">
            <Col className={'last_2p'} span={18}>
              <CanvasRectComp
                ref="canvasPanel_last_2p"
                canvas_rect_id="canvasPanel_last_2p_rect"
                optlayers={this.state.canvas_last_reid_0.options.layers}
                optcolor={this.state.canvas_last_reid_0.options.color}
                trans={this.state.canvas_last_reid_0.options.transform}
                position={this.state.canvas_last_reid_0.options.position}
                canvasmouseFunc={false}
                canvasmouseup={()=>{}}
                canvasmousedown={()=>{}}
                changeIsDragging={this._isDraggingChange}
                // canvascontextmenu={this._contextmenu}
              >
                <img id="canvas_img_id_last_2p" style={{
                  // width: this.state.currentImgData.props.domWidth
                  width: "100%"
                }} src={`//${this.state.canvas_last_reid_0.currentImgData.props.src}`}/>
              </CanvasRectComp>
            </Col>
            <Col className={'last_center'} span={6} style={{
              display: 'flex',
              justifyContent: 'center',
              alignment: 'center'
            }}>
              <CanvasRectComp
                ref="canvasPanel_last_center"
                canvas_rect_id="canvasPanel_last_center_rect"
                optlayers={this.state.canvas_last_reid_1.options.layers}
                optcolor={this.state.canvas_last_reid_1.options.color}
                trans={this.state.canvas_last_reid_1.options.transform}
                position={this.state.canvas_last_reid_1.options.position}
                canvasmouseFunc={false}
                canvasmouseup={()=>{}}
                canvasmousedown={()=>{}}
                changeIsDragging={this._isDraggingChange}
                // canvascontextmenu={this._contextmenu}
              >
                <img id="canvas_img_id_last_center" style={{
                  // width: this.state.currentImgData.props.domWidth
                  width: "100%"
                }} src={`//${this.state.canvas_last_reid_1.currentImgData.props.src}`}/>
              </CanvasRectComp>
            </Col>
          </Row>

          <CanvasRectComp
            ref="canvasPanel"
            canvas_rect_id="canvasPanel_rect"
            optlayers={this.state.canvas_reid_0.options.layers}
            optcolor={this.state.canvas_reid_0.options.color}
            trans={this.state.canvas_reid_0.options.transform}
            position={this.state.canvas_reid_0.options.position}
            canvasmouseFunc={true}
            // canvasmouseup={this._mouseup}
            canvasmousedown={this._mousedown}
            changeIsDragging={this._isDraggingChange}
            canvascontextmenu={this._contextmenu}
          >
            <img id="canvas_img_id" style={{
              width: this.state.canvas_reid_0.currentImgData.props.domWidth
            }} src={`//${this.state.canvas_reid_0.currentImgData.props.src}`}/>
          </CanvasRectComp>
        </Col>
      </Row>
    )
  }
}

export default UnitTestView;