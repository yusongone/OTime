import React from "react"
import ReactDOM from "react-dom"
import InputMoment from "input-moment"
import moment from "moment"

import {CountDown} from "../components/countDown/index"
import {TargetTime} from "../components/targetTime/index"

class _DatePicker extends React.Component{
  constructor(p,c){
    super(p,c);

    this.state={
      moment:moment(new Date())
    }

  }

  render(){

    return (
      <InputMoment
        className="datepicker"
        moment={this.state.moment}
        onChange={(moment)=>{
          this.setState({
            moment:moment
          })
        }}
        onSave={()=>{
          this.props.onSave(this.state.moment);
        }}
        prevMonthIcon="ion-ios-arrow-left" // default
        nextMonthIcon="ion-ios-arrow-right" // default
      />
    )
  }
}

/*
*/

export default {
  open(date,saveHander){
    const div=document.createElement("div");
    div.className="datepickerBox"
    document.body.appendChild(div);

    const cd=(
      <TargetTime
        date={date}
        onSave={(item)=>{
          saveHander(item);
          div.remove();
        }}

        onCancel={()=>{
          div.remove();
        }}
       />
      
      /*
      <CountDown onChange={function(obj){
        console.log(obj);
      }} />
      */
    );
    ReactDOM.render(cd,div);
  }
};
