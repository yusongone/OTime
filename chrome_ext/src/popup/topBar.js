import React from "react";
import {watch} from "../reDot"

class _TopBar extends React.Component{
  add=()=>{
    this.props.setData("showAddBox",true);
  }
  render(){
    return (
      <div className="topBar">
        <div className="addTimeBtn" onClick={this.add}> 添加 </div>
        <div className="doneListLink"></div>
      </div>
    )
  }
}

export default watch([])(_TopBar);