import React from 'react'
import { Button,Input,message,Upload,Icon} from 'antd'
import SXLLCenter from '../module/SXLLCenter'
import config from '../../config'
import QRCode from 'qrcode.react';


export default class News extends React.Component {
  constructor(props) {
    super(props)

    this.state={
      visible:false,
      companyData:{},
      selected:{},
      edit:false
    }
  }

  componentDidMount(){
    this.getCompany()
  }

  getCompany(){
    let self = this;
    SXLLCenter.getCompany().subscribe({
      onSuccess(result){
        self.setState({companyData:result.data ||{}})
      },
      onComplete(){
        self.setState({
          loading:false
        })
      }
    }).fetch()
  }

  addCompany(company,contact,desc,logo,principal,qrCode,activityUrl,shareUrl){
    let self = this;
    SXLLCenter.addCompany(company,contact,desc,logo,principal,qrCode,activityUrl,shareUrl).subscribe({
      onSuccess(result){
        message.success('添加成功！')
      },
      onComplete(){
        self.setState({
          edit:false
        })
      }
    }).fetch()
  }
  modifyCompany(id,company,contact,desc,logo,principal,qrCode,activityUrl,shareUrl){
    let self = this;
    SXLLCenter.modifyCompany(id,company,contact,desc,logo,principal,qrCode,activityUrl,shareUrl).subscribe({
      onSuccess(result){
        message.success('修改成功！')
      },
      onComplete(){
        self.setState({
          edit:false
        })
      }
    }).fetch()
  }
  edit(){
    this.setState({
      edit:true
    })
  }

  save(){
    let {companyData} = this.state;
    let{id,company,contact,desc,logo,principal,qrCode,activityUrl,shareUrl} = companyData;
    if(id){
      this.modifyCompany(id,company,contact,desc,logo,principal,qrCode,activityUrl,shareUrl)
    }else{
      this.addCompany(company,contact,desc,logo,principal,qrCode,activityUrl,shareUrl)
    }
  }

  formChange(e,type){
    let {companyData} = this.state;
    companyData[type] = e.target.value;
    this.setState({
      companyData
    })
  }

  upload(info) {
    var status = info.file.status;
    let {companyData} = this.state;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} 上传成功`);

      companyData.logo = (info.file.response.data||{}).url;
      this.setState({
        companyData
      })
    }
    else if (status === 'error') {
      message.error(`${info.file.name} 上传失败`);
    }
  }
  render(){
    let {companyData,edit} = this.state;
    return (
      <div>
        {!companyData||edit?
          <div>
            <div className="formItem">
              <span className="name">公司名称：</span>
              <Input style={{ width: 300 }}onChange={(e)=>this.formChange(e,'company')} value={companyData.company||""}/>
            </div>
            <div className="formItem">
              <span className="name">联系电话：</span>
              <Input style={{ width: 300 }}  onChange={(e)=>this.formChange(e,'contact')} value={companyData.contact||""}/>
            </div>
            <div className="formItem">
              <span className="name">公司简介：</span>
              <Input type="textArea" style={{ width: 300 }}onChange={(e)=>this.formChange(e,'desc')} value={companyData.desc||""}/>
            </div>
            <div className="formItem">
              <span className="name">负责人：</span>
              <Input  style={{ width: 300 }}onChange={(e)=>this.formChange(e,'principal')} value={companyData.principal||""}/>
            </div>
            <div className="formItem">
              <span className="name">活动页：</span>
              <Input  style={{ width: 300 }}onChange={(e)=>this.formChange(e,'activityUrl')} value={companyData.activityUrl||""}/>
            </div>
            <div className="formItem">
              <span className="name">分享页：</span>
              <Input  style={{ width: 300 }}onChange={(e)=>this.formChange(e,'shareUrl')} value={companyData.shareUrl||""}/>
            </div>
            <div className="formItem">
              <span className="name">二维码：</span>
              <Input  style={{ width: 300 }}onChange={(e)=>this.formChange(e,'qrCode')} value={companyData.qrCode||""}/>
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
                  companyData.logo ?
                    <img src={companyData.logo} alt="" className="avatar" /> :
                    <Icon type="plus" className="avatar-uploader-trigger" />
                }
              </Upload>
            </div>
            <div className="formItem">
              <Button type="primary" onClick={()=>this.save()}>保存</Button>
            </div>
          </div>:
          <div>
            <div className="formItem">
              <span className="name">公司名称：</span>
              <span className="value">{companyData.company || ""}</span>
            </div>
            <div className="formItem">
              <span className="name">联系电话：</span>
              <span className="value">{companyData.contact}</span>
            </div>
            <div className="formItem">
              <span className="name">公司简介：</span>
              <span className="value">{companyData.desc}</span>
            </div>
            <div className="formItem">
              <span className="name">负责人：</span>
              <span className="value">{companyData.principal}</span>
            </div>
            <div className="formItem">
              <span className="name">活动页：</span>
              <span className="value">{companyData.activityUrl}</span>
            </div>
            <div className="formItem">
              <span className="name">分享页：</span>
              <span className="value">{companyData.shareUrl}</span>
            </div>
            <div className="formItem">
              <span className="name">二维码：</span>
              <QRCode value={companyData.qrCode ||""} size={100}   bgColor="#fff"  fgColor="#000"/>
            </div>
            <div className="formItem">
              <span className="name">logo：</span>
              <img  width={100} height={100} src={companyData.logo} alt="logo"/>
            </div>
            <div className="formItem">
              <Button type="primary" onClick={()=>this.edit()}>修改</Button>
            </div>
          </div>
        }
      </div>
    )
  }
}