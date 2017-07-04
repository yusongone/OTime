import React from "react"
import ReactDOM from "react-dom"
import {onNoteListChange, getData,addNode, updateNode} from "../tools/storage"
import Lists from "./list"
import TopBar from "./topBar"
import {ReDot,createData,watch} from "../reDot"

import "./popup.less"
import "input-moment/dist/input-moment.css"

const redotData=createData({
  "TimeList":[],
  "showAddBox":false
});


class PageProvider extends React.Component{
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

          <TopBar onAdd={this.addList}/>
          <Lists 
            onChange={this.onChange} 
          />
        </div>
      </ReDot>
    )
  }
}

ReactDOM.render(<PageProvider />,document.getElementById("box"));

