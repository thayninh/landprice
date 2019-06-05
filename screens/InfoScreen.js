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
        <Card title="Phòng trực ban thiên tai 24/24" titleStyle={styles.cardTitle}>
          <View>
            <Text style={[styles.cardHomeText, styles.cardText]}>Tỉnh Lào Cai</Text>
            <Text style={[styles.cardText]}>Tỉnh Lào Cai, Việt Nam</Text>
            <Text style={[styles.cardText]}>(+84-xx) xxxxxxx</Text>
            <Text style={[styles.cardText]}>contact@laocai.vn</Text>
          </View>
        </Card>

        <Card title="Tổng cục phòng chống thiên tai" titleStyle={styles.cardTitle}>
          <View>
            <Text style={[styles.cardHomeText, styles.cardText]}>Phòng 105, tầng 28</Text>
            <Text style={[styles.cardText]}>Toà nhà Sông Đà, Phạm Hùng, Hà Nội</Text>
            <Text style={[styles.cardText]}>(+84-24) 62538352</Text>
            <Text style={[styles.cardText]}>contact@laocai.vn</Text>
          </View>
        </Card>

        <Card title="Ban ứng phó thiên tai khẩn cấp" titleStyle={styles.cardTitle}>
          <View>
            <Text style={[styles.cardHomeText, styles.cardText]}>Phòng 208, tầng 4</Text>
            <Text style={[styles.cardText]}>Tòa nhà hành chính, số 8 đường Phạm Ngũ Lão</Text>
            <Text style={[styles.cardText]}>(+84-94) 3672345</Text>
            <Text style={[styles.cardText]}>contact@laocai.org</Text>
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