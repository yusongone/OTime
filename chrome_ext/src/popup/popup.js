import React from "react"
import ReactDOM from "react-dom"
import {onNoteListChange, getData,addNode, updateNode} from "../tools/storage"
import Lists from "./list"
import TopBar from "./topBar"
import {ReDot,createData} from "../reDot"
import {CountDown,Time} from "../components/countDown/index"
import Datepicker from "../components/datepicker/index"
import {getCleanTime} from "../tools/common"

import "./popup.less"
import "input-moment/dist/input-moment.css"

const today=new Date();
const redotData=createData({
  "TimeList":[],
  "showAddBox":false
});


class TargetTime extends React.Component{
  constructor(p,c){
    super(p,c);
    this.state={
      date:today,
    }
  }
  countDownChange=(obj)=>{
    console.log(obj);
  }
  timeChange=(timeObj)=>{
    const dateStr=this.state.date.getTime().toString();
    const str=timeObj.millisecond.toString();
    const finDate=dateStr.substr(0,dateStr.length-str.length)+str;
    console.log(new Date(parseInt(finDate)).getTime());
  }
  save=()=>{
    console.log(this.date)
  }
  render(){
    return (
      <div>
        <Datepicker 
          value={this.state.date}
          onChange={(date)=>{
            this.setState({
              date
            })
          }} 

          disableDate={(date)=>{
            if(date.getTime()<getCleanTime(today)){
              return true;
            }
          }}

          />
          <Time startTime={new Date().getTime()} onChange={this.timeChange} />
          <div 
            className="btn"
            onClick={this.save}
            >确定</div>
      </div>

    )

  }
}

class T extends React.Component{
  constructor(p,c){
    super(p,c);

    this.state={
      date:new Date("2013-5-13")
    }

    onNoteListChange((nodeList)=>{
      redotData.update("TimeList",nodeList);
    });
  }

  componentDidMount(){
    redotData.update("TimeList",getData());
  }

  onChange=(noteData)=>{
    if(noteData.id){
      updateNode(noteData);
    }else{
      addNode(noteData);
      redotData.update("showAddBox",false);
    }
  }

  addList=()=>{
    redotData.update("showAddBox",true);
  }


  render(){
    return (
      <ReDot data={redotData}>
        <div className="container">
          <TargetTime onOk={(value)=>{
            console.log(value);
          }} />
        </div>
      </ReDot>
    )
  }
}
          /*
          <CountDown onChange={function(obj){
            console.log(obj);
          }} />
          <TopBar onAdd={this.addList}/>
          <Lists 
            onChange={this.onChange} 
          />
          */

ReactDOM.render(<T />,document.getElementById("box"));

