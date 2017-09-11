import React from 'react'
import {Table ,Icon,Modal,Button,Input,message,Upload,Switch} from 'antd'
import SXLLCenter from '../module/SXLLCenter'
import config from '../../config'

export default class Banner extends React.Component {
  constructor(props) {
    super(props)

    this.state={
      visible:false,
      title:"",
      dataSource:[],
      loading:true,
      type:'edit',
      formData:{}
    }
    this.columns = [
      {
        title: '图片',
        dataIndex: 'image',
        key: 'image',
        render: text=> <img width={100} src={text}/>
      }, {
        title: '名字',
        dataIndex: 'title',
        key: 'title',
      },{
        title: '地址',
        dataIndex: 'link',
        key: 'link',
      },{
        title: '是否显示',
        dataIndex: 'status',
        key: 'status',
        render: text => <span>{text==1?'显示':'不显示'}</span>
      },{
        title: '操作',
        dataIndex: 'caozuo',
        key: 'caozuo',
        render: (text,record)=> <span> <a onClick={()=>this.showModal(record)}>修改</a></span>
      },
    ]
  }

  componentDidMount(){
    this.getBanner()
  }

  getBanner(){//获取banner图
    let self = this;
    SXLLCenter.getBanner().subscribe({
      onSendBefore(){
        self.setState({
          loading:true
        })
      },
      onSuccess(result){
        self.setState({dataSource:result.data})
      },
      onComplete(){
        self.setState({
          loading:false
        })
      }
    }).fetch()
  }

  addBanner(){
    let self = this;
    let {formData} = this.state;
    let{title,image,link,status,sort} =formData;
    SXLLCenter.addBanner(title,image,link,status||1,sort).subscribe({
      onSuccess(result){
        message.success('添加成功')
        self.getBanner()
      }
    }).fetch()
  }

  modifyBanner(){
    let self = this;
    let {formData} = this.state;
    let{id,title,image,link,status,sort} =formData;
    SXLLCenter.modifyBanner(id,title,image,link,status||1,sort).subscribe({
      onSuccess(result){
        message.success('修改成功')
        self.getBanner()
      }
    }).fetch()
  }
  showModal(text) {
    this.setState({
      visible: true,
      formData: text,
      type:'edit'
    });
  }


  handleOk(){
    let{formData} = this.state;
    if(formData.id){
      this.modifyBanner()
    }else {
      this.addBanner()
    }
    this.setState({
      visible:false,
      formData:{}
    })
  }

  handleCancel(){
    this.setState({
      visible:false,
      formData:{}
    })
  }

  add(){
    this.setState({
      visible:true,
      type:'add'
    })
  }

  upload(info) {
    var status = info.file.status;
    let {formData} = this.state;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} 上传成功`);

      formData.image = (info.file.response.data||{}).url;
      console.log(formData.image)
      this.setState({
        formData
      })
    }
     else if (status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  }
  formChange(e,type){
    let {formData} = this.state;
    formData[type] =  e.target.value;
    this.setState({
      formData
    })
  }

  switchChange(checked){
    let {formData} = this.state;
    formData.status = checked?1:2;
    this.setState({
      formData
    })
  }

  render(){
    let {dataSource,loading,type,formData} = this.state;
    return (
      <div>
        <div className="table-operations">
          <Button type="primary" onClick={()=>this.add()}>新增banner</Button>
        </div>
        <Table loading = {loading} rowKey="id" dataSource={dataSource} columns={this.columns} />
        <Modal
          title={type=='edit'?'修改':'新增'}
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          <div className="formItem">
            <span className="name">标题:</span>
            <Input style={{ width: 200 }}onChange={(e)=>this.formChange(e,'title')} value={formData.title}/>
          </div>
          <div className="formItem">
            <span className="name">图片:</span>
            <Upload
              className="avatar-uploader"
              name="file"
              showUploadList={false}
              action={`${config.api_domain}/wings/upload/picture`}
              onChange={this.upload.bind(this)}
            >
              {
                formData.image ?
                  <img src={formData.image} alt="" className="avatar" /> :
                  <Icon type="plus" className="avatar-uploader-trigger" />
              }
            </Upload>
          </div>
          <div className="formItem">
            <span className="name">链接地址	:</span>
            <Input style={{ width: 200 }}onChange={(e)=>this.formChange(e,'link')} value={formData.link}/>
          </div>
          <div className="formItem">
            <span className="name">是否显示	:</span>
            <Switch checkedChildren="是" unCheckedChildren="否" checked={formData.status==2?false:true} onChange={this.switchChange.bind(this)}/>
          </div>
        </Modal>
      </div>
    )
  }
}