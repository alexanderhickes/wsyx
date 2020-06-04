import React from 'react';
import {
  AppRegistry,
  StyleSheet, 
  Text, 
  View,
 } from 'react-native';

import Main from './src/main';

export default class wysxApp extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Main {...this.prop}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
