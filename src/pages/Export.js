import React from 'react'
import '../css/index.less'
import {Button} from 'antd'
import config from '../../config'


export default class Export extends React.Component {
  constructor(props) {
    super(props)
  }
  render(){
    return (
      <div className="index">
        <h1>表格导出</h1><br/><br/>
        <ul>
          <li><a href={`${config.api_domain}/wings/account/export_user_info?userType=1`}>1.教师信息导出</a></li>
          <li><a href={`${config.api_domain}/wings/account/export_user_info?userType=2`}>2.学生信息导出</a></li>
          <li><a href={`${config.api_domain}/wings/coach/export_coach_log`}>3.课程信息导出</a></li>
        </ul>
      </div>
    )
  }
}