import React from "react"
import {Time} from "../countDown/index"
import Datepicker from "../datepicker/index"
import {getCleanTime,getDayHoursMinute} from "../../tools/common"

import "./style.less"

export class TargetTime extends React.Component{
  constructor(p,c){
    super(p,c);
    const today=p.date||this._getNow();
    this.state={
      date:today,
      hours:today.getHours(),
      minutes:today.getMinutes()
    }
  }
  _getNow=()=>{
    return new Date(new Date().getTime()+5*60*1000);
  }
  timeChange=(timeObj)=>{
    const date=new Date(this.state.date);
    date.setHours(timeObj.hours)
    date.setMinutes(timeObj.minutes);
    date.setSeconds(0);
    this.setState({
      date,
      hours:timeObj.hours,
      minutes:timeObj.minutes
    },this._checkTime);
  }
  dateChange=(obj)=>{
    const date=new Date(obj);
    date.setHours(this.state.hours)
    date.setMinutes(this.state.minutes);
    date.setSeconds(0);
    this.setState({
      date
    },this._checkTime)
  }
  _resetNowTime=()=>{
    const date=this._getNow();
    date.setSeconds(0);
    this.setState({
      date
    },this._checkTime)
  }
  _checkTime=()=>{
    const sub=this.state.date.getTime()-new Date().getTime();
    const DHM=getDayHoursMinute(sub);
    let a="距离现在： "+DHM.text;
    if(sub<1){
      this.setState({
        msg:{
          type:"error",
          msg:"您选择的日期时间已经过期!",
        }
      });
    }else{
      this.setState({
        msg:{
          type:"info",
          msg:a
        }
      });
    }
  }
  save=()=>{
    if(this.state.msg&&this.state.msg.type=="error"){
      return;
    }
    this.props.onSave(this.state.date);
  }
  render(){
    const msgClass=this.state.msg?"msg "+ this.state.msg.type:"msg";
    const btnClass=this.state.msg?"btn "+ this.state.msg.type:"btn";
    return (
      <div className="targetTimeBox">
        <Datepicker 
          value={this.state.date}
          onChange={this.dateChange} 
          disableDate={(date)=>{
            if(date.getTime()<getCleanTime(new Date())){
              return true;
            }
          }}

          />
          <Time startTime={this.state.date.getTime()} value={this.state.date.getTime()} onChange={this.timeChange} />
          <div className="setNowBtn" onClick={this._resetNowTime} >5分钟后</div>
          <div className={msgClass}>{this.state.msg?this.state.msg.msg:""}</div>
          <div className="btnBox">
            <div 
              className={btnClass}
              onClick={this.save}
              >确定</div>
            <div 
              className="btn cancel"
              onClick={this.props.onCancel}
              >取消</div>
          </div>
      </div>

    )

  }
};
