import React from 'react'
import { withRouter, Switch, Redirect } from 'react-router-dom'
import LoadableComponent from '../../utils/LoadableComponent'
import PrivateRoute from '../PrivateRoute'

// const Home = LoadableComponent(()=>import('../../routes/Home/index'))  //参数一定要是函数，否则不会懒加载，只会代码拆分
const Home = LoadableComponent(()=>import('../../routes/Home/Home_auth_1'))

const ListDemo = LoadableComponent(()=>import('../../routes/Display/ListDemo/index'))
//关于
const About = LoadableComponent(()=>import('../../routes/About/index'))

//服务器管理
const ServerInfo = LoadableComponent(()=>import('../../routes/Server/server_info'))
const ServerDetail = LoadableComponent(()=>import('../../routes/Server/server_detail'))
const ServerAdd = LoadableComponent(()=>import('../../routes/Server/server_add'))

//学生管理
const StudentInfo = LoadableComponent(()=>import('../../routes/Student/student_info'))
const StudentDetail = LoadableComponent(()=>import('../../routes/Student/student_detail'))
const StudentAdd = LoadableComponent(()=>import('../../routes/Student/student_add'))

//数据集管理
const DataBaseInfo = LoadableComponent(()=>import('../../routes/DataBase/DataBase_info'))

@withRouter
class ContentMain_auth_1 extends React.Component {
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
                    <PrivateRoute exact path='/home' component={Home}/>
                    <PrivateRoute exact path='/about' component={About}/>
                    <PrivateRoute exact path='/server_info/server_detail' component={ServerDetail}/>
                    <PrivateRoute exact path='/student_info/student_detail' component={StudentDetail}/>
                    <Redirect exact from='/' to='/home'/>
                </Switch>
            </div>
        )
    }
}

export default ContentMain_auth_1