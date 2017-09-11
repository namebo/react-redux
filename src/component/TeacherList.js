import React from 'react'
import {Table ,Icon,Modal,Button,Form,Input,Tag,message,Checkbox} from 'antd'
import SXLLCenter from '../module/SXLLCenter'
import utils from '../libs/utils'
const CheckboxGroup = Checkbox.Group;


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

export default class TeacherList extends React.Component {
  constructor(props) {
    super(props)

    this.state={
      dataSource : [],
      visible:false,
      filteredInfo: null,
      sortedInfo: null,
      selectUser: {},
      teacherList: [],
      options: []
    }
    let sortedInfo = {};

    this.columns = [
      {
        title: '姓名',
        dataIndex: 'realName',
        key: 'realName',
      },{
        title: '手机号码',
        dataIndex: 'phone',
        key: 'phone',
      },{
        title: "大学",
        dataIndex: "university",
        key: "university"
      },{
        title: "专业",
        dataIndex: "major",
        key: "major"
      },{
        title: "年级",
        dataIndex: "grade",
        key: "grade"
      },{
        title: "学科",
        dataIndex: "tutorial",
        key: "tutorial"
      },{
        title: '工作日上课时间',
        dataIndex: 'workdayConfig',
        key: 'workdayConfig',
      },{
        title: '周末上课时间',
        dataIndex: 'weekendConfig',
        key: 'weekendConfig',
      },{
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a  onClick={this.select.bind(this,text)}>选择</a>

          </span>
        ),
      }];
    this.userType =  utils.query().type;
  }


  componentDidMount(){
    this.getTeacherInfo()
    this.setOption(this.props.student)
  }


  setOption(student){
    let {userId,realName, university, grade, course, workdayConfig, weekendConfig, days, weeks, id} = student;
    let options = [
      { label: realName, value: 'realName' , disabled: true},
      { label: university, value: 'university' },
      { label: grade, value: 'grade' },
      { label: course, value: 'course' },
    ];
    let checkedList = ['university','grade','course' ]
    this.setState({
      options,
      checkedList
    })
  }

  //获取教师信息
  getTeacherInfo(checkedList){
    let self = this;
    let filter = {};
    checkedList = checkedList || ['university','grade','course' ]
    checkedList.map((item)=>{
      filter[item] = this.props.student[item]
    })
    SXLLCenter.getTeacherInfo(filter).subscribe({
      onSuccess(result){
        self.setState({teacherList:result.data || []})
      }
    }).fetch()
  }

  matchCoach(teachId, teachPhone){
    let self = this;
    let {id,userId,phone} = this.props.student;
    SXLLCenter.matchCoach(id,userId,phone,teachId,teachPhone).subscribe({
      onSendBefore(){
        message.loading('正在匹配')
      },
      onSuccess(result){
        message.success('匹配成功')
        self.props.onCancel()
      },
      onError(error){
        message.error(error.retMsg)
      }
    }).fetch()
  }

  select(text) {
    this.setState({
      visible: true,
      selectUser:text,
    });
    let {userId, phone} = text;
    this.matchCoach(userId, phone)
  }

  handleOk(e){
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

  handleChange  (pagination, filters, sorter) {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }


  onChange(checkedList){
    this.setState({
      checkedList
    })
    this.getTeacherInfo(checkedList)
  }
  render(){
    let { teacherList,options,checkedList} = this.state;
    let {student} = this.props;
    return (
      <div>
        <div className="table-operations">
          <CheckboxGroup options={options} value={checkedList} onChange={this.onChange.bind(this)}/>
        </div>
        <Table dataSource={teacherList} rowKey="id"  columns={this.columns} pagination={{ pageSize: 20 }} onChange={this.handleChange.bind(this)}/>

      </div>
    )
  }
}