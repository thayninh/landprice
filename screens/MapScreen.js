import React from "react";
import { StyleSheet, View, Text, Alert, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { Overlay, Button, Divider } from 'react-native-elements';

var defaultRegion = {
  latitude: 21,
  longitude: 105.8,
  latitudeDelta: 1,
  longitudeDelta: 1
}
var TSTDColor = "#FF0101"
var TSSSColor = "#0FFA07"

export default class MapScreen extends React.Component {
  static navigationOptions = {
    title: 'Bản Đồ',
  };

  constructor(props) {
    super(props);
    this.state = {
      region: defaultRegion,
      tstd_id: 0,
      tsss_id: 0,
      TSTDMarker: null,
      TSSSMarker: [],
      TSTDCurPosition: null,
      TSSSCurPosition: null,

      TSTDInputValuesArea: null,
      TSTDInputValuesLocation: null,
      TSTDInputValuesFacade: null,
      TSTDInputValuesLengh: null,
      TSTDInputValuesLegal: null,
      TSTDInputValuesRoad: null,

      TSTDOverlayVisible: false,
    };

    this.TSTDValuesObject = {};
    this.tsssmarkers = [];

    this.createTSTD = this.createTSTD.bind(this);
    this.TSTDOnPress = this.TSTDOnPress.bind(this);
    this.SaveTSTDOnPress = this.SaveTSTDOnPress.bind(this);
    this.CancelTSTDOnPress = this.CancelTSTDOnPress.bind(this);

    this.createTSSS = this.createTSSS.bind(this);
  }

  componentDidMount() {
    return navigator.geolocation.getCurrentPosition(position => {
      if (position) {
        this.setState({
          region: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02
          }
        });
      }

    });
  }

  createTSTD() {
    navigator.geolocation.getCurrentPosition(position => {
      if (position) {
        if (this.state.tstd_id == 0) {
          this.setState({
            TSTDCurPosition: { latitude: position.coords.latitude, longitude: position.coords.longitude },
          })

          this.setState({
            tstd_id: 1,
            TSTDMarker:
              <MapView.Marker draggable
                onPress={this.TSTDOnPress}
                key={this.state.tstd_id}
                coordinate={this.state.TSTDCurPosition}
                pinColor={TSTDColor}>
                {/* onDragEnd={(e) => this.setState({ x: e.nativeEvent.coordinate })} */}
              </MapView.Marker >
          });
        } else {
          Alert.alert("CHÚ Ý", "Bạn đã tạo Tài sản thẩm định.");
          return
        }
      }
    });
  }
 
  createTSSS() {
    navigator.geolocation.getCurrentPosition(position => {
      if (position) {
        this.setState({
          TSSSCurPosition: { latitude: position.coords.latitude, longitude: position.coords.longitude },
        });
        this.tsssmarkers.push(
          <MapView.Marker draggable
            key={this.state.tsss_id}
            onPress={this.TSSSOnPress}
            coordinate={this.state.TSSSCurPosition}
            pinColor={TSSSColor}>
            {/* onDragEnd={(e) => this.setState({ x: e.nativeEvent.coordinate })} */}
          </MapView.Marker >)

        this.setState({
          TSSSMarker: this.tsssmarkers
        });
        let id = this.state.tsss_id + 1
        this.setState({
          tsss_id: id
        });
      }
    });
  }

  TSTDOnPress() {
    this.setState({
      TSTDOverlayVisible: true
    });
  }

  SaveTSTDOnPress() {
    this.TSTDValuesObject = {
      area: this.state.TSTDInputValuesArea,
      location: this.state.TSTDInputValuesLocation,
      facade: this.state.TSTDInputValuesFacade,
      lengh: this.state.TSTDInputValuesLengh,
      legal: this.state.TSTDInputValuesLegal,
      road: this.state.TSTDInputValuesRoad
    }
    console.log(this.TSTDValuesObject);
    Alert.alert(
      'THÔNG BÁO',
      'Số liệu đã được lưu thành công',
      [
        { text: 'Thoát', onPress: () => this.setState({ TSTDOverlayVisible: false }) },
      ],
      { cancelable: false },
    );
  }

  CancelTSTDOnPress() {
    this.setState({
      TSTDOverlayVisible: false
    });
  }
  render() {
    return (

      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <MapView style={styles.map} showsUserLocation={true} provider={PROVIDER_GOOGLE} region={this.state.region}>
          {this.state.TSTDMarker}
          {this.state.TSSSMarker.map(marker => (marker))}
        </MapView>

        <View style={styles.containerButtons}>
          <View style={styles.Buttons}>
            <Button
              titleStyle={{ fontWeight: 'bold', fontSize: 30 }}
              type='clear'
              onPress={this.createTSTD}
              title="TĐ" />
          </View>
          <View style={styles.Buttons}>
            <Button
              titleStyle={{ fontWeight: 'bold', fontSize: 30 }}
              type='clear'
              onPress={this.createTSSS}
              title="SS" />
          </View>
        </View>

        <TaiSanTDSS
          title="TÀI SẢN THẨM ĐỊNH"
          isVisible={this.state.TSTDOverlayVisible}
          area={(text) => this.setState({ TSTDInputValuesArea: text })}
          valArea={this.state.TSTDInputValuesArea}
          location={(text) => this.setState({ TSTDInputValuesLocation: text })}
          valLocation={this.state.TSTDInputValuesLocation}
          facade={(text) => this.setState({ TSTDInputValuesFacade: text })}
          valFacade={this.state.TSTDInputValuesFacade}
          lengh={(text) => this.setState({ TSTDInputValuesLengh: text })}
          valLengh={this.state.TSTDInputValuesLengh}
          legal={(text) => this.setState({ TSTDInputValuesLegal: text })}
          valLegal={this.state.TSTDInputValuesLegal}
          road={(text) => this.setState({ TSTDInputValuesRoad: text })}
          valRoad={this.state.TSTDInputValuesRoad}
          tstdSaveOnPress={this.SaveTSTDOnPress}
          tstdExitOnPress={this.CancelTSTDOnPress}
          priceVisible={false}
        >
        </TaiSanTDSS>
      </KeyboardAvoidingView>

    );
  }
}

