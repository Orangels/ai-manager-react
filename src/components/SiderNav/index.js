import React from 'react'
import CustomMenu from "../CustomMenu/index";

const menus = [
  {
    title: '任务列表',
    icon: 'bars',
    key: '/task-center',
    // subs: [
    //   {key: '/home/navigation/dropdown', title: '下拉菜单', icon: ''},
    //   {key: '/home/navigation/menu', title: '导航菜单', icon: ''},
    //   {key: '/home/navigation/steps', title: '步骤条', icon: ''},
    // ]
  },
  {
    title: '任务管理',
    icon: 'control',
    key: '/task-mgt',
    // subs: [
    //   {key: '/home/general/button', title: '按钮', icon: '',},
    //   {key: '/home/general/icon', title: '图标', icon: '',},
    // ]
  },
  {
    title: '任务模板',
    icon: 'edit',
    key: '/task-template',
    // subs: [
    //   {
    //     key: '/home/entry/form',
    //     title: '表单',
    //     icon: '',
    //     subs: [
    //       {key: '/home/entry/form/basic-form', title: '基础表单', icon: ''},
    //       {key: '/home/entry/form/step-form', title: '分步表单', icon: ''}
    //     ]
    //   },
    //   {key: '/home/entry/upload', title: '上传', icon: ''},
    // ]
  },
]


class SiderNav extends React.Component {
  render() {
    // #TODO 添加 logo
    return (
      <div style={{height: '100vh',overflowY:'scroll'}}>
        <div style={styles.logo}></div>
        <CustomMenu menus={menus}/>
      </div>
    )
  }
}

const styles = {
  logo: {
    // height: '32px',
    // background: 'rgba(255, 255, 255, .2)',
    height: '45px',
    margin: '16px'
  }
}

export default SiderNav