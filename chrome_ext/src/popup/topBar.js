import React from "react";
import {watch} from "../reDot"

class _TopBar extends React.Component{
  add=()=>{
    this.props.setData("showAddBox",true);
  }
  render(){
    return (
      <div className="topBar">
        <div className="addTimeBtn" onClick={this.props.onAdd}> 
          <i className="fa fa-file-o " aria-hidden="true"></i> 新建 
          </div>
        <div className="doneListLink"></div>
      </div>
    )
  }
}

export default watch([])(_TopBar);