import React from "react";

class List extends React.Component{
  render(){
    return (
      <div className="sandBox">
        <div className="statusBar" ></div>
        <div className="summary"  contentEditable></div>

      </div>
    );
  }
}

class Lists extends React.Component{
  render(){

      return <List />
  }
}


export default Lists;