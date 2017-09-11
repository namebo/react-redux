import React from 'react'
import {Table ,Icon,Modal,Button,Form,Input,message,Tag,Radio} from 'antd'
import SXLLCenter from '../module/SXLLCenter'
import utils from '../libs/utils'
import OrderDetailList from '../component/OrderDetailList'

const confirm = Modal.confirm;


export default class User extends React.Component {
  constructor(props) {
    super(props)

    this.state={
      dataSource : [],
      visible:false,
      filteredInfo: null,
      sortedInfo: null,
      selectUser: {},
      typeList:[],
      id: 15, //默认学生请假
      loading:false,
      orderReturn:"",
      detailVisible:false,
      total:0,
    }
    let sortedInfo = {};
    this.pageSize = 15;
    this.columns = {
      14:[{
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        render: (text,record) => (
          <span>{record.name}({record.identity})</span>
        )
      },{
        title: '联系方式',
        dataIndex: 'contact',
        key: 'contact',
      },{
        title: '详情',
        dataIndex: 'reason',
        key: 'reason',
      },{
        title: '支付平台',
        dataIndex: 'plantForm',
        key: 'plantForm',
      },{
        title: '支付账户',
        dataIndex: 'account',
        key: 'account',
      },{
        title: '支付金额',
        dataIndex: 'amount',
        key: 'amount',
      },{
        title: '创建时间',
        dataIndex: 'submitTime',
        key: 'submitTime'
      },{
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a  onClick={this.showModal.bind(this,text,record)}>{text.checkStatus==0?<Tag color="#2db7f5">审核中</Tag>:text.checkStatus==1?<Tag color="#87d068">已结单</Tag>:<Tag color="#f50">申请失败</Tag>}</a>
        </span>
        ),
      },{
        title: '反馈',
        dataIndex: 'orderReturn',
        key: 'orderReturn'
      }
      ],
      15: [{
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        render: (text, record) => (
          <span>{record.name}({record.identity})</span>
        )
      }, {
        title: '联系方式',
        dataIndex: 'contact',
        key: 'contact',
      }, {
        title: '详情',
        dataIndex: 'reason',
        key: 'reason',
      }, {
        title: '创建时间',
        dataIndex: 'submitTime',
        key: 'submitTime'
      }, {
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
          <a
            onClick={this.showModal.bind(this, text, record)}>{record.checkStatus == 0 ? <Tag color="#2db7f5">处理</Tag> : record.checkStatus == 1 ? <Tag color="#87d068">已通过</Tag> : <Tag color="#f50">不通过</Tag>}</a>
        </span>
        ),
      }, {
        title: '反馈',
        dataIndex: 'orderReturn',
        key: 'orderReturn'
      }],
      17:[{//课程终止
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        render: (text,record) => (
          <span>{record.name}({record.identity})</span>
        )
      },{
        title: '联系方式',
        dataIndex: 'contact',
        key: 'contact',
      },{
        title: '详情',
        dataIndex: 'reason',
        key: 'reason',
      },{
        title: '课程价格',
        dataIndex: 'price',
        key: 'price',
      },{
        title: '创建时间',
        dataIndex: 'submitTime',
        key: 'submitTime'
      },{
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a  onClick={this.showModal.bind(this,text,record)}>{text.checkStatus==0?<Tag color="#2db7f5">审核中</Tag>:text.checkStatus==1?<Tag color="#87d068">已结单</Tag>:<Tag color="#f50">申请失败</Tag>}</a>
            <span className="ant-divider" />
            <a  onClick={this.showDetail.bind(this,text,record)}>查看明细</a>
        </span>
        ),
      },{
        title: '反馈',
        dataIndex: 'orderReturn',
        key: 'orderReturn'
      }
      ],
      18:[{//课程结业
        title: '姓名',
        dataIndex: 'name',
        key: 'name',
        render: (text,record) => (
          <span>{record.name}({record.identity})</span>
        )
      },{
        title: '联系方式',
        dataIndex: 'contact',
        key: 'contact',
      },{
        title: '详情',
        dataIndex: 'reason',
        key: 'reason',
      },{
        title: '课程价格',
        dataIndex: 'price',
        key: 'price',
      },{
        title: '创建时间',
        dataIndex: 'submitTime',
        key: 'submitTime'
      },{
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a  onClick={this.showModal.bind(this,text,record)}>{text.checkStatus==0?<Tag color="#2db7f5">审核中</Tag>:text.checkStatus==1?<Tag color="#87d068">已结单</Tag>:<Tag color="#f50">申请失败</Tag>}</a>
            <span className="ant-divider" />
            <a  onClick={this.showDetail.bind(this,text,record)}>查看明细</a>
        </span>
        ),
      },{
        title: '反馈',
        dataIndex: 'orderReturn',
        key: 'orderReturn'
      }
      ],
    }
  }

  componentDidMount(){
    this.getOrder()
    this.getTypeConfig()
  }

  getOrder(id,current){
    let self = this;
    id = id || this.state.id;
    current = current || this.state.current;
      SXLLCenter.getOrder(id,'',current,this.pageSize).subscribe({
        onSendBefore(){
          self.setState({
            loading:true
          })
        },
        onSuccess(result){
          if(result.data){
            let list = result.data;
            self.setState({dataSource:list,total:result.totalCount})
          }
        },
        onComplete(){
          self.setState({
            loading:false
          })
        }
      }).fetch()
  }


  getTypeConfig(){
    let self = this;
    SXLLCenter.getTypeConfig({pid:3}).subscribe({
      onSuccess(result){
        if(result.data){
          self.setState({typeList:result.data})
        }
      }
    }).fetch()
  }

  checkOrder(id,checkStatus, orderReturn,commission){
    let self = this;
    SXLLCenter.checkOrder(id,checkStatus, orderReturn,commission).subscribe({
      onSuccess(result){
        message.success('处理成功');
        self.getOrder();
      },
      onError(error){
        message.error(error.retMsg||"处理失败");
      }
    }).fetch()
  }
  showModal(text) {
    if(text.checkStatus==1){
      message.error("已通过，请勿重复操作")
    }else if(text.checkStatus==2){
      message.error("未通过，请勿重复操作")
    }else{
      this.setState({
        visible: true,
        selected: text
      });
    }
  }

  showDetail(text){
    this.setState({
      detailVisible:true,
      selected: text
    })
  }
  handleChange  (pagination, filters, sorter) {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  handleTypeChange(e){
    this.setState({
      id: e.target.value,
      dataSource:[]
    })
    this.getOrder(e.target.value)
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

  handleOk(e){
    let {selected,orderReturn,commission} = this.state;
    this.checkOrder(selected.id,1,orderReturn,commission)
    this.setState({
      visible: false,
      commission:"",
      orderReturn:""
    });
  }
  handleNotPass(e){
    let {selected,orderReturn,commission} = this.state;
    this.checkOrder(selected.id,2,orderReturn,commission)
    this.setState({
      visible: false,
      commission:"",
      orderReturn:""
    });
  }
  handleCancel(e) {
    this.setState({
      visible: false,
      detailVisible:false,
      commission:"",
      orderReturn:""
    });
  }

  inputChange(e){
    this.setState({orderReturn:e.target.value})
  }
  commission(e){
    this.setState({commission:e.target.value})
  }

  pageChange(page){
    this.getOrder('',page);
    this.setState({
      current:page
    })
  }

  render(){
    let {typeList, dataSource, id,loading,orderReturn,total,current,commission,detailVisible,selected} = this.state;

    return (
      <div>
        <div className="table-operations">
          <Button type="primary"loading = {loading} icon="reload"onClick={()=>{
            this.setState({current:1})
            this.getOrder('',1)}}>刷新</Button>
          <Radio.Group size="default" value={id} onChange={this.handleTypeChange.bind(this)}>
            {typeList.map((item,key)=>{
              return <Radio.Button key={key} value={item.id} >{item.name}</Radio.Button>
            })}
          </Radio.Group>
        </div>
        <Table rowKey="id"
               dataSource={dataSource}
               loading = {loading}
               columns={this.columns[id]}
               pagination={{
                 pageSize: this.pageSize,
                 current:current,
                 total:total,
                 onChange:(page, pageSize)=>this.pageChange(page, pageSize)
               }}
               onChange={this.handleChange.bind(this)}/>
        <Modal
          title="工单处理"
          visible={this.state.visible}
          onCancel={this.handleCancel.bind(this)}
          footer={[
            <Button key="pass" type="primary" size="large" onClick={this.handleOk.bind(this)}>通过</Button>,
            <Button key="notPass" type="primary" size="large" onClick={this.handleNotPass.bind(this)}>
              不通过
            </Button>,
            <Button key="cancel" size="large" onClick={this.handleCancel.bind(this)}>取消</Button>,
          ]}
        >
          {id==17 || id==18?<div className="formItem">
            <span style={{lineHeight: '27px'}}>真实价格：</span>
            <Input style={{width:"150px"}} ref="commission" onChange={(e)=>this.commission(e)} value={commission}/>
          </div>:null}
          <Input type="textarea" ref="orderReturn" placeholder="输入处理意见"rows={4} onChange={(e)=>this.inputChange(e)} value={orderReturn}/>
        </Modal>

        <Modal
          title="上课详情"
          visible={detailVisible}
          onCancel={this.handleCancel.bind(this)}
          cancelText="关闭"
          width="90%"
          footer={[
            <Button key="cancel" size="large" onClick={this.handleCancel.bind(this)}>关闭</Button>,
          ]}
        >
          <OrderDetailList order={selected}/>
        </Modal>
      </div>
    )
  }
}