import React from 'react'
import { Form, Icon, Input, Button, Checkbox,message,Modal } from 'antd';
const FormItem = Form.Item;
import '../css/login.less'
import SXLLCenter from '../module/SXLLCenter'

class NormalLoginForm extends React.Component {
  handleSubmit(e){
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let {userName,password,remember} = values;

        SXLLCenter.login(userName,password).subscribe({
          onSuccess(result){
            if(remember){
              localStorage.setItem('userName',userName);
              localStorage.setItem('password',password);
            }else {
              localStorage.setItem('userName','');
              localStorage.setItem('password','');
            }
            window.location.hash = "#/term"
          },
          onError(error){
            message.error(error.retMsg)
          }
        }).fetch()
      }
    });
  }

  checkPassword  (rule, value, callback) {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('password')) {
      callback('Two passwords that you enter is inconsistent!');
    } else {
      callback();
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit.bind(this)} className="login-form">
        <FormItem>
          {getFieldDecorator('originPassword', {
            rules: [{ required: true, message: '请输入原密码！' }]
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} placeholder="原密码"  />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('newPassword', {
            rules: [
              {required: true, message: '请输入新密码！' },
              {validator: this.checkPassword.bind(this)}
              ]
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="newPassword" placeholder="新密码"  />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('password',
            {rules: [
              {required: true, message: '再次输入新密码！'},
              {validator: this.checkPassword.bind(this)}
              ]
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="再次输入新密码" onBlur={this.handleConfirmBlur}  />
          )}
        </FormItem>
        <FormItem>
          <a className="login-form-forgot" onClick={()=>this.props.show()}>忘记密码？</a>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登陆
          </Button>
          {/*Or <a href="">register now!</a>*/}
        </FormItem>
      </Form>
    );
  }
}
const  WrappedNormalLoginForm = Form.create()(NormalLoginForm);

export default class Login extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      data:{},
      visible:false
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

  render(){
    let {visible} = this.state;
    return (
      <div className="login">
        <WrappedNormalLoginForm show={this.show.bind(this)}/>
        <Modal
          title="修改密码"
          visible={visible}
          onCancel={this.handleCancel.bind(this)}
          cancelText="关闭"
          width="400px"
          footer={[
            <Button key="cancel" size="large" onClick={this.handleCancel.bind(this)}>关闭</Button>,
          ]}
        >

        </Modal>
      </div>
    )
  }
}