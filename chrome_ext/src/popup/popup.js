import React from "react"
import ReactDOM from "react-dom"
import {onNoteListChange, getData,addNode, updateNode} from "../tools/storage"
import Lists from "./list"
import TopBar from "./topBar"
import {ReDot,createData} from "../reDot"
import CountDown from "../components/countDown/index"
import Datepicker from "../components/datepicker/index"

import "./popup.less"
import "input-moment/dist/input-moment.css"


const redotData=createData({
  "TimeList":[],
  "showAddBox":false
});


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
          <Datepicker 
            value={this.state.date}
            onChange={(date)=>{
              this.setState({
                date
              })
            }} 

            disableDate={(date)=>{
              const min=new Date("2013-9-8").getTime();
              const max=new Date("2013-11-26").getTime();
              if(date.getTime()<min||date.getTime()>max){
                return true;
              }
            }}

            />
        </div>
      </ReDot>
    )
  }
}
          /*
          <CountDown onChange={function(millS){
            console.log(millS);
          }} />
          <TopBar onAdd={this.addList}/>
          <Lists 
            onChange={this.onChange} 
          />
          */

ReactDOM.render(<T />,document.getElementById("box"));

