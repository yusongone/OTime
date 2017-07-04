import React from "react"
import {Time} from "../countDown/index"
import Datepicker from "../datepicker/index"
import {getCleanTime} from "../../tools/common"

import "./style.less"

const today=new Date(new Date().getTime()+5*60*1000);
export class TargetTime extends React.Component{
  constructor(p,c){
    super(p,c);
    this.state={
      date:today,
      hours:today.getHours(),
      minutes:today.getMinutes()
    }
  }
  countDownChange=(obj)=>{
    console.log(obj);
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
  _checkTime=()=>{
    const sub=this.state.date.getTime()-new Date().getTime();
    const total_minutes=parseInt(sub/(60*1000));
    const day=parseInt(total_minutes/(24*60));
    const hours=parseInt(total_minutes%(24*60)/60);
    const minutes=parseInt(total_minutes%(24*60)%60)+1;
    console.log(day,hours,minutes);
    let a="距离现在： ";
    if(day>0){
      a+=day+" 天, "+hours+" 小时, "+minutes+" 分钟";
    }else if(hours>0){
      a+=hours+" 小时, "+minutes+"分钟";
    }else if(minutes>0){
      a+=minutes+" 分钟";
    }
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
            if(date.getTime()<getCleanTime(today)){
              return true;
            }
          }}

          />
          <Time startTime={this.state.date.getTime()} onChange={this.timeChange} />
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
