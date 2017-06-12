import React from "react"
import ReactDOM from "react-dom"
import storage from "../tools/storage"
import "./popup.less"
import Lists from "./list"

class T extends React.Component{
  componentDidMount(){
    storage.getData();
  }
  render(){
    return (
      <div className="container">
        <div className="topBar"></div>
        <Lists />
      </div>
    )
  }
}

ReactDOM.render(<T />,document.getElementById("box"));

