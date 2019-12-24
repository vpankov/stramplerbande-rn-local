import React, { Component } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { firebase } from '@react-native-firebase/messaging';
import { WebView } from 'react-native-webview';
import { getStatusBarHeight } from 'react-native-status-bar-height';

import NavigationBar from './src/components/NavigationBar';
import setupScript from './scripts/setup';
import configurePushService from './src/http/services/configurePushService';
import validateCredentialsService from './src/http/services/validateCredentialsService';
import { saveCredentials } from './src/store';
import { requestNotifications } from 'react-native-permissions';

const BASE_URL = 'http://sbtest.theleanapps.com/';
export default class App extends Component {
  state = {
    url: BASE_URL,
    isLoading: false,
    token: 'none'
  };
  async componentDidMount() {
    // Resolving bug with empty token on first getToken request
    firebase.messaging().requestPermission()
      .then((value) => {
        firebase.messaging().getToken()
          .then(token => {
            console.log(token);
          })
      })
    //Permissions request
    await requestNotifications(['alert', 'badge', 'sound']);

  }
  checkPermission() {
    return firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          console.log('Permission granted');
          return this.getToken();
        } else {
          console.log('Request Permission');
          return this.requestPermission();
        }
      })
      .catch(err => console.log(err));
  }

  requestPermission() {
    return firebase
      .messaging()
      .requestPermission()
      .then(() => {
        return this.getToken();
      })
      .catch(error => {
        console.log('permission rejected');
      });
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.log('after fcmToken: ', fcmToken);
        this.setState({ token: fcmToken });
        await AsyncStorage.setItem('fcmToken', fcmToken);
        return fcmToken;
      }
    } else {
      return fcmToken;
    }
  }

  onMessage = async ({ nativeEvent }) => {
    const data = JSON.parse(nativeEvent.data);
    const token = await this.checkPermission();
    console.log('onMessage');
    switch (data.type) {
      case 'login':
        console.log('login');
        await saveCredentials(data.username, data.password);
        validateCredentialsService(data)
          .then(() => {

            configurePushService({ token, status: true });
            console.log('success', token);
          })
          .catch(() => console.log('error'));
        break;
      case 'logout':
        configurePushService({ token, status: false });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading && <ActivityIndicator />}
        <WebView
          key={1}
          source={{ uri: this.state.url }}
          ref={ref => {
            this.webView = ref;
          }}
          style={styles.webView}
          javaScriptEnabled={true}
          injectedJavaScript={setupScript}
          onMessage={this.onMessage}
          onNavigationStateChange={state => {
            this.setState({ url: state.url });
          }}
          onError={
            ()=>{
              this.webView.reload();
            }
          }
          onLoadStart={() => {
            this.setState({
              isLoading: true,
            });
          }}
          onLoadEnd={() => {
            this.setState({
              isLoading: false,
            });
          }}
        />
        <NavigationBar
          goBack={() => this.webView.goBack()}
          reload={() => this.webView.reload()}
          goForward={() => this.webView.goForward()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#708fa0',
    paddingTop: getStatusBarHeight(),
  },
  webView: {
    backgroundColor: '#708fa0',
    flex: 1,
  },
});
/*
import React, { Component } from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { firebase } from '@react-native-firebase/messaging';
import { requestNotifications } from 'react-native-permissions';
export default class App extends Component {

  async componentDidMount() {
    await requestNotifications(['alert', 'badge', 'sound']);
    const registrationToken = await firebase.messaging().getToken();
    console.log(instanceId, registrationToken);
  }

  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log('before fcmToken: ', fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        console.log('after fcmToken: ', fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  async requestPermission() {
    firebase
      .messaging()
      .requestPermission()
      .then(() => {
        this.getToken();
      })
      .catch(error => {
        console.log('permission rejected');
      });
  }

  async checkPermission() {
    firebase
      .messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
          console.log('Permission granted');
          this.getToken();
        } else {
          console.log('Request Permission');
          this.requestPermission();
        }
      })
      .catch(err => console.log(err));
  }

  render() {
    return (
      <View>
        <Text>Hello</Text>
      </View>
    );
  }
}
*/