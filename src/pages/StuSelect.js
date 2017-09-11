import React from 'react'
import {Table ,Radio,Modal,Button,Form,message,Tag} from 'antd'
import SXLLCenter from '../module/SXLLCenter'
import utils from '../libs/utils'
import TeacherList from '../component/TeacherList'
import OrderChange from '../component/OrderChange'


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

export default class StuSelect extends React.Component {
  constructor(props) {
    super(props)

    this.state={
      dataSource : [],
      visible:false,
      filteredInfo: null,
      sortedInfo: null,
      selectUser: {},
      teacherList: [],
      current: 1,
      total:0,
      loading:true,
      isDistribute:'0'
    }
    let sortedInfo = {};
    this.pageSize = 15;
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
        title: "目标大学",
        dataIndex: "university",
        key: "university"
      },{
        title: "年级",
        dataIndex: "grade",
        key: "grade"
      },{
        title: "科目",
        dataIndex: "course",
        key: "course"
      },{
        title: '上课周次',
        dataIndex: 'weeks',
        key: 'weeks'
      },{
        title: '每周上课时间',
        dataIndex: 'days',
        key: 'days',
      },{
        title: '工作日上课时间',
        dataIndex: 'workdayConfig',
        key: 'workdayConfig',
      },{
        title: '周末上课时间',
        dataIndex: 'weekendConfig',
        key: 'weekendConfig',
      },{
        title: '价格',
        dataIndex: 'discountPrice',
        key: 'discountPrice',
        render: text => <span>{text}元</span>
      },{
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime'
      },{
        title: '备注',
        dataIndex: 'remark',
        key: 'remark'
      },{
        title: '更改金额',
        dataIndex: 'changePrice',
        key: 'changePrice',
        render: text => <span>{text?text+'元':''}</span>
      },{
        title: '状态',
        dataIndex: 'isDistribute',
        key: 'isDistribute',
        render:text => <span>{text==0?<Tag color="#2db7f5">未匹配</Tag>:<Tag color="#87d068">已匹配</Tag>}</span>
      },{
        title: '操作',
        key: 'action',
        render: (text, record) => (
          <span>
            <a onClick={this.showModal.bind(this,'edit',text,record)}>编辑</a>
            <span className="ant-divider" />
            <a  onClick={this.showModal.bind(this,'select',text,record)}>匹配</a>
          </span>
        ),
      }];
    this.userType =  utils.query().type;
  }


  componentDidMount(){
    this.getStuInfo()
  }

  componentWillReceiveProps(props){
    if(this.userType != utils.query().type){
      this.userType = utils.query().type;
      this.getStuInfo();
    }
  }

  //获取学生信息
  getStuInfo(current,isDistribute){
    let self = this;
    current = current || this.state.current;
    isDistribute = isDistribute || this.state.isDistribute;
    SXLLCenter.getStuInfo(current,this.pageSize,isDistribute).subscribe({
      onSendBefore(){
        self.setState({loading:true})
      },
      onSuccess(result){
          let list = result.data || [];
          self.setState({
            dataSource:list,
            total:result.totalCount
          })

      },
      onComplete(){
        self.setState({loading:false})
      }
    }).fetch()
  }


  showModal(type,text) {
    if(text.isDistribute==1){
      message.error('已完成匹配')
      return
    }
    this.setState({
      visible: true,
      selectUser:text,
      type:type
    });
  }
  handleOk(e){
    this.setState({
      visible: false,
    });

  }
  handleCancel(e) {
    this.setState({
      visible: false,
      selectUser:{},
    });
    this.getStuInfo();
  }

  handleChange  (pagination, filters, sorter) {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
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

  pageChange(page){
    this.getStuInfo(page);
    this.setState({
      current:page
    })
  }

  handleTypeChange(e){
    let value =  e.target.value;
    this.getStuInfo(1,value);
    this.setState({
      isDistribute:value
    })
  }

  render(){
    let { dataSource,selectUser,current,total,loading,type,isDistribute} = this.state;

    return (
      <div>
        <div className="table-operations">
          <Button type="primary" loading={loading}
                  icon="reload"
                  onClick={()=>{
            this.setState({current:1})
            this.getStuInfo(1)}}>刷新</Button>
          <Radio.Group size="default" value={isDistribute} onChange={this.handleTypeChange.bind(this)}>
            <Radio.Button  value={'0'}>未匹配</Radio.Button>
            <Radio.Button  value={'1'}>已匹配</Radio.Button>
            <Radio.Button  value={' '}>全部</Radio.Button>
          </Radio.Group>
        </div>
        <Table dataSource={dataSource}
               rowKey="id"
               columns={this.columns}
               loading={loading}
               pagination={{
                 pageSize: this.pageSize,
                 current:current,
                 total:total,
                 onChange:(page, pageSize)=>this.pageChange(page, pageSize)
               }}
               onChange={this.handleChange.bind(this)}/>

        <Modal
          title={type=='edit'?"修改选课信息":"匹配教师"}
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
          width={type=='edit'?"800px":"90%"}
          footer={null}
        >{type=='edit'?<OrderChange student={selectUser} onCancel={this.handleCancel.bind(this)}/>:
          <TeacherList student={selectUser} onCancel={this.handleCancel.bind(this)}/>
        }
        </Modal>
      </div>
    )
  }
}