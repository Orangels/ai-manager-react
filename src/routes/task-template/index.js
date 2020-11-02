import React from 'react'
import {
    Card, Popconfirm, Button, Icon, Table, Divider, BackTop, Affix, Anchor, Form, InputNumber, Input, Select,
    Cascader, Tag, message, Tabs
} from 'antd'
import CustomBreadcrumb from '../../components/CustomBreadcrumb/index'
import {_fetch, transform_grade, getGrade, dateFormat, deepCopy, timestamp2Date} from '../../utils/utils'
import LoadableComponent from '../../utils/LoadableComponent'
import TaskProcess from "../task-process";


class TaskTemplate extends React.Component{
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
      }

      componentDidMount() {

      }

      componentWillMount() {

      }

      render() {
          return (
              <Card bordered={false} title='任务模板' style={{marginBottom: 10, minHeight: 440}} id='taskTemplateID'>
              </Card>
          )
      }
}

export default TaskTemplate