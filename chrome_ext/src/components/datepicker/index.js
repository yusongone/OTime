import React from "react";
import "./style.less"

function getMonthDayCount(year,month){
  return new Date(year,month,0).getDate();
}
const ONEDAY=3600*24*1000;
const MonthZHMap={
  "1":"一月",
  "2":"二月",
  "3":"三月",
  "4":"四月",
  "5":"五月",
  "6":"六月",
  "7":"七月",
  "8":"八月",
  "9":"九月",
  "10":"十月",
  "11":"十一月",
  "12":"十二月"
}

class Month extends React.Component{
  constructor(p,c){
    super(p,c);

    this.state={
      dateAry:this.fillDateListAry(this.props)
    };
  }

  fillDateListAry=(props)=>{
    const ary=[];
    const {year,month}=props;
    const firstDay=new Date(year,month-1,1);
    const dayCount=getMonthDayCount(year,month);
    const firstDayIndex=firstDay.getDay();
    const length=firstDayIndex+dayCount>35?42:35;
    for(var i=0;i<length;i++){
      const timestamp=firstDay.getTime()+(i-firstDayIndex)*ONEDAY;
      const obj={
        timestamp,
        inMonth:firstDayIndex <= i && i< (firstDayIndex+dayCount)
      }
      ary.push(obj);
    }
    return ary;
  }

  componentWillReceiveProps(newProps){
    this.setState({
      dateAry:this.fillDateListAry(newProps)
    });
  }

  select(obj){
    this.props.onChange(obj)
  }

  createDateList=()=>{
    const ary=this.state.dateAry;
    const value=this.props.inputValue;
    return ary.map((item)=>{
      const dateObj=new Date(item.timestamp);
      const day=dateObj.getDay()
      const isDisable=this.props.disableDate(dateObj)

      let className="item";

      if(day==0||day==6){ //not work day
        className += " weekEnd"
      }
      if(!item.inMonth){
        className += " outMonth"
      }
      if(isDisable){
        className += " disable"
      }

      const sameYear=(value.getFullYear()==dateObj.getFullYear());
      const sameMonth=(sameYear&&value.getMonth()==dateObj.getMonth());
      const sameDate=(sameMonth&&value.getDate()==dateObj.getDate());
      if(sameDate){
        className += " select"
      }


      return (
        <div 
          className="itemBox"  
          key={dateObj.getMonth()+1+"_"+dateObj.getDate()} 
          onClick={()=>{
            if(item.inMonth&&!isDisable){
              this.select({timestamp:item.timestamp})
            }
          }}
          >
          <div className={className}>
            {dateObj.getDate()}
          </div>
        </div>
      )
    });
  }

  render(){
    const DateList=this.createDateList();
    return (
      <div className="dateList">
        {DateList}
      </div>
    )
  }
}


class TopBar extends React.Component{
  subMonth=()=>{
    this.props.onChange(parseInt(this.props.month)-1);
  }
  addMonth=()=>{
    this.props.onChange(parseInt(this.props.month)+1);
  }

  render(){
    const leftClassName = "left";
    const rightClassName = "right";
    return (
      <div className="datepicker_topBar">
        <div className={leftClassName} onClick={this.subMonth}>
            <i className="fa fa-chevron-left" />
        </div>
        <div className="monthBox" >{this.props.year} | {MonthZHMap[this.props.month]}</div>
        <div className={rightClassName} onClick={this.addMonth}>
            <i className="fa fa-chevron-right" />
        </div>
      </div>
    )
  }
}

class DatePicer extends React.Component{
  constructor(p,c){
    super(p,c);
    let value=p.value||new Date();
    this.state={
      year:value.getFullYear(),
      month:value.getMonth()+1
    }
  }

  onChange=(obj)=>{
    if(this.props.onChange){
      this.props.onChange(new Date(obj.timestamp));
    }
  }

  changeMonth=(month)=>{
    const newState={}
    if(month==0){
      newState.year=this.state.year-1;
      newState.month=12;
    }else if(month==13){
      newState.year=this.state.year+1;
      newState.month=1;
    }else{
      newState.month=month;
    }
    this.setState(newState)
  }

  selectDay=(obj)=>{
    this.onChange(obj);
  }

  componentWillReceiveProps(newProps){
    if(newProps.value!=this.state.value){
      const value=newProps.value;
      this.setState({
        year:value.getFullYear(),
        month:value.getMonth()+1
      });
    }
  }

  render(){
    return (
      <div className="datepicker">
        <TopBar 
          year={this.state.year} 
          month={this.state.month} 
          onChange={this.changeMonth}/>
        <Month 
          disableDate={this.props.disableDate}
          inputValue={this.props.value}
          year={this.state.year} 
          month={this.state.month} 
          selectDay={this.state.day} 
          onChange={this.selectDay}
          />
      </div>
    )
  }
}

export default DatePicer;