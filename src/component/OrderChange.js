import React from 'react'
import {Select ,Icon,Modal,Button,TimePicker,Input,Tag,message,Checkbox} from 'antd'
import SXLLCenter from '../module/SXLLCenter'
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
import moment from 'moment'
export default class OrderChange extends React.Component {
  constructor(props) {
    super(props)

    this.state={
      student:this.props.student,
      gradeList:[],
      lessonList:[],
      universeList:[]
    }
  }


  componentDidMount(){
    this.getLessonInfo()
    this.getTermWeek()
  }

  componentWillReceiveProps(props){
    let {student} = this.state;
    if(student.id!=props.student.id){
      this.setState({
        student: props.student
      })
    }
  }

  getLessonInfo(){
    let self = this;
    SXLLCenter.getLessonInfo().subscribe({
      onSuccess(result){
        let {gradeList,lessonList,universeList} = result.data || {};
        self.setState({gradeList,lessonList,universeList})
      }
    }).fetch()
  }
  getTermWeek(){
    let self = this;
    SXLLCenter.getTermWeek().subscribe({
      onSuccess(result){
        let weeks = (result.data || []).map((item)=>{
          return {label:'第'+item.number+'周'+item.startTime+' ~ '+item.endTime,value:item.number.toString()}
        });
        self.setState({weeks})
      }
    }).fetch()
  }

  editStudentCoach(){
    let {student} = this.state;
    let self = this;
    SXLLCenter.editStudentCoach(student).subscribe({
      onSuccess(result){
        message.success('更新成功')
        self.props.onCancel()

      },
      onError(result){
        message.error(result.retMsg)
      }
    }).fetch()
  }

  // getPrice(student){
  //
  //   // 变量名	含义	类型	备注
  //   // coach	科目价格	number	不为空
  //   // coupon	优惠码基数	number
  //   // days	日次价	number	不为空
  //   // discount	折扣基数	number	不为空
  //   // grade	年级价格	number	不为空
  //   // quarter	每15分钟的价格	number	不为空
  //   // university	学校价格	number	不为空
  //   // weekend	双休日天数	number
  //   // weekendCount	双休日课时数	number
  //   // weeks	周次价	number	不为空
  //   // workday	工作日天数	number
  //   // workdayCount	工作日课时数	number
  //   let {gradeList,lessonList,universeList} = this.state;
  //   let data = {};
  //   // data.days = student.
  //   for (let item of lessonList){
  //     if(item.argument == student.course){
  //       data.coach = item.price;
  //       break;
  //     }
  //   }
  //
  //
  //   SXLLCenter.getLessonPrice(data).subscribe({
  //     onSuccess(result){
  //       if(result.data){
  //
  //       }
  //     }
  //   }).fetch()
  //
  // }


  formChange(e,type){
    let {student} = this.state;
    student[type] = e.target.value;
    this.setState({
      student
    })
  }
  onSelectChange(value,type){
    let {student} = this.state;
    student[type] = value;
    this.getPrice(student)
    this.setState({
      student
    })
  }
  onChange(checkedValues,type) {
    let {student} = this.state;
    checkedValues = checkedValues.sort(function(a,b){
      return a-b})
    student[type] = checkedValues.join(',');
    this.getPrice(student)
    this.setState({
      student
    })
  }

  disabledHours() {
    let hours = [];
    let i =0;
    while(i<16){
      hours.push(i);
      i++
    }
    i=22;
    while(i<=24){
      hours.push(i);
      i++
    }
    return hours;
  }

  disabledWeekendHours() {
    let hours = [];
    let i =0;
    while(i<9){
      hours.push(i);
      i++
    }
    i=22;
    while(i<=24){
      hours.push(i);
      i++
    }
    return hours;
  }
  disabledMinutes(){
    let minutes = [];
    let i=0;
    while (i<=60){
      if(i%15!=0){
        minutes.push(i)
      }
      i++;
    }
    return minutes;
  }

  onTimeChange(timeString,type,count){
    let {student} = this.state;
    let time = (student[type]||"").split(',');
    time[count] = timeString+':00'
    student[type] = time.join(',');
    this.getPrice(student)
    this.setState({
      student
    })
  }

  onSubmit(){
    this.editStudentCoach()

  }

