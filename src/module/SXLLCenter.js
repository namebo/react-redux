import AsyncRequest from '../libs/AsyncRequest'
import MD5 from 'md5'
import config from '../../config';
let domian = config.api_domain;

let SXLLCenter = {
  login(username,password) {
    password = MD5(password)
    return new AsyncRequest(domian + "/wings/account/login", {username,password});
  },
  logout() {
    return new AsyncRequest(domian + "/wings/account/logout", {});
  },
  getUserInfo() {
    return new AsyncRequest(domian + "/wings/account/get_user_info", {});
  },
  getUserInfoList(pageNo,pageSize,userType){
    return new AsyncRequest(domian + "/wings/account/getUserInfoList", {pageNo,pageSize,userType})
  },
  getStuInfo(pageNo,pageSize,isDistribute){
    return new AsyncRequest(domian + "/wings/coach/get_student_info",{pageNo,pageSize,isDistribute})
  },
  getTeacherInfo(filter){
    return new AsyncRequest(domian + "/wings/coach/get_teacher_info",filter)
  },
  matchCoach(id,stuId,stuPhone,teachId,teachPhone){
    return new AsyncRequest(domian + "/wings/coach/match_coach",{id,stuId,stuPhone,teachId,teachPhone})
  },
  teacherConfig(filter){
    return new AsyncRequest(domian + "/wings/check/teacher_config",filter)
  },
  firstCheck(id, status,checkMsg){
    return new AsyncRequest(domian + "/wings/check/first_check",{id, status,checkMsg})
  },
  finalCheck(id, status,checkMsg){
    return new AsyncRequest(domian + "/wings/check/final_check",{id, status,checkMsg})
  },
  getTypeConfig(data){//获取类型
    return new AsyncRequest(domian + "/wings/type/get_type_config",data)
  },
  getOrder(type, status,pageNo,pageSize){
    return new AsyncRequest(domian + "/wings/work_order/get_order",{type, status,pageNo,pageSize})
  },
  checkOrder(id,checkStatus, orderReturn,commission){
    return new AsyncRequest(domian + "/wings/work_order/check_order",{id,checkStatus, orderReturn,commission})
  },
  getPrice(mark){
    return new AsyncRequest(domian + "/wings/type/get_price_config",{mark})
  },
  addTerm(termStartTime,termEndTime){//新增学期
    return new AsyncRequest(domian + "/wings/type/add_term_config",{termStartTime,termEndTime})
  },
  modifyTerm(id,termStartTime,termEndTime){//修改学期
    return new AsyncRequest(domian + "/wings/type/modify_term_config",{id,termStartTime,termEndTime})
  },
  getTerm(){//获取学期
    return new AsyncRequest(domian + "/wings/type/get_term_config",{})
  },
  getTermWeek(){//获取学期周次排班
      return new AsyncRequest(domian + "/wings/type/get_term_week",{})
  },
  getBasePrice(typeId,status){//获取基础价格信息
    return new AsyncRequest(domian + "/wings/price/get_base_price",{typeId,status})
  },
  addPrice(argument,price,type,status){//新增价格
    return new AsyncRequest(domian + "/wings/price/add_price",{argument,price,type,status})
  },
  modifyPrice(id,argument,price,type,status){//修改价格
    return new AsyncRequest(domian + "/wings/price/modify_price",{id,argument,price,type,status})
  },
  getOrderInfo(pageNo,pageSize,orderNo,payStatus,phone,orderPrice){//订单记录
    return new AsyncRequest(domian + "/wings/price/get_order_info",{pageNo,pageSize,orderNo,payStatus,phone,orderPrice})
  },
  getBalanceInfo(pageNo,pageSize,operate,phone,userId){//账单流水
    return new AsyncRequest(domian + "/wings/price/get_balance_info",{pageNo,pageSize,operate,phone,userId})
  },
  getDistcountPrice(type,argument,id,status){//获取优惠吗
    return new AsyncRequest(domian + "/wings/price/get_discount_price",{argument,id,status,type})
  },
  addDiscountPrice(data){//新增优惠吗
    return new AsyncRequest(domian + "/wings/price/add_discount_price",data)
  },
  getBanner(){//获取banner图
    return new AsyncRequest(domian + "/wings/home/get_banner")
  },
  modifyBanner(id,title,image,link,status,sort){//修改banner图
    return new AsyncRequest(domian + "/wings/home/modify_banner",{id,title,image,link,status,sort})
  },
  addBanner(title,image,link,status,sort){//新增banner
    return new AsyncRequest(domian + "/wings/home/add_banner",{title,image,link,status,sort})
  },
  upload(){
    return new AsyncRequest(domian + "/wings/upload/picture")
  },
  getNews(status){//获取新闻
    return new AsyncRequest(domian + "/wings/home/get_news",{status})
  },
  modifyNews(id,title,image,url,publisher,status){//更改新闻
    return new AsyncRequest(domian + "/wings/home/modify_news",{id,title,image,url,publisher,status})
  },
  addNews(title,image,url,publisher,status){//新增新闻
    return new AsyncRequest(domian + "/wings/home/add_news",{title,image,url,publisher,status})
  },
  getCompany(){//获取关于我们
    return new AsyncRequest(domian + "/wings/home/get_company",{})
  },
  addCompany(company,contact,desc,logo,principal,qrCode,activityUrl,shareUrl){//新增关于我们
    return new AsyncRequest(domian + "/wings/home/add_company",{company,contact,desc,logo,principal,qrCode,activityUrl,shareUrl})
  },
  modifyCompany(id,company,contact,desc,logo,principal,qrCode,activityUrl,shareUrl){//修改关于我们
    return new AsyncRequest(domian + "/wings/home/modify_company",{id,company,contact,desc,logo,principal,qrCode,activityUrl,shareUrl})
  },
  getCoachDetailLog(coachId,userId){//
    return new AsyncRequest(domian + "/wings/coach/get_coach_detail",{coachId,userId})
  },
  EditCallTimes(userId){
    return new AsyncRequest(domian + "/wings/account/editCallTimes",{userId})
  },
  getCoachLog(pageNo,pageSize){
    return new AsyncRequest(domian + "/wings/coach/get_coach_log",{pageNo,pageSize})
  },
  getLessonInfo(){
    return new AsyncRequest(domian + "/wings/type/get_lesson_info",{})
  },
  editStudentCoach(student){
    return new AsyncRequest(domian + "/wings/coach/edit_student_coach",student)
  },
  getLessonPrice(data){
    return new AsyncRequest(domian + "/wings/coach/get_price",data)
  },
  sendMsg(phone,type){
    return new AsyncRequest(domian + "/wings/msm/send_msg",{phone,type})
  },
  verifyCode(token,phone,code){
    return new AsyncRequest(domian + "/wings/user/register/verify_code",{token,phone,code})
  },
  superLogin(username,code,token){
    return new AsyncRequest(domian + "/wings/account/super_login",{token,username,code})
  },
  editRemarks(remarks,userId){
    return new AsyncRequest(domian + "/wings/account/editRemarks",{remarks,userId})
  },
  userList(){
    return new AsyncRequest(domian + "/wings/account/user/list",{})
  },
  userAdd(data){
    return new AsyncRequest(domian + "/wings/account/user/add",data)
  }

}

export default SXLLCenter;