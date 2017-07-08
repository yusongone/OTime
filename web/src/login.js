import React from "react"
import ReactDOM from "react-dom"
import "antd/dist/antd.less";

import  Form from 'antd/lib/form';
import  Icon from 'antd/lib/icon';
import  Input from 'antd/lib/input';
import  Button from 'antd/lib/button';
import  Checkbox from 'antd/lib/checkbox';
const FormItem = Form.Item;

import {ReDot,watch,createData} from "./reDot/index"
import {Get} from "./tools/http"
console.log(watch);

import "./style/login.less"

function form(props){
  const { getFieldDecorator } = props.form;
  return (
       <Form onSubmit={props.onSubmit} className="login-form">
        <FormItem>
          {getFieldDecorator('username', {
            rules: [{ required: true, message: 'Username is required!' }],
          })(
            <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Username" />
          )}
        </FormItem>
        <FormItem>
          {getFieldDecorator('pass', {
            rules: [{ required: true, message: 'Password is required!' }],
          })(
            <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
          )}
        </FormItem>
        <FormItem>
          <Checkbox>Remember me</Checkbox>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </FormItem>
      </Form>
  )
}

const LoginForm=watch(["username"])(Form.create({
  mapPropsToFields(props){
    return {
      username:{
        value:props.username
      },
      pass:{
        value:props.username
      }
    }
  },
  onFieldsChange(props, changedFields) {
    console.log(changedFields);
  },
  onValuesChange(props, values) {
    const key=Object.keys(values)[0];
    props.setData(key,values[key]);
  }

})(form));

class LoginPage extends React.Component{
  handleSubmit=(e)=>{
    e.preventDefault();
    const data=reDotData.getData();
    Get();
    console.log(data);
  }
  onValueChange=(_,values)=>{
    console.log(_,values);
  }
  render(){
    return (
      <div className="formBox">
        <LoginForm 
          onSubmit={this.handleSubmit} 
          />
      </div>
    );
  }
}

const reDotData=createData({
      username:"abcde",
      password:"abcde"
    });
ReactDOM.render(
  <ReDot 
    data={reDotData}>
    <LoginPage/>
  </ReDot>,
document.getElementById("page"));

