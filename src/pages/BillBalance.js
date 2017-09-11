import React from 'react'
import {Table ,Icon,Modal,Button,Select,Input,Tag} from 'antd'
import SXLLCenter from '../module/SXLLCenter'
import utils from '../libs/utils'
import TeacherList from '../component/TeacherList'
const Option = Select.Option;



export default class BillBalance extends React.Component {
  constructor(props) {
    super(props)

    this.state={
      dataSource : [],
      filter: {},
      loading:false,
      current:1,
      total:0
    }
    this.columns = [
      {
        title: '编号',
        dataIndex: 'id',
        key: 'id',
      },{
        title: '用户名',
        dataIndex: 'nickName',
        key: 'nickName',
      },{
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      },{
        title: '金额',
        dataIndex: 'balance',
        key: 'balance',
        render: text=><span>{text}元</span>
      },{
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
      },{
        title: '操作',
        dataIndex: 'operate',
        key: 'operate'
      }];
    this.pageSize = 15;
  }


  componentDidMount(){
    this.getBalanceInfo()
  }


  //获取订单信息
  getBalanceInfo(operate,phone,current){
    let self = this;
    current = current || this.state.current;
    SXLLCenter.getBalanceInfo(current,this.pageSize,operate,phone).subscribe({
      onSendBefore(){
        self.setState({
          loading:true
        })
      },
      onSuccess(result){
        let list = result.data || [];
        self.setState({
          dataSource:list,
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



  showModal(text) {
    this.setState({
      visible: true,
      selectUser:text,
    });
  }

  handleChange  (pagination, filters, sorter) {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  search(){
    let {operate,phone} = this.state.filter;
    this.getBalanceInfo(operate,phone);
  }

  onChange(e,type){
    let {filter} = this.state;
    filter[type] = e.target.value;
    this.setState({filter})
  }
  onSelectChange(value,type){
    let {filter} = this.state;
    filter[type] = value;
    this.setState({filter})
  }
  pageChange(page){
    this.getBalanceInfo('','',page);
    this.setState({
      current:page
    })
  }
  render(){
    let { dataSource,filter,loading,current,total} = this.state;
    let {phone,operate} = filter;
    return (
      <div>
        <div className="bill-operations">
          <div className="formItem">
            <span className="name">手机号</span>
            <Input value={phone}  onChange={(e)=>this.onChange(e,'phone')}/>
          </div>

          <div className="formItem search">
            <Button type="primary" icon="search" onClick={()=>this.search()}>搜索</Button>
          </div>
        </div>
        <Table dataSource={dataSource}
               rowKey="id"
               loading = {loading}
               columns={this.columns}
               pagination={{
                 pageSize: this.pageSize,
                 current:current,
                 total:total,
                 onChange:(page, pageSize)=>this.pageChange(page, pageSize)
               }}
               onChange={this.handleChange.bind(this)}/>
      </div>
    )
  }
}