import React from 'react'
import {
    Card, Popconfirm, Button, Icon, Table, Divider, BackTop, Affix, Anchor, Form, InputNumber, Input, Select,
    Cascader, Tag, message, Tabs
} from 'antd'
import CustomBreadcrumb from '../../components/CustomBreadcrumb/index'
import {_fetch, transform_grade, getGrade, dateFormat, deepCopy, timestamp2Date} from '../../utils/utils'
import LoadableComponent from '../../utils/LoadableComponent'


const data = [
    {

    },
    {

    }
]


class TaskProcess extends React.Component{
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            filteredInfo: null,
        };
    }

    componentDidMount() {

    }

    componentWillMount() {

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
                filters: [{ text: '待标注', value: 'unmarked' }, { text: '已验收', value: 'marked' }],
                filteredValue: filteredInfo.name || null,
                onFilter: (value, record) => record.state.includes(value),
                ellipsis: true,
            },
            {
                title: '操作',
                dataIndex: 'operation',
                key: 'operation',
                ellipsis: true,
            },
        ];

        return (
            <Card bordered={false} title='标注任务中心' style={{marginBottom: 10, minHeight: 440}} id='taskProcessID'>
                <Table columns={columns} dataSource={data} onChange={this.handleChange} />
            </Card>
        )
    }
}

export default TaskProcess