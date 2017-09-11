
import JSONP from './JSONP'
import events from 'events'
import JSON from './JSON'

const SEND_BEFORE = "sendBefore"
const COMPLETE = "complete"
const SUCCESS = "success"
const ERROR = "ERROR";

export default class AsyncRequest extends events.EventEmitter{
  
  constructor(url, param, key) {

    super();
    param = param || {};
    param.t = parseInt(Math.random() * 100000);
    
    this.key = key;
    this.url = url;
    this.param = param;

  }

  subscribe(observer) {
    let self = this;
    observer.onSendBefore && this.on(SEND_BEFORE, function(){
      observer.onSendBefore.apply(observer, arguments)
    });

    observer.onComplete && this.on(COMPLETE, function(result){
      observer.onComplete.apply(observer, arguments);
    });

    observer.onSuccess && this.on(SUCCESS, function(result){
      observer.onSuccess.apply(observer, arguments)
    });

    observer.onError && this.on(ERROR, function(){
      observer.onError.apply(observer, arguments)
    });

    return this;
  }

  fetch() {

    this.turnsCount++;
    return new Promise((reslove, reject) => {
      //发送请求之前
      this.emit(SEND_BEFORE, this.turnsCount);

      this.loadData((result)=>{
        this.emit(COMPLETE, result, this.turnsCount);
        if(result.retCode==1){
          this.emit(SUCCESS, result, this.turnsCount);
        }else if(result.retCode==-104){//未登陆  跳登陆页面
          window.location.href = '#/login';
        }else{
          this.emit(ERROR, result, this.turnsCount)
        }
      }, ()=>{
        this.emit(COMPLETE, {success:false, msg:"网络错误"}, this.turnsCount);
        this.emit(ERROR, {success:false, msg:"网络错误"}, this.turnsCount);
      },"JSONP")
    })

  }

	get() {
		this.turnsCount++;
		return new Promise((reslove, reject) => {
			//发送请求之前
			this.emit(SEND_BEFORE, this.turnsCount);

			this.loadData((result)=>{
				this.emit(COMPLETE, result, this.turnsCount);
				if(result.success){
					this.emit(SUCCESS, result, this.turnsCount);
				}else{
					this.emit(ERROR, result, this.turnsCount)
				}
			}, ()=>{
				this.emit(COMPLETE, {success:false, msg:"网络错误"}, this.turnsCount);
				this.emit(ERROR, {success:false, msg:"网络错误"}, this.turnsCount);
			},'JSON','GET')
		})
	}
	post() {
		this.turnsCount++;
		return new Promise((reslove, reject) => {
			//发送请求之前
			this.emit(SEND_BEFORE, this.turnsCount);

			this.loadData((result)=>{
				this.emit(COMPLETE, result, this.turnsCount);
				if(result.success){
					this.emit(SUCCESS, result, this.turnsCount);
				}else{
					this.emit(ERROR, result, this.turnsCount)
				}
			}, ()=>{
				this.emit(COMPLETE, {success:false, msg:"网络错误"}, this.turnsCount);
				this.emit(ERROR, {success:false, msg:"网络错误"}, this.turnsCount);
			},'JSON','POST')
		})
	}
  //不要使用 Promise 的catch来捕捉 错误，否则错误可能会被吞掉，调试非常麻烦
  //线上把错误吞掉倒是一个好办法，具体还未想好，这里直接使用回调函数比较好
  loadData(callback1, callback2, type1, type2) {
    var param = {};

    for (var key in this.param) {

      if (this.param[key] !== "" && this.param[key] !== "undefined" && this.param[key] !== undefined && this.param[key] !== null) {
        param[key] = this.param[key]
      }
    }
	  type1 == 'JSONP'? JSONP(this.url, param, callback1, callback2):null;
	  type1 == 'JSON'? JSON({
	  	type: type2,
	  	url: this.url,
		  data: param,
		  success:callback1,
		  error:callback2
	  }):null
  }

  //轮训
  turns(spacingTime, limit){

    if(!this.key){
      throw "启动异步轮训，需要初始化传入一个 key 值，以避免死循环";
      return false;
    }

    this.limit = limit || -1;
    this.turnsCount = 0;
    spacingTime = spacingTime || 5000;

    this.on(COMPLETE, ()=>{
      if( this.limit == -1 || this.turnsCount < this.limit ){
        setTimeout(()=>{
          if( this.limit == -1 || this.turnsCount < this.limit ){
            this.fetch();
          }
        }, spacingTime);
      }
    });

    this.fetch();
    //删除上一个轮训
    AsyncRequest.removeTurns(this);
    //添加新的轮训
    AsyncRequest.addTurns(this)
    return this;
  }

  stop(){
    this.limit = 0;
    console.log("stop")
    return this;
  }

  //用于mock数据
  mock(result){
  	console.log(result)
    this.emit(COMPLETE, result, this.turnsCount);
    if(result.success){
      this.emit(SUCCESS, result, this.turnsCount);
    }else{
      this.emit(ERROR, result, this.turnsCount)
    }
  }
}

//
AsyncRequest.addTurns = function(asyncRequest){
  this.turns.push({
    key:asyncRequest.key,
    asyncRequest:asyncRequest,
  })
};


AsyncRequest.removeTurns = function(asyncRequest){
  
  for(var i=0; i<this.turns.length; i++){
    if(this.turns[i].key ==  asyncRequest.key){
      this.turns[i].asyncRequest.stop();
      this.turns.splice(i, 1);
      i--;
    }
  }

};

AsyncRequest.turns = [];

