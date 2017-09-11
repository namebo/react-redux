import React from 'react'
import {Table ,DatePicker,Modal,Button,Form,Input,message,Select,Radio} from 'antd'
import SXLLCenter from '../module/SXLLCenter'
import utils from '../libs/utils'
import moment from 'moment'
const Option = Select.Option;
const {  RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD';


//((年级+大学)*辅导时+课程)*周*天*折扣*优惠码==课程价格
export default class Price extends React.Component {
  constructor(props) {
    super(props)

    this.state={
      priceList : [],
      visible:false,
      filteredInfo: null,
      sortedInfo: null,
      selected: {},
      priceTypeList:[],
      loading:false,
      id:6,//默认为周
      type:""
    }
    let sortedInfo = {};


    this.columns = [{
      title: '名称',
      dataIndex: 'argument',
      key: 'argument',
    },{
      title: '价格',
      dataIndex: 'price',
      key: 'price',
    },{
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: text => <span>{text==1?"可用":"不可用"}</span>
    },{
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      render: (text, record)  => (<a onClick={this.showModal.bind(this,'edit',record)}>修改</a>)
    }
    ];
  }

  componentDidMount(){
    this.getPrice()
  }

  getPrice(){
    let self = this;
    SXLLCenter.getPrice('price_config').subscribe({
      onSuccess(result){
        if(result.data){
          let list = result.data;
          self.setState({priceTypeList:list})
          self.getBasePrice()
        }
      }
    }).fetch()
  }
  getBasePrice(id){
    let self = this;
    id = id||this.state.id;
    if(id!=13){
      this.columns[0].title = '名称' ;
      SXLLCenter.getBasePrice(id).subscribe({
        onSendBefore(){
          self.setState({
            loading:true
          })
        },
        onSuccess(result){
          if(result.data){
            let list = result.data;
            self.setState({priceList:list})
          }
        },
        onComplete(){
          self.setState({
            loading:false
          })
        }
      }).fetch()
    }else if(id==13){
      this.columns[0].title = '优惠码' ;
      SXLLCenter.getDistcountPrice(id).subscribe({
        onSendBefore(){
          self.setState({
            loading:true
          })
        },
        onSuccess(result){
          if(result.data){
            let list = result.data;
            self.setState({priceList:list})
          }
        },
        onComplete(){
          self.setState({
            loading:false
          })
        }
      }).fetch()
    }
  }
  addDiscountPrice(data){
    let self = this;
    console.log(111)
    SXLLCenter.addDiscountPrice(data).subscribe({
      onSuccess(result){
        self.getBasePrice()
        message.success("添加成功")
      },
      onError(error){
        message.error(error.retMsg||'修改失败')
      }
    }).fetch()
  }
  addPrice(argument,price,type,status){
    let self = this;
    SXLLCenter.addPrice(argument,price,type,status).subscribe({
      onSuccess(result){
        self.getBasePrice()
        message.success("添加成功")
      },
      onError(error){
        message.error(error.retMsg||'修改失败')
      }
    }).fetch()
  }
  modifyPrice(id,argument,price,type,status){
    let self = this;
    console.log(id,argument,price,type,status)
    SXLLCenter.modifyPrice(id,argument,price,type,status).subscribe({
      onSuccess(result){
        self.getBasePrice()
        message.success("修改成功")
      },
      onError(error){
        message.error(error.retMsg||'修改失败')
      }
    }).fetch()
  }
  showModal(type,record) {
    let id = this.state.id
    let selected = {};
    selected.type= id;
    selected.status = 1;
    if(type=='edit'){
      selected = record;
      // if(id==13){
      //   message.error('优惠码不可编辑！')
      //   return ;
      // }
    }
    this.setState({
      visible: true,
      type,
      selected
    });
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
      id: e.target.value
    })
    this.getBasePrice(e.target.value)
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
    let {selected,type,id} = this.state;
    if(type=='edit'){
      this.modifyPrice(selected.id,selected.argument,selected.price,selected.type,selected.status);
    }else{
      console.log(selected.id,id)
      if(selected.type==13 || id==13){//优惠码特殊处理
        this.addDiscountPrice(selected)
      }else {
        this.addPrice(selected.argument,selected.price,selected.type,selected.status);
      }
    }
    this.setState({
      visible: false,
    });
  }
  handleCancel(e) {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  formChange(e,type){
    let {selected} = this.state;
    selected[type] = e.target.value;
    this.setState({
      selected
    })
  }
  onSelectChange(value,type){
    let {selected} = this.state;
    selected[type] = value;
    this.setState({
      selected
    })
  }
  onDateChange(dates, dateStrings){
    let {selected} = this.state;
    console.log(dateStrings)
    selected.startTime = dateStrings[0];
    selected.endTime = dateStrings[1];
    this.setState({
      selected
    })
  }
  render(){
    let {priceTypeList,type, priceList,loading,id,selected} = this.state;

    return (
      <div>
        <div className="table-operations">
          <Button type="primary" onClick={this.showModal.bind(this,'add')}>新增价格</Button>
          <Radio.Group size="default" value={id} onChange={this.handleTypeChange.bind(this)}>
            {priceTypeList.map((item,key)=>{
              return <Radio.Button key={key} value={item.id}>{item.name}</Radio.Button>
            })}
          </Radio.Group>


        </div>
        <Table rowKey="id"  dataSource={priceList} loading = {loading}columns={this.columns} pagination={{ pageSize: 20 }} onChange={this.handleChange.bind(this)}/>
        <Modal
          title={type=='edit'?"修改价格":"新增价格"}
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          okText={type=='edit'?"修改":"新增"}
          cancelText="取消"
        >
          <div className="formItem">
            <span className="name">选择类型:</span>
            <Select  style={{ width: 200 }} onSelect={(value)=>this.onSelectChange(value,'type')} value={(selected.type||id).toString()} disabled={type=='edit'} >
              {priceTypeList.map((item,key)=>{
                return <Option key={key} value={item.id.toString()}>{item.name}</Option>
              })}
            </Select>
          </div>
          <div className="formItem">
            <span className="name">{selected.type==13?'优惠码':'名称'}:</span>
            <Input style={{ width: 200 }}onChange={(e)=>this.formChange(e,'argument')}value={selected.argument} disabled={type == 'edit' && selected.type==13}/>
          </div>
          <div className="formItem">
            <span className="name">价格:</span>
            <Input style={{ width: 200 }}onChange={(e)=>this.formChange(e,'price')} value={selected.price} disabled={type == 'edit' && selected.type==13}  />
          </div>
          {selected.type==13?
            <div className="formItem">
              <span className="name">有效期:</span>
              <RangePicker  placeholder={['开始时间', '结束时间']} onChange={this.onDateChange.bind(this)}  disabled={type == 'edit' && selected.type==13} />
            </div>:null
          }
          <div className="formItem">
            <span className="name">状态:</span>
            <Select style={{ width: 200 }} onChange={(value)=>this.onSelectChange(value,'status')} value={(selected.status || 1).toString()}>
              <Option value="1">可用</Option>
              <Option value="2">禁用</Option>
            </Select>
          </div>
        </Modal>
      </div>
    )
  }
}