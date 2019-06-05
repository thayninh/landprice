import React from "react";
import { StyleSheet, View, Text } from 'react-native';

export default class MapScreen extends React.Component {
    static navigationOptions = {
      title: 'Bản Đồ',
    };
    render() {
      return (
        <View style={styles.container}>
          <Text>Ban Do</Text>
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    }
  });