  render(){
    let {student,gradeList,lessonList,universeList,weeks} = this.state;

    return (
      <div>
        <div className="formItem">
          <span className="name">姓名:</span>
          <Input style={{ width: 200 }}onChange={(e)=>this.formChange(e,'realName')} value={student.realName} disabled={true}/>
        </div>
        <div className="formItem">
          <span className="name">手机号码:</span>
          <Input style={{ width: 200 }}onChange={(e)=>this.formChange(e,'phone')} value={student.phone} disabled={true}/>
        </div>
        <div className="formItem">
          <span className="name">目标大学:</span>
          <Select style={{ width: 200 }} onChange={(value)=>this.onSelectChange(value,'university')} value={student.university}>
            {
              universeList.map((item,key)=>{
                return <Option key={key} value={item.argument}>{item.argument}</Option>
              })
            }
          </Select>
        </div>
        <div className="formItem">
          <span className="name">年级:</span>
          <Select style={{ width: 200 }} onChange={(value)=>this.onSelectChange(value,'grade')} value={student.grade}>
            {
              gradeList.map((item,key)=>{
                return <Option key={key} value={item.argument}>{item.argument}</Option>
              })
            }
          </Select>
        </div>
        <div className="formItem">
          <span className="name">课程:</span>
          <Select style={{ width: 200 }} onChange={(value)=>this.onSelectChange(value,'course')} value={student.course}>
            {
              lessonList.map((item,key)=>{
                return <Option key={key} value={item.argument}>{item.argument}</Option>
              })
            }
          </Select>
        </div>
        <div className="formItem">
          <span className="name">每周上课时间:</span>
          <CheckboxGroup  options={weeks}
                          value={(student.weeks ||"").split(',')}
                          onChange={(checkedValues)=>this.onChange(checkedValues,'weeks')}
          />
        </div>
        <div className="formItem">
          <span className="name">每周上课时间:</span>
          <CheckboxGroup  options={[
            { label: '周一', value: '1' },
            { label: '周二', value: '2' },
            { label: '周三', value: '3' },
            { label: '周四', value: '4' },
            { label: '周五', value: '5' },
            { label: '周六', value: '6' },
            { label: '周日', value: '7' }]}
                         value={(student.days||"").split(',')}
                         onChange={(checkedValues)=>this.onChange(checkedValues,'days')}
          />
        </div>
        <div className="formItem">
          <span className="name">工作日上课时间:</span>
          <TimePicker
            format = 'HH:mm'
            disabledHours={()=>this.disabledHours()}
            disabledMinutes={()=>this.disabledMinutes()}
            hideDisabledOptions
            value={moment((student.workdayConfig||"").split(',')[0]||"00:00", 'HH:mm')}
            onChange={(time,timeString)=>this.onTimeChange(timeString,'workdayConfig',0)}
          />
          <span style={{margin:'0 10px 0 10px',lineHeight:'27px'}}>~</span>
          <TimePicker
            format = 'HH:mm'
            disabledHours={()=>this.disabledHours()}
            disabledMinutes={()=>this.disabledMinutes()}
            hideDisabledOptions
            value={moment((student.workdayConfig||"").split(',')[1]||"00:00", 'HH:mm')}
            onChange={(time,timeString)=>this.onTimeChange(timeString,'workdayConfig',1)}
          />
        </div>
        {(student.days||"").includes('6') || (student.days||"").includes('7') ?
          <div className="formItem">
            <span className="name">周末日上课时间:</span>
            <TimePicker
              format='HH:mm'
              disabledHours={() => this.disabledWeekendHours()}
              disabledMinutes={() => this.disabledMinutes()}
              hideDisabledOptions
              value={moment((student.weekendConfig || "").split(',')[0] || "00:00", 'HH:mm')}
              onChange={(time, timeString) => this.onTimeChange(timeString, 'weekendConfig', 0)}
            />
            <span style={{margin: '0 10px 0 10px', lineHeight: '27px'}}>~</span>
            <TimePicker
              format='HH:mm'
              disabledHours={() => this.disabledWeekendHours()}
              disabledMinutes={() => this.disabledMinutes()}
              hideDisabledOptions
              value={moment((student.weekendConfig || "").split(',')[1] || "00:00", 'HH:mm')}
              onChange={(time, timeString) => this.onTimeChange(timeString, 'weekendConfig', 1)}
            />
          </div>:null
        }
        <div className="formItem">
          <span className="name">差额处理:</span>
          <span className="name"> 原价：{student.discountPrice}元</span><span className="name"> 现价：{student.discountPrice}元</span>
          <Select style={{ width: 150 ,margin:'0 10px 0 0'}} onChange={(value)=>this.onSelectChange(value,'status')} value={student.status}>
            <Option  value="1">退钱(退回钱包)</Option>
            <Option value="2">补交(从钱包中扣钱)</Option>
          </Select>
          <Input style={{ width: 100 }}onChange={(e)=>this.formChange(e,'price')} value={student.price}/>
          <span style={{lineHeight:'27px',margin:'0 10px 0 10px'}}>元</span>
        </div>
        <div className="formItem">
          <span className="name">备注:</span>
          <Input type="textarea" style={{ width: 400 }}onChange={(e)=>this.formChange(e,'remark')}rows={4}  value={student.remark}/>
        </div>

        <div className="formItem submit" >
          <Button type="primary" onClick={()=>this.onSubmit()}>提交修改</Button>
        </div>

      </div>
    )
  }
}