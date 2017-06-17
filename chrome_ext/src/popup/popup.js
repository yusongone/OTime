import React from "react"
import ReactDOM from "react-dom"
import storage from "../tools/storage"
import "./popup.less"
import Lists from "./list"
import TopBar from "./topBar"
import {ReDot,createData} from "../reDot"


const redotData=createData({
  "TimeList":[],
  "showAddBox":false
});


class T extends React.Component{
  componentDidMount(){
    storage.getData();
  }

  onChange=(noteData)=>{
    if(noteData.id){
      storage.updateNode(nodeData).then(function(){

      });
    }else{
      storage.addNode(nodeData).then(function(){

      });
    }
  }

  render(){
    return (
      <ReDot data={redotData}>
        <div className="container">
          <TopBar />
          <Lists onChange={this.onChange} />
        </div>
      </ReDot>
    )
  }
}

ReactDOM.render(<T />,document.getElementById("box"));

