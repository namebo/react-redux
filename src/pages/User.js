import React from 'react'
import {Table ,Icon,Modal,Button,Form,Input,Avatar,Switch,message} from 'antd'
import SXLLCenter from '../module/SXLLCenter'
import utils from '../libs/utils'
import config from '../../config'

const confirm = Modal.confirm;
const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

export default class User extends React.Component {
  constructor(props) {
    super(props)

    this.state={
      dataSource : [],
      visible:false,
      filteredInfo: null,
      sortedInfo: null,
      selectUser: {},
      mail:false,
      total:0,
      current:0
    }
    let sortedInfo = {};
    // this.rowSelection = {
    //   onChange: (selectedRowKeys, selectedRows) => {
    //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    //   },
    //   getCheckboxProps: record => ({
    //     disabled: record.name === 'Disabled User',    // Column configuration not to be checked
    //   }),
    // };
    this.pageSize = 15;
    this.columns = [{
      title: '头像',
      dataIndex: 'headshot',
      key: 'headshot',
      render: text => <Avatar src={text} />,
    },{
      title: '姓名',
      dataIndex: 'nickName',
      key: 'nickName'
    },{
      title: '手机号码',
      dataIndex: 'phone',
      key: 'phone',
    },{
      title: '课程数量',
      dataIndex: 'lessonCount',
      key: 'lessonCount',
      render: text => <span>{text}节</span>
    },{
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      render: (text,record) => <span>{record.province} {record.city} {record.district} {text}</span>
    },{
      title: '最近登陆时间',
      dataIndex: 'lastLoginTime',
      key: 'lastLoginTime'
    },{
      title: '创建时间',
      dataIndex: 'registerTime',
      key: 'registerTime'
    },{
      title: '备注',
      dataIndex: 'remarks',
      key: 'remarks',
      render: (text,record) => <span> {text}<a onClick={()=>this.edit(record)}><Icon type="edit" style={{marginLeft:'5px'}} /></a></span>
    },{
      title: '呼叫次数',
      dataIndex: 'callCount',
      key: 'callCount',
      sorter: (a, b) => a.callCount - b.callCount,
      sortOrder: sortedInfo.columnKey === 'callCount' && sortedInfo.order,
      render: (text, record) => <span>{text || 0} <a onClick={()=>this.callCount(record)}><Icon type="plus-square-o" style={{ fontSize: 16, color: '#08c' ,marginLeft: '5px',hover: 'poiner'}}/></a></span>
    }
    // ,{
    //   title: '发送短信',
    //   dataIndex: 'message',
    //   key: 'message',
    //   render: text => <a onClick={()=>this.mail()}><Icon style={{ fontSize: 16, color: '#08c' ,marginLeft: '5px',hover: 'poiner'}} type="mail" /></a>
    // }
    //   {
    //   title: '操作',
    //   key: 'action',
    //   render: (text, record) => (
    //     <span>
    //       <a  onClick={this.showModal.bind(this,text,record)}>编辑</a>
    //       <span className="ant-divider" />
    //       <a onClick={this.showConfirm.bind(this)}>删除</a>
    //
    //     </span>
    //   ),
    // }
    ];


    this.userType =  utils.query().type;
  }

  componentDidMount(){
    this.getUserInfoList()
  }

  componentWillReceiveProps(props){
    if(this.userType != utils.query().type){
      this.userType = utils.query().type;
      this.getUserInfoList();
    }
  }
  getUserInfoList(current){
    let self = this;
    current = current || this.state.current;
    SXLLCenter.getUserInfoList(current,this.pageSize,this.userType).subscribe({
      onSuccess(result){
        if(result.data){
          let list = result.data;
          self.setState({
            dataSource:list,
            total:result.totalCount
          })
        }
      }
    }).fetch()
  }

  editCallTimes(userId){
    let self = this;
    SXLLCenter.EditCallTimes(userId).subscribe({
      onSuccess(){
        message.success('计数成功')
        self.getUserInfoList()
      }
    }).fetch()
  }

  editRemarks(){
    let self = this;
    let {selectUser} = this.state;
    SXLLCenter.editRemarks(selectUser.remarks,selectUser.id).subscribe({
      onSuccess(){
        self.getUserInfoList()
      }
    }).fetch()
  }

  callCount(record){
    this.editCallTimes(record.id)
  }
  showModal(text) {
    this.setState({
      visible: true,
      selectUser:text,
    });
  }
  handleOk(){
    this.setState({
      visible: false,
    });
    this.editRemarks()
  }
  handleCancel(e) {
    console.log(e);
    this.setState({
      visible: false
    });
  }

  handleChange  (pagination, filters, sorter) {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }
  clearFilters () {
    this.setState({ filteredInfo: null });
  }
  clearAll ()  {
    this.setState({
      filteredInfo: null,
      sortedInfo: null,
    });
  }
  setAgeSort  () {
    this.setState({
      sortedInfo: {
        order: 'descend',
        columnKey: 'age',
      },
    });
  }

  showConfirm() {
    confirm({
      title: '确认删除?',
      content: '删除后不可撤销',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }


  edit(record){
    this.setState({
      visible:true,
      selectUser:record
    })
  }
  formChange(e,type){
    let {selectUser} = this.state;
    selectUser[type] = e.target.value;

    this.setState({
      selectUser
    })
  }

  pageChange(page){
    this.getUserInfoList(page);
    this.setState({
      current:page
    })
  }
  render(){
    let {  dataSource,selectUser,current,total} = this.state;

    return (
      <div>
        <div className="table-operations">
          <Button><Icon type="download" style={{ fontSize: 16, color: '#08c' ,hover: 'poiner'}}/><a  href={`${config.api_domain}/wings/account/export_user_info?userType=${this.userType}`}>导出用户信息表</a></Button>
        </div>
        <Table rowKey="id"
               dataSource={dataSource}
               columns={this.columns}
               pagination={{
                 pageSize: this.pageSize,
                 current:current,
                 total:total,
                 onChange:(page, pageSize)=>this.pageChange(page, pageSize)
               }}
               onChange={this.handleChange.bind(this)}/>

        <Modal
          title={"编辑备注"}
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          <div className="formItem">
            <span className="name">备注:</span>
            <Input type="textarea" style={{ width: 200 }}onChange={(e)=>this.formChange(e,'remarks')} value={selectUser.remarks}/>
          </div>
        </Modal>
      </div>
    )
  }
}