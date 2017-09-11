// import React from 'react'
// import {Table ,Icon,Modal,Button,Form,Input,Tag,Switch,message} from 'antd'
// import SXLLCenter from '../module/SXLLCenter'
// import utils from '../libs/utils'
// import config from '../../config'

// const confirm = Modal.confirm;
// const FormItem = Form.Item;

// const formItemLayout = {
//   labelCol: {
//     xs: { span: 24 },
//     sm: { span: 5 },
//   },
//   wrapperCol: {
//     xs: { span: 24 },
//     sm: { span: 12 },
//   },
// };

// export default class Admin extends React.Component {
//   constructor(props) {
//     super(props)

//     this.state={
//       dataSource : [],
//       visible:false,
//       filteredInfo: null,
//       sortedInfo: null,
//       selectUser: {},
//       mail:false,
//       total:0,
//       current:0
//     }
//     let sortedInfo = {};
//     // this.rowSelection = {
//     //   onChange: (selectedRowKeys, selectedRows) => {
//     //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
//     //   },
//     //   getCheckboxProps: record => ({
//     //     disabled: record.name === 'Disabled User',    // Column configuration not to be checked
//     //   }),
//     // };
//     this.pageSize = 15;
//     this.columns = [{
//       title: '姓名',
//       dataIndex: 'name',
//       key: 'name'
//     },{
//       title: '手机号码',
//       dataIndex: 'phone',
//       key: 'phone',
//     },{
//       title: '状态',
//       dataIndex: 'status',
//       key: 'status',
//       render: text => <span>{text==1?<Tag>可用</Tag>:<Tag>禁用</Tag>}</span>
//     },{
//       title: '编辑',
//       key: 'edit',
//       render: (text,record) => <span><a  onClick={this.showModal.bind(this,text,record)}>编辑</a></span>
//     }
//     ];


//     this.userType =  utils.query().type;
//   }

//   componentDidMount(){
//     this.getUserInfoList()
//   }

//   componentWillReceiveProps(props){
//     if(this.userType != utils.query().type){
//       this.userType = utils.query().type;
//       this.getUserInfoList();
//     }
//   }
//   getUserInfoList(current){
//     let self = this;
//     current = current || this.state.current;
//     SXLLCenter.userList().subscribe({
//       onSuccess(result){
//         if(result.data){
//           let list = result.data;
//           self.setState({
//             dataSource:list,
//             total:result.totalCount
//           })
//         }
//       }
//     }).fetch()
//   }

//   add(){
//     let self = this;

//     SXLLCenter.userAdd().subscribe({
//       onSuccess(){
//         self.getUserInfoList()
//       }
//     }).fetch()
//   }

//   showModal(text) {
//     this.setState({
//       visible: true,
//       selectUser:text,
//     });
//   }
//   handleOk(){
//     this.setState({
//       visible: false,
//     });
//   }
//   handleCancel(e) {
//     console.log(e);
//     this.setState({
//       visible: false
//     });
//   }

//   handleChange  (pagination, filters, sorter) {
//     console.log('Various parameters', pagination, filters, sorter);
//     this.setState({
//       filteredInfo: filters,
//       sortedInfo: sorter,
//     });
//   }
//   clearFilters () {
//     this.setState({ filteredInfo: null });
//   }
//   clearAll ()  {
//     this.setState({
//       filteredInfo: null,
//       sortedInfo: null,
//     });
//   }
//   setAgeSort  () {
//     this.setState({
//       sortedInfo: {
//         order: 'descend',
//         columnKey: 'age',
//       },
//     });
//   }

//   showConfirm() {
//     confirm({
//       title: '确认删除?',
//       content: '删除后不可撤销',
//       onOk() {
//         console.log('OK');
//       },
//       onCancel() {
//         console.log('Cancel');
//       },
//     });
//   }


//   edit(record){
//     this.setState({
//       visible:true,
//       selectUser:record
//     })
//   }
//   formChange(e,type){
//     let {selectUser} = this.state;
//     selectUser[type] = e.target.value;

//     this.setState({
//       selectUser
//     })
//   }


//   pageChange(page){
//     this.getUserInfoList(page);
//     this.setState({
//       current:page
//     })
//   }
//   render(){
//     let {  dataSource,selectUser,current,total} = this.state;

//     return (
//       <div>
//         <div className="table-operations">
//           <Button type="primary" onClick={()=>this.add()}>新增渠道管理员</Button>
//         </div>
//         <Table rowKey="id"
//                dataSource={dataSource}
//                columns={this.columns}
//                pagination={{
//                  pageSize: this.pageSize,
//                  current:current,
//                  total:total,
//                  onChange:(page, pageSize)=>this.pageChange(page, pageSize)
//                }}
//                onChange={this.handleChange.bind(this)}/>

//         <Modal
//           title={"编辑备注"}
//           visible={this.state.visible}
//           onOk={this.handleOk.bind(this)}
//           onCancel={this.handleCancel.bind(this)}
//         >
//           <div className="formItem">
//             <span className="name">备注:</span>
//             <Input type="textarea" style={{ width: 200 }}onChange={(e)=>this.formChange(e,'remarks')} value={selectUser.remarks}/>
//           </div>
//         </Modal>
//       </div>
//     )
//   }
// }