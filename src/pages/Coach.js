import React from 'react'
import {Table ,Icon,Modal,Button,Tag,message} from 'antd'
import SXLLCenter from '../module/SXLLCenter'
import config from '../../config'
import OrderDetailList from '../component/OrderDetailList'


export default class Coach extends React.Component {
  constructor(props) {
    super(props)

    this.state={
      dataSource : [],
      visible:false,
      filteredInfo: null,
      sortedInfo: null,
      selectUser: {},
      mail:false,
      total:0,
      current:0,
      selected:{}
    }
    let sortedInfo = {};
    // this.rowSelection = {
    //   onChange: (selectedRowKeys, selectedRows) => {
    //     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    //   },
    //   getCheckboxProps: record => ({
    //     disabled: record.name === 'Disabled User',    // Column configuration not to be checked
    //   }),
    // };
    this.pageSize = 10;
    this.columns = [{
      title: '课程图片',
      dataIndex: 'url',
      key: 'url',
      render: text => <img width={100} src={text} />,
    },{
      title: '学生昵称',
      dataIndex: 'stuName',
      key: 'stuName',
    },{
      title: '学科',
      dataIndex: 'lessonName',
      key: 'lessonName',
    },{
      title: '学生手机号码',
      dataIndex: 'stuPhone',
      key: 'stuPhone',
    },{
      title: '教师昵称',
      dataIndex: 'teachName',
      key: 'teachName',
    },{
      title: '老师手机号码',
      dataIndex: 'teachPhone',
      key: 'teachPhone',
    },{
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },{
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: text => <span>	{text==0?'未开始':text==1?'辅导中':'已结束'}</span>
    },{
      title: '操作',
      key: 'action',
      render: (text, record) => (
        <span>
            <a  onClick={this.showDetail.bind(this,text,record)}>查看明细</a>
        </span>
      ),
    }
      //   {
      //   title: '操作',
      //   key: 'action',
      //   render: (text, record) => (
      //     <span>
      //       <a  onClick={this.showModal.bind(this,text,record)}>编辑</a>
      //       <span className="ant-divider" />
      //       <a onClick={this.showConfirm.bind(this)}>删除</a>
      //
      //     </span>
      //   ),
      // }
    ];
  }

  componentDidMount(){
    this.getCoach()
  }

  getCoach(current){
    let self = this;

    SXLLCenter.getCoachLog(current,this.pageSize).subscribe({
      onSuccess(result){
        if(result.data){
          let list = result.data;
          self.setState({
            dataSource:list,
            total:result.totalCount
          })
        }
      }
    }).fetch()
  }



  showModal(text) {
    this.setState({
      visible: true,
      selected:text,
    });
  }
  handleOk(e){
    this.setState({
      visible: false,
    });
  }
  handleCancel(e) {
    this.setState({
      visible: false
    });
  }

  handleChange  (pagination, filters, sorter) {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }



  showDetail(text){
    this.setState({
      visible:true,
      selected: text
    })
  }

  pageChange(page){
    this.getCoach(page);
    this.setState({
      current:page
    })
  }
  render(){
    let {  dataSource,selected,mail,current,total} = this.state;

    return (
      <div>
        <div className="table-operations">
          <Button><Icon type="download" style={{ fontSize: 16, color: '#08c' ,hover: 'poiner'}}/><a  href={`${config.api_domain}/wings/coach/export_coach_log`}>导出课程信息表</a></Button>
        </div>
        <Table rowKey="id"
               dataSource={dataSource}
               columns={this.columns}
               pagination={{
                 pageSize: this.pageSize,
                 current:current,
                 total:total,
                 onChange:(page, pageSize)=>this.pageChange(page, pageSize)
               }}
               onChange={this.handleChange.bind(this)}/>

        <Modal
          title={mail?"发送短信":"修改信息"}
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          width="90%"
        >
          <OrderDetailList order={{coachId:selected.id,userId:selected.userId}}/>
        </Modal>
      </div>
    )
  }
}