import React from 'react'
import {Table ,Tag} from 'antd'
import SXLLCenter from '../module/SXLLCenter'
import utils from '../libs/utils'

export default class OrderDetailList extends React.Component {
  constructor(props) {
    super(props)

    this.state={
      dataSource : [],
      visible:false,
      course:{}
    }
    let sortedInfo = {};

    this.columns = [
      {
        title: '课时',
        dataIndex: 'lesson',
        key: 'lesson',
        render: text=><span>第{text}课时</span>
      },{
        title: '预计开始时间',
        dataIndex: 'startTime',
        key: 'startTime',
      },{
        title: "预计结束时间",
        dataIndex: "endTime",
        key: "endTime"
      },{
        title: "实际开始时间",
        dataIndex: "openTime",
        key: "openTime"
      },{
        title: "实际结束时间",
        dataIndex: "closeTime",
        key: "closeTime"
      },{
        title: "实际辅导时长",
        dataIndex: "duration",
        key: "duration",
        render: text=><span>{text}分钟</span>
      },{
        title: '老师评语',
        dataIndex: 'criticize',
        key: 'criticize',
      },{
        title: '学生状态',
        dataIndex: 'stuStatus',
        key: 'stuStatus',
        render: text=><span> {text==1?<Tag color="#87d068">已上课</Tag>:<Tag color="#f50">未上课</Tag>}</span>
      },{
        title: '老师状态',
        dataIndex: 'teachStatus',
        key: 'teachStatus',
        render: text=><span> {text==1?<Tag color="#87d068">已上课</Tag>:<Tag color="#f50">未上课</Tag>}</span>
      },{
        title: '课时状态',
        dataIndex: 'coachStatus',
        key: 'coachStatus',
        render: text=><span> {text==0?<Tag color="#f50">未开始</Tag>:text==1?<Tag color="#87d068">已辅导</Tag>:text==2?<Tag color="#f50">超时未辅导</Tag>:text==3?<Tag color="#2db7f5">辅导中</Tag>:<Tag color="#f50">学生请假</Tag>}</span>
      }];
  }


  componentDidMount() {
    this.getCoachDetailLog()
  }

  componentWillReceiveProps(props){
    let order = this.props.order || {};
    // if(order.id!=props.order.id || order.userId!=props.order.userId) {
      this.getCoachDetailLog(props.order)
    // }
  }


  getCoachDetailLog(order){
    let self = this;
    let {coachId,userId} = order ||this.props.order;
    SXLLCenter.getCoachDetailLog(coachId,userId).subscribe({
      onSuccess(result){
        self.setState({
          list:result.data.coachDetailViews || [],
          course:result.data.coachLogView || {}
        })
      }
    }).fetch()
  }

  render(){
    let { list,course} = this.state;
    let {classes,coachName,coachStatus,coachTime,studentOn,teacherOn} = course;
    return (
      <div>
        <div className="table-operations">
          <span >课程名字：{coachName}</span>
          <span className="ant-divider" />
          <span >总课时：{classes}</span>
          <span className="ant-divider" />
          <span >课程开始时间：{coachTime}</span>
          <span className="ant-divider" />
          <span >学生上课次数：{studentOn}</span>
          <span className="ant-divider" />
          <span >老师上课次数：{teacherOn}</span>
          <span className="ant-divider" />
          <span >辅导状态：{coachStatus==0?'未开始':coachStatus==1?'进行中':coachStatus==2?'结业':'中途放弃'}</span>
        </div>
        <Table dataSource={list} rowKey="id"  columns={this.columns} pagination={false}/>
      </div>
    )
  }
}