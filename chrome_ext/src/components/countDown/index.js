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
    if(this.props.devalutValue!==undefined){
      this.valueChange(this.props.devalutValue)
    }
  }
  up=()=>{
      this.valueChange(parseInt(this.state.value)+1);
  }
  down=()=>{
    this.valueChange(parseInt(this.state.value)-1);
  }
  valueChange=(value)=>{
    const max=this.props.range[1];
    const min=this.props.range[0];
    if(value==""||(max==undefined||max>=value)&&(min==undefined||min<=value)){
      this.setState({
        value
      },()=>{
        if(this.props.onChange){
          this.props.onChange(value);
        }
      });
    }
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
          <div className="up" onClick={this.up}></div>
          <input 
            className="numInput" 
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
            value={this.props.value||this.state.value}
          />
          <div className="down" onClick={this.down}></div>
          </div>
        {textLabel}
      </div>
    )

  }
}

class CountDown extends React.Component{
  constructor(p,c){
    super(p,c);
    this.state={
      hours:0,
      minutes:0
    }
  }
  onChange=()=>{
      const millS=(this.state.hours*3600+this.state.minutes*60)*1000;
      this.props.onChange(millS);
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
    return (
      <div className="countDown">
        <NumberInput range={[0,24]} devalutValue={10} onChange={this.hoursChange} label="小时" />
        <NumberInput range={[0,59]} devalutValue={0} onChange={this.minutesChange} label="分钟" />
      </div>
    )
  }
}

export default CountDown;