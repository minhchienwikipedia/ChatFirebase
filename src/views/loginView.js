import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  ListView,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import firebase from '../api.js';
var deviceWidth = Dimensions.get('window').width;
var deviceHeight = Dimensions.get('window').height;
export default class Login extends Component {
  constructor(props){
    super(props);
    items=[];
    this.state = {
      username: '',
      password: '',
      dataSource: new ListView.DataSource({rowHasChanged: (r1,r2)=>r1!==r2}),
      message: '',
    }
    database = firebase.database();
    user = firebase.database().ref('user');
    message = firebase.database().ref('message');
  }
  componentWillMount(){


    // console.log(this.props.data);
  }

  onLogin(){
    var items = [];
    var check = false;
    database.ref("user").on("value", (snap)=>{
      snap.forEach((data)=>{
        items.push({
          key: data.key,
          data: data.val(),
        });
      });
      for (var i = 0; i < items.length; i++) {
        if(items[i].data.username === this.state.username && items[i].data.password === this.state.password)
        {
          this.redirect('home',items[i]);
          check = true;
        }

      }
      if(check==false)
      {
        alert("Login fail.!");
      }
    });
  }

  redirect(routeName,data){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        data: data
      }
    })
  }

  render() {
    return (
      <View style={{flex:1}}>
        <TextInput placeholder="username" onChangeText={(val)=>this.setState({username:val})}/>
        <TextInput placeholder="password"
        secureTextEntry={true}
        onChangeText={(val)=>this.setState({password:val})}/>
        <TouchableOpacity onPress={()=>this.onLogin()} style={{width:deviceWidth,alignItems:'center',justifyContent:'center',height:40,backgroundColor:'rgb(60, 67, 240)'}}>
          <Text  style={{fontSize:18,color:'white'}}>
            Login
          </Text>
        </TouchableOpacity>

      </View>

    );
  }
}
