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
var items_rooms = [];
export default class Chat extends Component {
  constructor(props){
    super(props);
    items=[];
    this.state = {
      username: '',
      password: '',
      dataSource: new ListView.DataSource({rowHasChanged: (r1,r2)=>r1!==r2}),
      data: this.props.data,
      user_login: this.props.user_login,
      message: '',
      check_rooms: false,
    }
    database = firebase.database();
    user = firebase.database().ref('user');

  }
  componentWillMount(){
    var check = false;
    database.ref("rooms").once("value", (snap)=>{
        snap.forEach((data)=>{
          items_rooms.push({
            key: data.key,
            data: data.val(),
          });

        })
        for (var i = 0; i < items_rooms.length; i++) {
          if(items_rooms[i].data.user_1 === this.state.data.key && items_rooms[i].data.user_2 === this.state.user_login.key
          || items_rooms[i].data.user_2 === this.state.data.key && items_rooms[i].data.user_1 === this.state.user_login.key)
          {
            this.showMess(items_rooms[i].key);
            this.setState({
              check_rooms:true,
              info_rooms: items_rooms[i]});
          }
        }

    });


  }
  showMess(key){
    database.ref('message').child(key).on('value',(snap)=>{
      items=[];
      snap.forEach((data)=>{
        items.push({
          key: data.key,
          data: data.val(),
        });

      });
      for (var i = 0; i < items.length; i++) {
        if(items[i].data.username === this.state.user_login.username)
        {
          this.setState({dataSource: this.state.dataSource.cloneWithRows(items)});
        }

      }
    })
  }
  _renderRow(data){
    return(
      <View style={{flexDirection: 'row',justifyContent:'space-between',padding:10}}>
      <Text>
      {data.data.user.data.username} : {data.data.content}
      </Text>

      </View>
    )
  }
  onBack(routeName){
    this.props.navigator.pop({
      name: routeName,
      passProps: {

      }
    })
  }
  clearText(fieldName) {
    this.refs[fieldName].setNativeProps({text: ''});
    this.setState({
      sendColor: '#90949c',
    })
  }
  onSend(){
    var items = [];
    this.clearText('content')

      if(this.state.check_rooms)
      {
        message.child(this.state.info_rooms.key).push({
          user: this.state.user_login,
          content: this.state.message
        });

      }else {
        var items_rooms = [];
        database.ref('rooms').push({
          user_1: this.state.data.key,
          user_2: this.state.user_login.key
        });
        database.ref("rooms").on("value", (snap)=>{
            snap.forEach((data)=>{
              items_rooms.push({
                key: data.key,
                data: data.val(),
              });
              this.setState({key:data.key})
            })

          database.ref("message/"+this.state.key).push({
            user: this.state.user_login,
            content: this.state.message
          });
          this.showMess(this.state.key);
        });

      }



  }
  render() {
    return (
      <View style={{flex:1}}>
      <TouchableOpacity onPress={()=>this.onBack('home')} style={{width:deviceWidth,justifyContent:'center',height:40,backgroundColor:'rgb(60, 67, 240)'}}>
        <Text style={{fontSize:18,color:'white'}} >
          Back
        </Text>
      </TouchableOpacity>
        <Text>
        Chat with: {this.state.data.data.username}
        </Text>
        <ListView
        style={{flex:1}}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
        />
        <View style={{
          flexDirection:'row',
          justifyContent:'center',
          alignItems:'center',
          borderTopWidth:0.5,
          borderTopColor:'rgba(0,0,0,0.5)',
          position: 'absolute',
          bottom:0,
          left:0,

        }}>
          <TextInput style={{
            flex:1,
            margin:5,
            paddingTop:0,
            paddingBottom:0,
          }}  placeholder="Chat..."
          onChangeText={(val)=>this.setState({message:val})}
          ref={'content'}/>
          <Text onPress={()=>this.onSend()}>
          SEND
          </Text>
        </View>

      </View>

    );
  }
}
