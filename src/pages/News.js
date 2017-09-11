import React from 'react'
import {Table ,Icon,Modal,Button,Input,message,Upload,Switch} from 'antd'
import SXLLCenter from '../module/SXLLCenter'
import config from '../../config'



export default class News extends React.Component {
  constructor(props) {
    super(props)

    this.state={
      visible:false,
      dataSource:[],
      loading:true,
      type:'edit',
      selected:{}
    }
    this.columns = [
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title'
      },{
        title: '图片',
        dataIndex: 'image',
        key: 'image',
        render: text => <img  width={100} src={text} />
      },{
        title: '地址',
        dataIndex: 'url',
        key: 'url',
        render: text => <span><a href={text} target="_blank">{text}</a></span>
      },{
        title: '发布时间',
        dataIndex: 'createTime',
        key: 'createTime',
      },{
        title: '发布人',
        dataIndex: 'publisher',
        key: 'publisher'
      },{
        title: '是否显示',
        dataIndex: 'status',
        key: 'status',
        render: text => <span>{text==1?'显示':'不显示'}</span>
      },{
        title: '操作',
        key: 'action',
        render: (text) => (<span> <a onClick={()=>this.showModal(text)}>编辑</a></span>)
      },
    ]
  }

  componentDidMount(){
    this.getNews()
  }

  getNews(){//获取新闻
    let self = this;
    SXLLCenter.getNews().subscribe({
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

  addNews(){
    let self = this;
    let {title,image,url,publisher,status} = this.state.selected;
    SXLLCenter.addNews(title,image,url,publisher,status).subscribe({
      onSendBefore(){
        self.setState({
          loading:true
        })
      },
      onSuccess(result){
        message.loading('添加成功正在更新数据')
        self.getNews()
      },
      onComplete(){
        self.setState({
          loading:false
        })
      }
    }).fetch()
  }
  modifyNews(){
    let self = this;
    let {id,title,image,url,publisher,status} = this.state.selected;
    SXLLCenter.modifyNews(id,title,image,url,publisher,status).subscribe({
      onSendBefore(){
        self.setState({
          loading:true
        })
      },
      onSuccess(result){
        message.loading('修改成功正在更新数据')
        self.getNews()
      },
      onComplete(){
        self.setState({
          loading:false
        })
      }
    }).fetch()
  }

  showModal(text) {
    this.setState({
      visible: true,
      selected: text,
      type:'edit'
    });
  }


  handleOk(){
    let {type} = this.state;
    this.setState({
      visible:false
    })
    if(type == 'edit'){
      this.modifyNews();
    }else{
      this.addNews();
    }
  }

  handleCancel(){
    this.setState({
      visible:false,
      selected:{}
    })
  }

  add(){
    this.setState({
      visible:true,
      type:'add'
    })
  }

  formChange(e,type){
    let {selected} = this.state;
    selected[type] = e.target.value;
    this.setState({
      selected
    })
  }

  upload(info) {
    var status = info.file.status;
    let {selected} = this.state;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} 上传成功`);

      selected.image = (info.file.response.data||{}).url;
      console.log(selected.image)
      this.setState({
        selected
      })
    }
    else if (status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  }

  switchChange(checked){
    let {selected} = this.state;
    selected.status = checked?1:2;
    this.setState({
      selected
    })
  }

  render(){
    let {dataSource,loading,type,selected} = this.state;
    return (
      <div>
        <div className="table-operations">
          <Button type="primary" onClick={()=>this.add()}>新增新闻</Button>
        </div>
        <Table loading = {loading} rowKey="id" dataSource={dataSource} columns={this.columns} />
        <Modal
          title={type=='edit'?'修改新闻':'新增新闻'}
          visible={this.state.visible}
          onOk={this.handleOk.bind(this)}
          onCancel={this.handleCancel.bind(this)}
        >
          <div className="formItem">
            <span className="name">标题：</span>
            <Input style={{ width: 300 }}onChange={(e)=>this.formChange(e,'title')} value={selected.title||""}/>
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
                selected.image ?
                  <img src={selected.image} alt="" className="avatar" /> :
                  <Icon type="plus" className="avatar-uploader-trigger" />
              }
            </Upload>
          </div>
          <div className="formItem">
            <span className="name">地址：</span>
            <Input style={{ width: 300 }}  onChange={(e)=>this.formChange(e,'url')} value={selected.url||""}/>
          </div>

          <div className="formItem">
            <span className="name">发布人：</span>
            <Input style={{ width: 300 }}onChange={(e)=>this.formChange(e,'publisher')} value={selected.publisher||""}/>
          </div>
          <div className="formItem">
            <span className="name">是否显示	:</span>
            <Switch checkedChildren="是" unCheckedChildren="否" checked={selected.status==2?false:true} onChange={this.switchChange.bind(this)}/>
          </div>
        </Modal>
      </div>
    )
  }
}