import React from 'react'
import {Table ,Icon,Tag,Button,Select,Input,message} from 'antd'
import SXLLCenter from '../module/SXLLCenter'
import utils from '../libs/utils'
import TeacherList from '../component/TeacherList'
const Option = Select.Option;



export default class BillOrder extends React.Component {
  constructor(props) {
    super(props)

    this.state={
      dataSource : [],
      filter: {},
      loading:false
    }
    this.columns = [
      {
        title: '订单流水号',
        dataIndex: 'orderNo',
        key: 'orderNo',
      },{
        title: '用户名',
        dataIndex: 'name',
        key: 'name',
      },{
        title: '手机号',
        dataIndex: 'phone',
        key: 'phone',
      },{
        title: '订单价格',
        dataIndex: 'orderPrice',
        key: 'orderPrice',
        render: text=><span>{text}元</span>
      },{
        title: '订单过期时间',
        dataIndex: 'expireTime',
        key: 'expireTime',
      },{
        title: '支付状态',
        dataIndex: 'payStatus',
        key: 'payStatus',
        render: text=><span>{text==0?<Tag color="#2db7f5">待支付</Tag>:text==1?<Tag color="#87d068">已支付</Tag>:<Tag color="#f50">未支付</Tag>}</span>
      },{
        title: '支付时间',
        dataIndex: 'payTime',
        key: 'payTime',
      }];
    this.pageSize = 15;
  }


  componentDidMount(){
    this.getOrderInfo()
  }


  //获取订单信息
  getOrderInfo(orderNo,phone,payStatus,current){
    let self = this;
    current = current || this.state.current;
    orderNo = orderNo&&orderNo.trim();
    phone = phone&&phone.trim();
    SXLLCenter.getOrderInfo(current,this.pageSize,orderNo,payStatus,phone).subscribe({
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
      onError(error){
        message.error(error.retMsg||"筛选失败")
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
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  search(){
    let {orderNo,phone,payStatus} = this.state.filter;
    this.getOrderInfo(orderNo,phone,payStatus);
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
    this.getOrderInfo('','','',page);
    this.setState({
      current:page
    })
  }
  render(){
    let { dataSource,filter,loading,current,total} = this.state;
    let {orderNo,phone,payStatus} = filter;
    return (
      <div>
        <div className="bill-operations">
          <div className="formItem">
            <span className="name">订单流水号</span>
            <Input value={orderNo} onChange={(e)=>this.onChange(e,'orderNo')}/>
          </div>
          <div className="formItem">
            <span className="name">手机号</span>
            <Input value={phone}  onChange={(e)=>this.onChange(e,'phone')}/>
          </div>
          <div className="formItem">
            <span className="name">支付状态	</span>
            <Select placeholder="选择支付状态" style={{ width: 100 }} value={payStatus}onSelect={(value)=>this.onSelectChange(value,'payStatus')} >
              <Option value=''>全部</Option>
              <Option value='0'>待支付</Option>
              <Option value='1'>已支付</Option>
              <Option value='2'>未支付</Option>
            </Select>
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