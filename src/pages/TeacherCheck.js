import React from 'react'
import {Table ,message,Modal,Avatar,Radio,Button,Input} from 'antd'
import SXLLCenter from '../module/SXLLCenter'



export default class User extends React.Component {
  constructor(props) {
    super(props)
    this.pageSize = 20;
    this.state={
      dataSource : [],
      visible:false,
      selectUser: {},
      loading: true,
      total:0,
      filter:{
        pageNo:1,
        pageSize:this.pageSize
      }
    }
    this.columns = [{
      title: '照片',
      dataIndex: 'headshot',
      key: 'headshot',
      render: text => <Avatar src={text} />,
    },{
      title: '姓名',
      dataIndex: 'realName',
      key: 'realName',
    },{
      title: '手机号码',
      dataIndex: 'phone',
      key: 'phone',
    },{
      title: '大学',
      dataIndex: 'university',
      key: 'university',
    },{
      title: '专业',
      dataIndex: 'major',
      key: 'major'
    },{
      title: '年级',
      dataIndex: 'grade',
      key: 'grade'
    },{
      title: '课程',
      dataIndex: 'tutorial',
      key: 'tutorial'
    },{
      title: '工作日时间',
      dataIndex: 'workdayConfig',
      key: 'workdayConfig'
    },{
      title: '双休日时间',
      dataIndex: 'weekendConfig',
      key: 'weekendConfig'
    },{
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },{
      title: '备注',
      dataIndex: 'checkMsg',
      key: 'checkMsg'
    },{
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={this.showDetail.bind(this,text)}>查看详情</a>
          <span className="ant-divider" />
          <a onClick={this.showModal.bind(this,text)}>{text.firstTrial==0?"初审":text.firstTrial==1&&text.finalTrial==0?"复审":text.firstTrial==1&&text.finalTrial==1?"已审核通过":"审核不通过"}</a>
        </span>
      ),
    }];
  }

  componentDidMount(){
    this.teacherConfig()
  }

  teacherConfig(filter){
    let self = this;
    SXLLCenter.teacherConfig(filter).subscribe({
      onSendBefore(){
        self.setState({
          loading:true
        })
      },
      onSuccess(result){
        self.setState({
          dataSource: result.data,
          total:result.totalCount
        })
      },
      onComplete(){
        self.setState({
          loading:false
        })
      }
    }).fetch()
  }

  firstCheck(id, status){
    let self = this;
    let {checkMsg} = this.state;
    SXLLCenter.firstCheck(id, status,checkMsg).subscribe({
      onSuccess(result){
        message.success("初审通过")
        self.teacherConfig();
      }
    }).fetch()
  }

  finalCheck(id, status){
    let self = this;
    let {checkMsg} = this.state;
    SXLLCenter.finalCheck(id, status,checkMsg).subscribe({
      onSuccess(result){
        message.success("复审通过")
        self.teacherConfig();
      }
    }).fetch()
  }

  showModal(text) {
    if(text.status){
      message.error('不通过，不可更改')
    }else if(text.firstTrial==1&&text.finalTrial==1){
      message.info("已审核")
    }else {
      this.setState({
        visible: true,
        selectUser: text
      });
    }
  }
  showDetail(text){
    this.setState({
      visible: true,
      selectUser: text,
      type: 'read'
    });
  }
  handleOk(e){
    let {selectUser} = this.state;
    if(selectUser.firstTrial!=1){
      this.firstCheck(selectUser.id,1);
    } else if(selectUser.firstTrial==1){
      this.finalCheck(selectUser.id,1)
    }
    this.setState({
      visible: false,
    });
  }
  handleCancel(e) {
    let {selectUser} = this.state;
    if(selectUser.firstTrial==0){
      this.firstCheck(selectUser.id,2);
    } else if(selectUser.firstTrial==1 && selectUser.finalTrial==0){
      this.finalCheck(selectUser.id,2)
    }
    this.setState({
      visible: false,
    });
  }

  handleTypeChange(e){
    let value =  e.target.value;
    let {filter} = this.state
    if(value == 1){
      filter.status = 0;
      filter.firstTrial = 0;
      filter.finalTrial = 0;
    }else if(value == 2){
      filter.status = 0;
      filter.firstTrial = 1;
      filter.finalTrial = 0;
    } else {
      filter.status = '';
      filter.firstTrial = '';
      filter.finalTrial = '';
    }
    this.setState({filter})

    this.teacherConfig(filter);
  }

  pageChange(page){
    let {filter} = this.state;
    filter.pageNo = page;
    this.teacherConfig(filter);
    this.setState({filter})
  }


  formChange(e){
    this.setState({
      checkMsg:e.target.value
    })
  }
  render(){
    let {dataSource,selectUser,filter,total,type} = this.state;
    let {phone,headshot,university,studentNo,realName,major,studentCard,idCard,firstTrial,firstTrialTime,tutorial,address,grade,createTime,updateTime,loading} = selectUser;

    return (
      <div>
        <div className="table-operations">
          <Button type="primary"loading = {loading} icon="reload"onClick={()=>{
            filter.pageNo = 1;
            this.setState({filter})
            this.teacherConfig(filter)}}>刷新</Button>
          <Radio.Group size="default" defaultValue={0} onChange={this.handleTypeChange.bind(this)}>
            <Radio.Button  value={0}>全部</Radio.Button>
            <Radio.Button  value={1}>待初审</Radio.Button>
            <Radio.Button  value={2}>待复审</Radio.Button>
          </Radio.Group>
        </div>
        <Table rowKey="id"
               dataSource={dataSource}
               columns={this.columns}
               pagination={{
                 pageSize: this.pageSize,
                 current:filter.pageNo,
                 total:total,
                 onChange:(page, pageSize)=>this.pageChange(page, pageSize)
               }}/>
        <Modal
          title=""
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          footer={type=='read'?null:[
            <Button key="back" size="large" onClick={this.handleOk.bind(this)}>审核通过</Button>,
            <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleCancel.bind(this)}>
              审核不通过
            </Button>]}
        >
          <p><span>姓名：</span><span>{realName}</span></p>
          {/*<p><span>高考省市：</span><span>{address}</span></p>*/}
          <p><span>大学：</span><span>{university}</span></p>
          <p><span>专业：</span><span>{major}</span></p>
          <p><span>补习年级：</span><span>{grade}</span></p>
          <p><span>补习课程：</span><span>{tutorial}</span></p>
          <p><span>本人持学生证照：</span></p><img src={studentCard} width={300}/>
          <p><span>本人持身份证照：</span></p><img src={idCard}width={300}/>
          <p><span>操作时间：</span><span>{updateTime}</span></p>
          <p><span>创建时间：</span><span>{createTime}</span></p>
          <p>
            <span >备注:</span>
            <Input type="textarea" style={{ width: 400 }}onChange={(e)=>this.formChange(e)}rows={2}/>
          </p>
        </Modal>
      </div>
    )
  }
}