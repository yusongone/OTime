import React from "react";
import {watch} from "../reDot"

class _TopBar extends React.Component{
  add=()=>{
    this.props.setData("showAddBox",true);
  }
  render(){
    return (
      <div className="topBar">
        <div className="btn primary" onClick={this.props.onAdd}> 
          <i className="fa fa-plus" aria-hidden="true"></i> 新建 
        </div>
        <div className="doneListLink"></div>
      </div>
    )
  }
}

export default watch([])(_TopBar);