class TaiSanTDSS extends React.Component {
  constructor(props) {
    super(props);
  };
  render() {
    return (
      <Overlay
        isVisible={this.props.isVisible}
        width='60%'
        height="auto">
        <ScrollView>
          <View style={{ alignItems: 'center', paddingBottom: 10 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{this.props.title}</Text>
          </View>
          <View style={styles.ViewTextInputStyle}>
            <Text>Giá bán:  </Text>
            <View style={styles.TextInputStyleUnderline}>
              <TextInput
                editable={this.props.priceVisible}
                onChangeText={this.props.price}
                value={this.props.valPrice}
                placeholder={this.props.priceVisible ? 'Nhập giá bán' : 'Đã bị khóa'}
                style={styles.TextInputStyle}
              />
            </View>
          </View>

          <View style={styles.ViewTextInputStyle}>
            <Text>Diện Tích:  </Text>
            <View style={styles.TextInputStyleUnderline}>
              <TextInput
                onChangeText={this.props.area}
                value={this.props.valArea}
                placeholder='Nhập diện tích'
                style={styles.TextInputStyle}
              />
            </View>
          </View>
          <View style={styles.ViewTextInputStyle}>
            <Text>Vị trí:  </Text>
            <View style={styles.TextInputStyleUnderline}>
              <TextInput
                onChangeText={this.props.location}
                value={this.props.valLocation}
                placeholder='Nhập vị trí'
                style={styles.TextInputStyle}
              />
            </View>
          </View>
          <View style={styles.ViewTextInputStyle}>
            <Text>Mặt tiền:  </Text>
            <View style={styles.TextInputStyleUnderline}>
              <TextInput
                onChangeText={this.props.facade}
                value={this.props.valFacade}
                placeholder='Nhập mặt tiền'
                style={styles.TextInputStyle}
              />
            </View>
          </View>
          <View style={styles.ViewTextInputStyle}>
            <Text>Chiều sâu:  </Text>
            <View style={styles.TextInputStyleUnderline}>
              <TextInput
                onChangeText={this.props.lengh}
                value={this.props.valLengh}
                placeholder='Nhập chiều sâu'
                style={styles.TextInputStyle}
              />
            </View>
          </View>
          <View style={styles.ViewTextInputStyle}>
            <Text>Pháp lý:  </Text>
            <View style={styles.TextInputStyleUnderline}>
              <TextInput
                onChangeText={this.props.legal}
                value={this.props.valLegal}
                placeholder='Nhập pháp lý'
                style={styles.TextInputStyle}
              />
            </View>
          </View>
          <View style={styles.ViewTextInputStyle}>
            <Text>Giao thông:  </Text>
            <View style={styles.TextInputStyleUnderline}>
              <TextInput
                onChangeText={this.props.road}
                value={this.props.valRoad}
                placeholder='Nhập giao thông'
                style={styles.TextInputStyle}
              />
            </View>
          </View>

          <View style={styles.CancelOKButton}>
            <View style={{ paddingLeft: 12 }}>
              <Button
                titleStyle={{ fontSize: 12 }}
                title="Thoát Ra"
                onPress={this.props.tstdExitOnPress}
              >
              </Button>
            </View>
            <View style={{ paddingLeft: 15 }}>
              <Button
                titleStyle={{ fontSize: 12 }}
                title="Lưu Lại"
                onPress={this.props.tstdSaveOnPress}
              ></Button>
            </View>
          </View>
          <Divider></Divider>
          <Text style={{ paddingTop: 5, fontSize: 10, fontStyle: 'italic' }}>CHÚ Ý: Một vài chú ý hướng dẫn về cách nhập liệu sẽ được viết ở đây</Text>
        </ScrollView>
      </Overlay>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0,
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  map: {
    // position: 'absolute',
    // top: 0,
    // left: 0,
    // bottom: 0,
    // right: 0
    ...StyleSheet.absoluteFillObject,
  },
  containerButtons: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 100,
  },
  Buttons: {
    zIndex: 1,
    backgroundColor: '#FFCCFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: "#FFCCFF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 30,
    marginTop: 15,

  },
  CancelOKButton: {
    flexDirection: "row",
    justifyContent: 'flex-end',
    paddingBottom: 10

  },
  TextInputStyleUnderline: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'gray',
    height: 15,
    alignSelf: 'stretch',
    flex: 1
  },
  ViewTextInputStyle: {
    paddingBottom: 15,
    flexDirection: 'row'
  },
  TextInputStyle: {
    height: 15,
    flex: 1
  }
});