import React from 'react'
import { withRouter, Switch, Redirect } from 'react-router-dom'
import LoadableComponent from '../../utils/LoadableComponent'
import PrivateRoute from '../PrivateRoute'

const task_mgt = LoadableComponent(()=>import('../../routes/task-mgt/index'))
const task_center = LoadableComponent(()=>import('../../routes/task-center/index'))
const task_template = LoadableComponent(()=>import('../../routes/task-template/index'))
@withRouter
class ContentMain extends React.Component {
  // 构造
    constructor(props) {
      super(props);
      // 初始状态
      this.state = {};
    }

  componentDidMount() {

  }


  render () {
    return (
      <div style={{padding: 16, position: 'relative'}} className={'test_stu'}>
        <Switch>
          <PrivateRoute exact path='/task-center' component={task_center}/>
          <PrivateRoute exact path='/task-mgt' component={task_mgt}/>
          <PrivateRoute exact path='/task-template' component={task_template}/>
          <Redirect exact from='/' to='/task-center'/>
        </Switch>
      </div>
    )
  }
}

export default ContentMain