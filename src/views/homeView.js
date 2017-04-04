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
export default class Home extends Component {
  constructor(props){
    super(props);
    items=[];
    this.state = {
      username: '',
      password: '',
      dataSource: new ListView.DataSource({rowHasChanged: (r1,r2)=>r1!==r2}),
      user_login: this.props.data,
    }
    database = firebase.database();
    user = firebase.database().ref('user');

  }
  redirect(routeName,data){
    this.props.navigator.push({
      name: routeName,
      passProps: {
        data: data,
        user_login: this.props.data,
      }
    })
  }
  componentWillMount(){
    database.ref('user').on('value',(snap)=>{
      items=[];
      snap.forEach((data)=>{
        value = data.val();
        if(value.username != this.state.user_login.data.username)
        {
          items.push({
            key: data.key,
            data: data.val(),
          });
        }

      });
      this.setState({dataSource: this.state.dataSource.cloneWithRows(items)});
    })
  }
  submit(){
    user.push({
      username: this.state.username,
      password: this.state.password
    });
  }
  _renderRow(data){
    return(
      <View style={{flexDirection: 'row',justifyContent:'space-between',padding:10}}>
      <Text>
      {data.data.username}
      </Text>
      <Text onPress={()=>this.redirect('chat',data)}>
      Chat
      </Text>
      </View>
    )
  }
  render() {
    return (
      <View style={{flex:1}}>
        <TextInput placeholder="username" onChangeText={(val)=>this.setState({username:val})}/>
        <TextInput placeholder="password"
        secureTextEntry={true}
        onChangeText={(val)=>this.setState({password:val})}/>
        <TouchableOpacity onPress={()=>this.submit()} style={{width:deviceWidth,alignItems:'center',justifyContent:'center',height:40,backgroundColor:'rgb(246, 71, 71)'}}>
          <Text  style={{fontSize:18,color:'white'}}>
              Add user
          </Text>
        </TouchableOpacity>

        <View style={{width:deviceWidth,alignItems:'center',justifyContent:'center',height:40,backgroundColor:'rgb(60, 67, 240)'}}>
          <Text style={{fontSize:18,color:'white'}}>
            List User
          </Text>
        </View>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
        />
      </View>

    );
  }
}
