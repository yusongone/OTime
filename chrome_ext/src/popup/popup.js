import React from "react"
import ReactDOM from "react-dom"
import {onNoteListChange, getData,addNode, updateNode} from "../tools/storage"
import Lists from "./list"
import TopBar from "./topBar"
import {ReDot,createData,watch} from "../reDot"

import "./popup.less"

const redotData=createData({
  "TimeList":[],
  "showAddBox":false
});


 var port = chrome.extension.connect({
      name: "Sample Communication"
 });
 port.onMessage.addListener(function(msg) {
      console.log("message recieved" + msg);
 });

class PageProvider extends React.Component{
  constructor(p,c){
    super(p,c);

    this.state={
      date:new Date("2013-5-13")
    }

    onNoteListChange((note,nodeList)=>{
      redotData.update("TimeList",nodeList);
      console.log(note);
      if(note.remindTime&&note.remindTime>new Date().getTime()){
        console.log("88888888",note,getData());
        port.postMessage({TYPE:"ADD_REMIND_TIME"});
      }else{
        console.log("99999999",note,getData());
        port.postMessage({TYPE:"CLEAR_REMIND",note:note});
      }
    });
  }

  componentDidMount(){
    redotData.update("TimeList",getData());
  }

  onChange=(noteData)=>{
    console.log("&&&&&",noteData);


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

