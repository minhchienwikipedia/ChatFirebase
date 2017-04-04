import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator
} from 'react-native';
import Login from './views/loginView.js';
import Home from './views/homeView.js';
import Chat from './views/chatView.js';


class ChatFirebase extends Component {
  renderScene(route, navigator){
    if(route.name == 'home'){
      return <Home navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'chat'){
      return <Chat navigator = {navigator} {...route.passProps}/>
    }
    if(route.name == 'login'){
      return <Login navigator = {navigator} {...route.passProps}/>
    }

  }

  render() {
    return (
      <View style={{flex: 1}}>
        <Navigator
          initialRoute={{name:'login'}}
          renderScene={this.renderScene.bind(this)}
        />
      </View>

    );
  }
}

module.exports = ChatFirebase;
