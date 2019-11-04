import React, {Component} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {firebase} from '@react-native-firebase/messaging';
import {WebView} from 'react-native-webview';
import {getStatusBarHeight} from 'react-native-status-bar-height';

import NavigationBar from './src/components/NavigationBar';
import setupScript from './scripts/setup';
import configurePushService from './src/http/services/configurePushService';
import validateCredentialsService from './src/http/services/validateCredentialsService';

const BASE_URL = 'https://www.racker-bande.de/';
export default class App extends Component {
  state = {
    url: BASE_URL,
    isLoading: false,
  };

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
        await AsyncStorage.setItem('fcmToken', fcmToken);
        return fcmToken;
      }
    } else {
      return fcmToken;
    }
  }

  onMessage = async ({nativeEvent}) => {
    const data = JSON.parse(nativeEvent.data);
    const token = await this.checkPermission();
    switch (data.type) {
      case 'login':
        validateCredentialsService(data)
          .then(() => configurePushService({token, status: true}))
          .catch(() => {});
        break;
      case 'logout':
        configurePushService({token, status: false});
    }
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.isLoading && <ActivityIndicator />}

        <WebView
          key={1}
          source={{uri: this.state.url}}
          ref={ref => {
            this.webView = ref;
          }}
          style={styles.webView}
          javaScriptEnabled={true}
          injectedJavaScript={setupScript}
          onMessage={this.onMessage}
          onNavigationStateChange={state => {
            this.setState({url: state.url});
          }}
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
