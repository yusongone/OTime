import React from "react"
import ReactDOM from "react-dom"
import {onNoteListChange, getData,addNode, updateNode} from "../tools/storage"
import "./popup.less"
import Lists from "./list"
import TopBar from "./topBar"
import {ReDot,createData} from "../reDot"


const redotData=createData({
  "TimeList":[],
  "showAddBox":false
});


class T extends React.Component{
  constructor(p,c){
    super(p,c);

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

ReactDOM.render(<T />,document.getElementById("box"));

