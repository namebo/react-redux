import React from 'react'
import {Table ,Icon,Modal,Button,Form,Input,DatePicker,message} from 'antd'
import SXLLCenter from '../module/SXLLCenter'
import utils from '../libs/utils'
import moment from 'moment'
const {  RangePicker } = DatePicker;
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
const dateFormat = 'YYYY-MM-DD';
export default class Price extends React.Component {
  constructor(props) {
    super(props)

    this.state={
      visible:false,
      term:{},
      title:"",
      dataSource:[],
      loading:true
    }
    this.columns = [
      {
        title: '周次',
        dataIndex: 'number',
        key: 'number',
        render: text=> <span>第{text}周</span>
      }, {
        title: '开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
      },{
        title: '结束时间',
        dataIndex: 'endTime',
        key: 'endTime',
      },
    ]
  }

  componentDidMount(){
    this.getTerm()
    this.getTermWeek()
  }

  getTerm(){//获取学期
    let self = this;
    SXLLCenter.getTerm().subscribe({
      onSendBefore(){
        self.setState({
          loading:true
        })
      },
      onSuccess(result){
        if(result.data){
          self.setState({term:result.data})
        }
      },
      onError(error){
        message.info("第一次打开，请设置学期开始时间结束时间",10)
      },
      onComplete(){
        self.setState({
          loading:false
        })
      }
    }).fetch()
  }
  addTerm(termStartTime,termEndTime){//新增学期
    let self = this;
    SXLLCenter.addTerm(termStartTime,termEndTime).subscribe({
      onSendBefore(){
        self.setState({
          loading:true
        })
      },
      onSuccess(result){

          self.setState({term:result.data})
          self.getTermWeek()
      },
      onComplete(){
        self.setState({
          loading:false
        })
      }
    }).fetch()
  }
  modifyTerm(termStartTime,termEndTime){//修改学期
    let self = this;
    let {id} = this.state.term || {};
    SXLLCenter.modifyTerm(id,termStartTime,termEndTime).subscribe({
      onSuccess(result){
        self.getTermWeek()
      },
      onError(error){
      }
    }).fetch()
  }
  getTermWeek(){//获取学期周次排班
    let self = this;
    SXLLCenter.getTermWeek().subscribe({
      onSuccess(result){
        if(result.data){
          self.setState({dataSource:result.data})
        }
      },
    }).fetch()
  }

  showModal(text) {
    this.setState({
      visible: true,
      selected: text
    });

  }
  onChange(dates, dateStrings) {
    let {term} = this.state;
    term.termStartTime = dateStrings[0];
    term.termEndTime = dateStrings[1];

    this.setState({
      term
    })

    if(term.id){
      this.modifyTerm(dateStrings[0],dateStrings[1])
    } else{
      this.addTerm(dateStrings[0],dateStrings[1])
    }
  }

  render(){
    let {term,dataSource,loading} = this.state;

    return (
      <div>
        <div className="table-operations xueqi">
          <h2>学期:</h2>
          <RangePicker  placeholder={['学期开始时间', '学期结束时间']} value={[moment(term.termStartTime || "2017-06-09", dateFormat), moment(term.termEndTime || "2017-08-20", dateFormat)] } onChange={this.onChange.bind(this)}/>
        </div>
        <Table loading = {loading} rowKey="number" dataSource={dataSource} columns={this.columns} />
      </div>
    )
  }
}