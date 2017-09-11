import React from 'react'
import { Form, Icon, Input, Button, Checkbox,message,Modal } from 'antd';
const FormItem = Form.Item;
import '../css/login.less'
import SXLLCenter from '../module/SXLLCenter'


export default class Login extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      data:{},
      visible:false,
      countDown:60
    }
  }
  formChange(e,type){
    let {data} = this.state;
    data[type] = e.target.value;
    this.setState({
      data
    })
  }
  show(){
    this.setState({
      visible:true
    })
  }

  handleCancel(){
    this.setState({
      visible:false
    })
  }

  countDown(){
    let {countDown} = this.state;
    if(countDown>0){
      countDown--;
    }else {
      countDown=60;
      this.time && clearInterval(this.time);
    }
    this.setState({
      countDown
    })
  }
  componentWillUnmount(){
    this.time && clearInterval(this.time);
  }
  sendMsg(){
    let {data} = this.state;
    let self = this;
    SXLLCenter.sendMsg(data.phone,1).subscribe({
      onSuccess(result){
        self.setState({token:result.data})
        self.time = setInterval(()=>self.countDown(),1000)
      },
      onError(result){
        message.error(result.retMsg)
      }
    }).fetch()
  }

  superLogin(username,code,token){
    SXLLCenter.superLogin(username,code,token).subscribe({
      onSuccess(result){
        window.location.hash = "#/term"
      },
      onError(result){
        message.error(result.retMsg)
      }
    }).fetch()
  }
  formChange(e,type){
    let {data} = this.state;
    data[type] = e.target.value;
    this.setState({
      data
    })
  }
  onSubmit(){
    let {token,data} = this.state;
    let self = this;
    SXLLCenter.verifyCode(token,data.phone,data.code).subscribe({
      onSuccess(result){
        self.superLogin(data.phone,data.code,result.data)
      },
      onError(result){
        message.error(result.retMsg)
      }
    }).fetch()
  }
  render(){
    let {data,countDown} = this.state;
    return (
      <div className="login">
        <div className="formItem">
          <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="手机号"  onChange={(e)=>this.formChange(e,'phone')} value={data.phone}/>
        </div>
        <div className="formItem">
          <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} placeholder="验证码" onChange={(e)=>this.formChange(e,'code')} value={data.code}/>
          {countDown==60?
          < Button style={{width:'150px',marginLeft:'20px'}} type="primary" onClick={()=>this.sendMsg()}>获取验证码</Button>:< Button style={{width:'150px',marginLeft:'20px'}} disabled={true} onClick={()=>message.info('请稍后再试')}>{countDown}秒</Button>
          }
        </div>
        <div className="formItem">
          <a href="#/login">普通管理</a>
        </div>
        <div className="formItem">
          <Button type="primary"style={{width:'100%'}} onClick={()=>this.onSubmit()}>登陆</Button>
        </div>
      </div>
    )
  }
}