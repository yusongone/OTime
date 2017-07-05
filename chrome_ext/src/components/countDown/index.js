import React from "react";
import "./countDown.less"

class NumberInput extends React.Component{
  constructor(p,c){
    super(p,c);
    this.state={
      value:""
    }
  }
  componentDidMount(){
    if(this.props.value!==undefined){
      this.valueChange(this.props.value)
    }
  }
  up=()=>{
    const value=this.props.value!=undefined?this.props.value:this.state.value;
      this.valueChange(parseInt(value)+1);
  }
  down=()=>{
    const value=this.props.value!=undefined?this.props.value:this.state.value;
    this.valueChange(parseInt(value)-1);
  }
  blur=(_value)=>{
    const max=this.props.range[1];
    const min=this.props.range[0];

    const value=Math.min(max,Math.max(min,_value));

    this.setState({
      value
    },()=>{
      if(this.props.onChange){
        this.props.onChange(value);
      }
    });
  }
  valueChange=(value)=>{
    this.setState({
      value
    },()=>{
      if(this.props.onChange&&-1<=value&&value<=60){
        this.props.onChange(value);
      }
    });
  }
  componentWillReceiveProps(newProps){
    this.setState({
      value:newProps.value
    });
  }
  render(){
    let textLabel;
    const label=this.props.label;
    if(label){
      textLabel=<div className="label">{label}</div>
    }
    return (
      <div className="NumberInput hours">
        <div className="inputBox">
          <div className="up" onClick={this.up}>
            <i className="fa fa-chevron-up" />
          </div>
          <input 
            className="numInput" 
            onBlur={(event)=>{
              this.blur(event.target.value);
            }}
            onChange={(event)=>{
              this.valueChange(event.target.value);
            }} 
            onKeyDown={(event)=>{
              if(event.keyCode=="38"){
                event.preventDefault();
                this.up();
              }else if(event.keyCode=="40"){
                event.preventDefault();
                this.down();
              }
            }}
            value={this.state.value}
          />
          <div className="down" onClick={this.down}>
            <i className="fa fa-chevron-down" />
          </div>
          </div>
        {textLabel}
      </div>
    )

  }
}

export class CCountDown extends React.Component{
  constructor(p,c){
    super(p,c);
    this.state={
      hours:0,
      minutes:0
    }
  }
  onChange=()=>{
      const millS=(this.state.hours*3600+this.state.minutes*60)*1000;
      this.props.onChange?this.props.onChange({
        millisecond:millS,
        hours:this.state.hours,
        minutes:this.state.minutes
      }):"";
  }
  hoursChange=(value)=>{
    this.setState({
      hours:value
    },this.onChange)
  }
  minutesChange=(value)=>{
    this.setState({
      minutes:value
    },this.onChange);
  }
  render(){
    const hours=this.props.hours!=undefined?this.props.hours:this.state.hours;
    const minutes=this.props.minutes!=undefined?this.props.minutes:this.state.minutes;
    return (
      <div className="countDown">
        <NumberInput range={[0,24]} value={hours} onChange={this.hoursChange} label="小时" />
        <NumberInput range={[0,59]} value={minutes} onChange={this.minutesChange} label="分钟" />
      </div>
    )
  }
}


export class Time extends React.Component{
  constructor(p,c){
    super(p,c);

    const start=this.props.startTime;
    const date=new Date(start);
    const minHours=date.getHours();
    let minMinute=date.getMinutes();

    this.state={
      hours:minHours,
      minutes:minMinute
    }
  }
  componentWillReceiveProps(newProps){
    if(newProps.value!=undefined&&newProps.value!=this.props.value){
      const date=new Date(newProps.value);
      const minHours=date.getHours();
      let minMinute=date.getMinutes();
      this.setState({
        hours:minHours,
        minutes:minMinute
      })
    }
  }
  onChange=()=>{
      const millS=(this.state.hours*3600+this.state.minutes*60)*1000;
      this.props.onChange?this.props.onChange({
        millisecond:millS,
        hours:this.state.hours,
        minutes:this.state.minutes
      }):"";
  }
  hoursChange=(value)=>{
    value=Math.max(0,Math.min(23,value));
    this.setState({
      hours:value
    },this.onChange)
  }
  minutesChange=(value)=>{
    const hours=this.props.hours!=undefined?this.props.hours:this.state.hours;
    const minutes=this.props.minutes!=undefined?this.props.minutes:this.state.minutes;

    const temp={
      minutes:value
    }
    if(value>59&&hours<23){
      temp.hours=hours+1;
      temp.minutes=0;
    }else if(value<0&&hours>0){
      temp.hours=hours-1;
      temp.minutes=59;
    }
    if(temp.minutes>=60){
      temp.minutes=59;
    }else if(temp.minutes<=0){
      temp.minutes=0;
    }
    this.setState(temp,this.onChange);
  }
  render(){

    const hours=this.props.hours!=undefined?this.props.hours:this.state.hours;
    const minutes=this.props.minutes!=undefined?this.props.minutes:this.state.minutes;


    return (
      <div className="countDown">
        <NumberInput range={[0,24]} value={hours} onChange={this.hoursChange} />
        <div className="dot">:</div>
        <NumberInput range={[-1,60]} value={minutes} onChange={this.minutesChange} />
      </div>
    )
  }
}

export class CountDown extends Time{
  constructor(p,c){
    super(p,c);
    this.state={
      hours:0,
      minutes:0
    }
  }
  render(){
    const hours=this.props.hours!=undefined?this.props.hours:this.state.hours;
    const minutes=this.props.minutes!=undefined?this.props.minutes:this.state.minutes;
    return (
      <div className="countDown">
        <NumberInput range={[0,24]} value={Math.min(24,Math.max(0,hours))} onChange={this.hoursChange} label="小时" />
        <NumberInput range={[-1,60]} value={Math.max(0,Math.min(minutes,60))} onChange={this.minutesChange} label="分钟" />
      </div>
    )
  }
}
