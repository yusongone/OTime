import React from "react"
import ReactDOM from "react-dom"
import InputMoment from "input-moment"
import moment from "moment"

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
  open(saveHander){
    const div=document.createElement("div");
    div.className="datepickerBox"
    document.body.appendChild(div);

    function save(value){
      saveHander(value.format("x"));
      div.remove();
    }

    ReactDOM.render(<_DatePicker onSave={save}/>,div);
  }
};
