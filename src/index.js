import React from 'react'
import {
    render
} from 'react-dom'

import {
    Router,
    Route,
    IndexRoute,
    IndexRedirect,
    browserHistory,
    hashHistory,
    useRouterHistory,
    Link
} from 'react-router'
import { Layout, Menu, Breadcrumb, Icon ,Dropdown, Tag} from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const SubMenu = Menu.SubMenu;
import {
    createHashHistory
} from 'history'

//{queryKey: false}
const history = useRouterHistory(createHashHistory)()


import 'antd/dist/antd.less';
import './style.less';


import IndexPage from './pages/Index'
import User from './pages/User'
import Login from './pages/Login'
import TeacherCheck from './pages/TeacherCheck'
import StuSelect from './pages/StuSelect'
import Order from './pages/Order'
import Price from './pages/Price'
import Term from './pages/Term'
import BillOrder from './pages/BillOrder'
import BillBalance from './pages/BillBalance'
import Banner from './pages/Banner'
import News from './pages/News'
import About from './pages/About'
import Export from './pages/Export'
import Coach from './pages/Coach'
import utils from './libs/utils'
import SXLLCenter from './module/SXLLCenter'
import SuperLogin from './pages/SuperLogin'
// import Admin from './pages/admin'


class Root extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      collapsed: false,
      mode: 'inline',
      userMenu: <Menu>
        <Menu.Item>
          <a onClick={this.logout.bind(this)}>退出</a>
        </Menu.Item>
      </Menu>,
      userName: "admin"
    };
    this.breadCrumbMap = {
      teacherCheck:"教师审核",
      user:"用户",
      'type=1': "教师",
      'type=2': "学生",
      stuSelect:"学生选课匹配"
    }
  }

  componentWillReceiveProps(props){

  }

  componentDidMount(){
    this.getUserInfo();
  }
  //登出
  logout(){
    SXLLCenter.logout().subscribe({
      onSuccess(result){
        window.location.hash = "#/login"
      },
    }).fetch()
  }

  getUserInfo(){
    let self = this;
    SXLLCenter.getUserInfo().subscribe({
      onSuccess(result){
        self.setState({
          userName: result.data.name
        })
      },
      onError(error){
        window.location.hash = "#/login"
      }
    }).fetch()
  }

  onCollapse (collapsed) {
    this.setState({
      collapsed,
      mode: collapsed ? 'vertical' : 'inline',
    });
  }
  getBreadcrumb(){
    let hash = window.location.hash;
    let list = [];
    for (let item in this.breadCrumbMap){
      if(hash.includes(item)){
        list.push(<Breadcrumb.Item key={list.length}>{this.breadCrumbMap[item]}</Breadcrumb.Item>)
      }
    }
    return (
      <Breadcrumb style={{ margin: '12px 0' }}>
        {list}
      </Breadcrumb>
    )
  }

  render(){
    let {userMenu,userName} = this.state;
      return (
        <Layout>
            <Sider
              collapsible
              collapsed={this.state.collapsed}
              onCollapse={this.onCollapse.bind(this)}
            >
              <Link href="#/"><div className="logo" >师兄来了</div></Link>
                <Menu theme="dark" mode={this.state.mode} >
                  <Menu.Item key="6"><Link href="#/term"><span><Icon type="code-o" />学期信息</span></Link></Menu.Item>
                  <Menu.Item key="12">
                    <Link href="#/stuSelect">
                      <span>
                        <Icon type="calendar" />
                        <span className="nav-text">学生选课匹配</span>
                      </span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="1">
                    <Link href="#/teacherCheck"><span>
                      <Icon type="eye-o" />
                      <span className="nav-text">教师审核</span>
                    </span></Link>
                  </Menu.Item>
                  <Menu.Item key="2">
                    <Link href="#/price">
                      <span>
                        <Icon type="pay-circle-o" />
                        <span className="nav-text">课程价格配置项</span>
                      </span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="5">
                    <Link href="#/coach">
                      <span>
                        <Icon type="solution" />
                        <span className="nav-text">课程列表</span>
                      </span>
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="3">
                    <Link href="#/order">
                      <span>
                        <Icon type="tool" />
                        <span className="nav-text">工单</span>
                      </span>
                    </Link>
                  </Menu.Item>
                  <SubMenu
                    key="sub2"
                    title={<span><Icon type="team" /><span className="nav-text">用户管理</span></span>}
                  >
                    <Menu.Item key="8"><Link href="#/user?type=1">教师信息</Link></Menu.Item>
                    <Menu.Item key="9"><Link href="#/user?type=2">学生信息</Link></Menu.Item>
                    <Menu.Item key="17"><Link href="#/admin">渠道账号</Link></Menu.Item>
                  </SubMenu>
                  <SubMenu
                    key="sub3"
                    title={<span><Icon type="exception" /><span className="nav-text">账单流水</span></span>}
                  >

                    <Menu.Item key="10"><Link href="#/billOrder">订单记录(支付宝)</Link></Menu.Item>

                    <Menu.Item key="11"><Link href="#/billBalance">资金记录</Link></Menu.Item>
                  </SubMenu>

                  <SubMenu
                    key="sub4"
                    title={<span><Icon type="apple-o" /><span className="nav-text">ios端配置</span></span>}
                  >
                    <Menu.Item key="14"><Link href="#/banner">banner图</Link></Menu.Item>
                    <Menu.Item key="15"><Link href="#/news">新闻</Link></Menu.Item>
                    <Menu.Item key="16"><Link href="#/about">关于我们</Link></Menu.Item>
                  </SubMenu>

                </Menu>
            </Sider>
            <Layout>
              <Header style={{ background: '#fff', padding: 0 }} >
                <Dropdown overlay={userMenu} >
                  <a className="ant-dropdown-link user" href="#">
                    {userName}<Icon type="down" />
                  </a>
                </Dropdown>
              </Header>
                <Content style={{ margin: '0 16px' }}>
                  {this.getBreadcrumb()}
                    <div style={{ padding: 24, background: '#fff', minHeight: 360 ,height:'100%'}}>
                  {
                    React.Children.map(this.props.children, (element)=>{
                      return React.cloneElement(element, {})
                    })
                  }
                    </div>
                </Content>
                <Footer style={{ textAlign: 'center' }}>
                    wings90 ©2017 Create by wingser
                </Footer>
            </Layout>
        </Layout>

      )
  }
}



class App extends React.Component {

    constructor(props) {
      super(props)
    }
    render() {
      return (
        <Router history={history}>
          <Route path="/login" component={Login} />
          <Route path="/superLogin" component={SuperLogin}/>
          <Route path="/" component={Root}>
            <IndexRoute component={IndexPage} />
            <Route path="/user" component={User}/>
            {/* <Route path="/admin" component={Admin}/> */}
            <Route path="/teacherCheck" component={TeacherCheck}/>
            <Route path="/stuSelect" component={StuSelect}/>
            <Route path="/order" component={Order}/>
            <Route path="/price" component={Price}/>
            <Route path="/term" component={Term}/>
            <Route path="/billOrder" component={BillOrder}/>
            <Route path="/billBalance" component={BillBalance}/>
            <Route path="/banner" component={Banner}/>
            <Route path="/news" component={News}/>
            <Route path="/about" component={About}/>
            <Route path="/export" component={Export}/>
            <Route path="/coach" component={Coach}/>
          </Route>
        </Router>
      )

    }
}

render(<App />, document.getElementById("root"))