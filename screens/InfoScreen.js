import React from "react";
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';

export default class InfoScreen extends React.Component {
    static navigationOptions = {
      title: 'LIÊN HỆ',
    };
    render() {
      return (
        <ScrollView style={styles.container}>
        <Card title="CHỦ NHIỆM ĐỀ TÀI" titleStyle={styles.cardTitle}>
          <View>
            <Text style={[styles.cardHomeText, styles.cardText]}>Bùi Thị Cẩm Ngọc</Text>
            <Text style={[styles.cardText]}>Khoa Quản lý Đất đai - Trường Đại học Tài nguyên và Môi Trường - Hà Nội</Text>
            <Text style={[styles.cardText]}>0989094148</Text>
            <Text style={[styles.cardText]}>ngocbc83@gmail.com</Text>
          </View>
        </Card>

        <Card title="ĐƠN VỊ THỰC HIỆN" titleStyle={styles.cardTitle}>
          <View>
            <Text style={[styles.cardHomeText, styles.cardText]}>Nguyễn Xuân Linh</Text>
            <Text style={[styles.cardText]}>Khoa Địa lý - Trường Đại học Khoa học Tự nhiên - ĐHQGHN</Text>
            <Text style={[styles.cardText]}>0986937886</Text>
            <Text style={[styles.cardText]}>thayninh@gmail.com</Text>
          </View>
        </Card>
      </ScrollView>
      );
    }
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    cardTitle: {
      textAlign: 'left'
    },
    cardHomeText: {
      fontWeight: 'bold'
    },
    cardText: {
      marginBottom: 5,
    }
  });