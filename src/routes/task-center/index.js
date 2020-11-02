import React from 'react'
import {
    Card, Popconfirm, Button, Icon, Table, Divider, BackTop, Affix, Anchor, Form, InputNumber, Input, Select,
    Cascader, Tag, Message, Tabs
} from 'antd'
import { toJS } from 'mobx'
import axios from 'axios'
import CustomBreadcrumb from '../../components/CustomBreadcrumb/index'
import {_fetch, transform_grade, getGrade, dateFormat, deepCopy, timestamp2Date, _GET} from '../../utils/utils'
import LoadableComponent from '../../utils/LoadableComponent'
import {inject, observer} from "mobx-react";
import { PERSONALMESSIONLIST, HOST } from '../../utils/url_config'
import { isAuthenticated } from '../../utils/Session'

let local_url = HOST()


@inject('appStore') @observer
class TaskCenter extends React.Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            filteredInfo: null,
            data:[]
        };
        this._initData = this._initData.bind(this)
    }

    componentDidMount() {

            let params = {
                user_name: isAuthenticated(),
                status:'',
                page_num:1,
                num:10
            }
            _GET(local_url + PERSONALMESSIONLIST, params, (json)=>{
                console.log(json)
                this._initData(json.data.personal_mession_list)
            })

    }

    componentWillMount() {

    }

    _initData(data){
        let state_data = data.map((val, index)=>{
            return {
                key:index.toString(),
                name: val.mession_name,
                task_time: val.deadline,
                task_rate:`${val.complete_num}/${val.count}`,
                task_collected:val.collection_num,
                state:val.personal_mession_status == 'marking' ? '待标注' : '已验收',
                operation: '开始标注'
            }
        })
        this.setState({
            data: state_data
        })
    }

    clearFilters = () => {
        this.setState({ filteredInfo: null });
    };

    handleChange = (pagination, filters, sorter) => {
        console.log('Various parameters', pagination, filters, sorter);
        this.setState({
            filteredInfo: filters,
            sortedInfo: sorter,
        });
    };

    _jumpto(record) {
        console.log(record)
    }

    render() {

        let { filteredInfo } = this.state;
        filteredInfo = filteredInfo || {};

        const columns = [
            {
                title: '任务名称',
                dataIndex: 'name',
                key: 'name',
                ellipsis: true,
            },
            {
                title: '任务截止时间',
                dataIndex: 'task_time',
                key: 'task_time',
                ellipsis: true,
            },
            {
                title: '任务进度',
                dataIndex: 'task_rate',
                key: 'task_rate',
                ellipsis: true,
            },
            {
                title: '任务收藏数量',
                dataIndex: 'task_collected',
                key: 'task_collected',
                ellipsis: true,
            },
            {
                title: '审核状态',
                dataIndex: 'state',
                key: 'state',
                filters: [{ text: '待标注', value: '待标注' }, { text: '已验收', value: '已验收' }],
                filteredValue: filteredInfo.state || null,
                onFilter: (value, record) => record.state.includes(value),
                ellipsis: true,
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                render: (text, record) => (
                    <span>
                        <a onClick={this._jumpto.bind(this, record)}>{text}</a>
                    </span>
                ),
                ellipsis: true,
            },
        ];

        return (
            <Card bordered={false} title='标注任务中心' style={{marginBottom: 10, minHeight: 440}} id='taskProcessID'>
                <Table columns={columns} dataSource={this.state.data} onChange={this.handleChange} />
            </Card>
        )
    }
}

export default TaskCenter