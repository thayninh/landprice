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

      FinalPriceSS1: 0,
      FinalPriceSS2: 0,
      FinalPriceSS3: 0,

      tstd_id: 0,
      tsss1_id: 1,
      tsss2_id: 2,
      tsss3_id: 3,

      TSTDMarker: null,
      TSSS1Marker: null,
      TSSS2Marker: null,
      TSSS3Marker: null,

      TSTDCurPosition: null,
      TSSSCurPosition: null,

      TSTDInputValuesArea: null,
      TSTDInputValuesLocation: null,
      TSTDInputValuesFacade: null,
      TSTDInputValueslength: null,
      TSTDInputValuesLegal: null,
      TSTDInputValuesRoad: null,

      TSSS1InputValuesArea: null,
      TSSS1InputValuesLocation: null,
      TSSS1InputValuesFacade: null,
      TSSS1InputValueslength: null,
      TSSS1InputValuesLegal: null,
      TSSS1InputValuesRoad: null,
      TSSS1InputValuesPrice: null,

      TSSS2InputValuesArea: null,
      TSSS2InputValuesLocation: null,
      TSSS2InputValuesFacade: null,
      TSSS2InputValueslength: null,
      TSSS2InputValuesLegal: null,
      TSSS2InputValuesRoad: null,
      TSSS2InputValuesPrice: null,

      TSSS3InputValuesArea: null,
      TSSS3InputValuesLocation: null,
      TSSS3InputValuesFacade: null,
      TSSS3InputValueslength: null,
      TSSS3InputValuesLegal: null,
      TSSS3InputValuesRoad: null,
      TSSS3InputValuesPrice: null,

      provinceValue: null,
      districtValue: null,
      communeValue: null,
      mapNumber: null,
      parcelNumber: null,
      usernameValue: null,
      passwordValue: null,

      TSTDOverlayVisible: false,
      TSSS1OverlayVisible: false,
      TSSS2OverlayVisible: false,
      TSSS3OverlayVisible: false,
      UpdateOverlayVisible: false,
    };

    this.TSTDValuesObject = {};
    this.TSSS1ValuesObject = {};
    this.TSSS2ValuesObject = {};
    this.TSSS3ValuesObject = {};


    this.createTSTD = this.createTSTD.bind(this);
    this.TSTDOnPress = this.TSTDOnPress.bind(this);
    this.SaveTSTDOnPress = this.SaveTSTDOnPress.bind(this);
    this.CancelTSTDOnPress = this.CancelTSTDOnPress.bind(this);

    this.createTSSS1 = this.createTSSS1.bind(this);
    this.TSSS1OnPress = this.TSSS1OnPress.bind(this);
    this.SaveTSSS1OnPress = this.SaveTSSS1OnPress.bind(this);
    this.CancelTSSS1OnPress = this.CancelTSSS1OnPress.bind(this);

    this.createTSSS2 = this.createTSSS2.bind(this);
    this.TSSS2OnPress = this.TSSS2OnPress.bind(this);
    this.SaveTSSS2OnPress = this.SaveTSSS2OnPress.bind(this);
    this.CancelTSSS2OnPress = this.CancelTSSS2OnPress.bind(this);

    this.createTSSS3 = this.createTSSS3.bind(this);
    this.TSSS3OnPress = this.TSSS3OnPress.bind(this);
    this.SaveTSSS3OnPress = this.SaveTSSS3OnPress.bind(this);
    this.CancelTSSS3OnPress = this.CancelTSSS3OnPress.bind(this);

    this.calculatePrice = this.calculatePrice.bind(this);
    this.connectDB = this.connectDB.bind(this);
    this.SaveUpdateOnPress = this.SaveUpdateOnPress.bind(this);
    this.CancelUpdateOnPress = this.CancelUpdateOnPress.bind(this);
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

  //calculatePrice funciton
  calculatePrice(tstdValues, tsssValues, tsss_id) {
    //Area comparison
    let TyLe_Area = (100 + (((Number(tstdValues.area) - Number(tsssValues.area)) / 5)));
    let TyLeDieuChinh_Area = ((100 - TyLe_Area) / TyLe_Area) * 100;
    let MucDieuChinh_Area = ((Number(tsssValues.price) * TyLeDieuChinh_Area) / 100);
    console.log(TyLe_Area + " - " + TyLeDieuChinh_Area + " - " + MucDieuChinh_Area);
    //Location comparison
    let TyLe_Location = (100 - (Number(tstdValues.location) - Number(tsssValues.location)) / 0.1);
    let TyLeDieuChinh_Location = ((100 - TyLe_Location) / TyLe_Location) * 100;
    let MucDieuChinh_Location = ((Number(tsssValues.price) * TyLeDieuChinh_Location) / 100);
    console.log(TyLe_Location + " - " + TyLeDieuChinh_Location + " - " + MucDieuChinh_Location);
    //Facade comparison
    let TyLe_Facade = (100 - ((Number(tstdValues.facade) - Number(tsssValues.facade)) / (Number(tstdValues.facade) * Number(tsssValues.facade))) * 100);
    let TyLeDieuChinh_Facade = ((100 - TyLe_Facade) / TyLe_Facade) * 100;
    let MucDieuChinh_Facade = ((Number(tsssValues.price) * TyLeDieuChinh_Facade) / 100);
    console.log(TyLe_Facade + " - " + TyLeDieuChinh_Facade + " - " + MucDieuChinh_Facade);
    //Length comparison
    let TyLe_Length = (100 - ((Number(tstdValues.length) - Number(tsssValues.length)) / (Number(tstdValues.length) * Number(tsssValues.length))) * 100);
    let TyLeDieuChinh_Length = ((100 - TyLe_Length) / TyLe_Length) * 100;
    let MucDieuChinh_length = ((Number(tsssValues.price) * TyLeDieuChinh_Length) / 100);
    console.log(TyLe_Length + " - " + TyLeDieuChinh_Length + " - " + MucDieuChinh_length);
    //Road comparison
    let TyLe_Road = (100 - (Number(tstdValues.road) - Number(tsssValues.road)) / 0.1);
    let TyLeDieuChinh_Road = ((100 - TyLe_Road) / TyLe_Road) * 100;
    let MucDieuChinh_Road = ((Number(tsssValues.price) * TyLeDieuChinh_Road) / 100);
    console.log(TyLe_Road + " - " + TyLeDieuChinh_Road + " - " + MucDieuChinh_Road);
    //Legal comparison
    var TyLe_Legal = null;
    if (Number(tstdValues.legal) - Number(tsssValues.legal) == 0) {
      TyLe_Legal = 100;
    } else if (Number(tstdValues.legal) - Number(tsssValues.legal) < 0) {
      TyLe_Legal = 105;
    } else {
      TyLe_Legal = 95;
    }
    let TyLeDieuChinh_Legal = ((100 - TyLe_Legal) / TyLe_Legal) * 100;
    let MucDieuChinh_Legal = ((Number(tsssValues.price) * TyLeDieuChinh_Legal) / 100);
    console.log(TyLe_Legal + " - " + TyLeDieuChinh_Legal + " - " + MucDieuChinh_Legal);
    //Calculate FinalPriceSS
    let FinalPriceSS = Number(tsssValues.price) + MucDieuChinh_Area + MucDieuChinh_Location + MucDieuChinh_Facade + MucDieuChinh_length + MucDieuChinh_Road + MucDieuChinh_Legal
    if (tsss_id == 1) {
      this.setState({ FinalPriceSS1: FinalPriceSS });
    } else if (tsss_id == 2) {
      this.setState({ FinalPriceSS2: FinalPriceSS });
    } else if (tsss_id == 3) {
      this.setState({ FinalPriceSS3: FinalPriceSS });
    }
    console.log(tsss_id);
    console.log(this.state.FinalPriceSS1 + ' + ' + this.state.FinalPriceSS2 + ' + ' + this.state.FinalPriceSS3);
    console.log("======================================================================================");
  }

  //Connect database
  connectDB() {
    this.setState({
      UpdateOverlayVisible: true
    });
  }

  SaveUpdateOnPress(){
    console.log("ok save")
  }

  CancelUpdateOnPress(){
    this.setState({
      UpdateOverlayVisible: false
    });
  }


  //Tài sản thẩm định--------------------------------------------------------------------------------------
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
      length: this.state.TSTDInputValueslength,
      legal: this.state.TSTDInputValuesLegal,
      road: this.state.TSTDInputValuesRoad
    }
    Alert.alert(
      'THÔNG BÁO',
      'Tài sản thẩm định đã lưu thành công',
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

  //Tài sản so sánh 1 ---------------------------------------------------------------------------------------

  createTSSS1() {
    navigator.geolocation.getCurrentPosition(position => {
      if (position) {
        if (this.state.tsss1_id == 1) {
          this.setState({
            TSSSCurPosition: { latitude: position.coords.latitude, longitude: position.coords.longitude },
          })

          this.setState({
            tsss1_id: 2,
            TSSS1Marker:
              <MapView.Marker draggable
                onPress={this.TSSS1OnPress}
                key={this.state.tsss1_id}
                coordinate={this.state.TSSSCurPosition}
                pinColor={TSSSColor}>
                {/* onDragEnd={(e) => this.setState({ x: e.nativeEvent.coordinate })} */}
              </MapView.Marker >
          });
        } else {
          Alert.alert("CHÚ Ý", "Bạn đã tạo Tài sản so sánh 1.");
          return
        }
      }
    });
  }

  TSSS1OnPress() {
    this.setState({
      TSSS1OverlayVisible: true
    });
  }

  SaveTSSS1OnPress() {
    this.TSSS1ValuesObject = {
      price: this.state.TSSS1InputValuesPrice,
      area: this.state.TSSS1InputValuesArea,
      location: this.state.TSSS1InputValuesLocation,
      facade: this.state.TSSS1InputValuesFacade,
      length: this.state.TSSS1InputValueslength,
      legal: this.state.TSSS1InputValuesLegal,
      road: this.state.TSSS1InputValuesRoad
    }

    this.calculatePrice(this.TSTDValuesObject, this.TSSS1ValuesObject, this.state.tsss1_id);

    Alert.alert(
      'THÔNG BÁO',
      'Tài sản so sánh 1 đã lưu thành công',
      [
        { text: 'Thoát', onPress: () => this.setState({ TSSS1OverlayVisible: false }) },
      ],
      { cancelable: false },
    );
  }

  CancelTSSS1OnPress() {
    this.setState({
      TSSS1OverlayVisible: false
    });
  }

  //Tài sản so sánh 2 ---------------------------------------------------------------------------------------

  createTSSS2() {
    navigator.geolocation.getCurrentPosition(position => {
      if (position) {
        if (this.state.tsss2_id == 2) {
          this.setState({
            TSSSCurPosition: { latitude: position.coords.latitude, longitude: position.coords.longitude },
          })

          this.setState({
            tsss2_id: 3,
            TSSS2Marker:
              <MapView.Marker draggable
                onPress={this.TSSS2OnPress}
                key={this.state.tsss2_id}
                coordinate={this.state.TSSSCurPosition}
                pinColor={TSSSColor}>
                {/* onDragEnd={(e) => this.setState({ x: e.nativeEvent.coordinate })} */}
              </MapView.Marker >
          });
        } else {
          Alert.alert("CHÚ Ý", "Bạn đã tạo Tài sản so sánh 2.");
          return
        }
      }
    });
  }

  TSSS2OnPress() {
    this.setState({
      TSSS2OverlayVisible: true
    });
  }

  SaveTSSS2OnPress() {
    this.TSSS2ValuesObject = {
      price: this.state.TSSS2InputValuesPrice,
      area: this.state.TSSS2InputValuesArea,
      location: this.state.TSSS2InputValuesLocation,
      facade: this.state.TSSS2InputValuesFacade,
      length: this.state.TSSS2InputValueslength,
      legal: this.state.TSSS2InputValuesLegal,
      road: this.state.TSSS2InputValuesRoad
    }

    this.calculatePrice(this.TSTDValuesObject, this.TSSS2ValuesObject, this.state.tsss2_id);

    Alert.alert(
      'THÔNG BÁO',
      'Tài sản so sánh 2 đã lưu thành công',
      [
        { text: 'Thoát', onPress: () => this.setState({ TSSS2OverlayVisible: false }) },
      ],
      { cancelable: false },
    );
  }

  CancelTSSS2OnPress() {
    this.setState({
      TSSS2OverlayVisible: false
    });
  }

  //Tài sản so sánh 3 ---------------------------------------------------------------------------------------

  createTSSS3() {
    navigator.geolocation.getCurrentPosition(position => {
      if (position) {
        if (this.state.tsss3_id == 3) {
          this.setState({
            TSSSCurPosition: { latitude: position.coords.latitude, longitude: position.coords.longitude },
          })

          this.setState({
            tsss3_id: 4,
            TSSS3Marker:
              <MapView.Marker draggable
                onPress={this.TSSS3OnPress}
                key={this.state.tsss3_id}
                coordinate={this.state.TSSSCurPosition}
                pinColor={TSSSColor}>
                {/* onDragEnd={(e) => this.setState({ x: e.nativeEvent.coordinate })} */}
              </MapView.Marker >
          });
        } else {
          Alert.alert("CHÚ Ý", "Bạn đã tạo Tài sản so sánh 3.");
          return
        }
      }
    });
  }

  TSSS3OnPress() {
    this.setState({
      TSSS3OverlayVisible: true
    });
  }

  SaveTSSS3OnPress() {
    this.TSSS3ValuesObject = {
      price: this.state.TSSS3InputValuesPrice,
      area: this.state.TSSS3InputValuesArea,
      location: this.state.TSSS3InputValuesLocation,
      facade: this.state.TSSS3InputValuesFacade,
      length: this.state.TSSS3InputValueslength,
      legal: this.state.TSSS3InputValuesLegal,
      road: this.state.TSSS3InputValuesRoad
    }

    this.calculatePrice(this.TSTDValuesObject, this.TSSS3ValuesObject, this.state.tsss3_id);

    Alert.alert(
      'THÔNG BÁO',
      'Tài sản so sánh 3 đã lưu thành công',
      [
        { text: 'Thoát', onPress: () => this.setState({ TSSS3OverlayVisible: false }) },
      ],
      { cancelable: false },
    );
  }

  CancelTSSS3OnPress() {
    this.setState({
      TSSS3OverlayVisible: false
    });
  }

  render() {
    return (

      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <MapView style={styles.map} showsUserLocation={true} provider={PROVIDER_GOOGLE} region={this.state.region}>
          {this.state.TSTDMarker}
          {this.state.TSSS1Marker}
          {this.state.TSSS2Marker}
          {this.state.TSSS3Marker}
        </MapView>

        <View style={styles.containerButtons}>
          <View style={styles.Buttons}>
            <Button
              titleStyle={{ fontWeight: 'bold', fontSize: 15, color: 'black' }}
              type='clear'
              onPress={this.connectDB}
              title={((this.state.FinalPriceSS1 + this.state.FinalPriceSS2 + this.state.FinalPriceSS3) / 3).toString()} />
          </View>
          <View style={styles.Buttons}>
            <Button
              titleStyle={{ fontWeight: 'bold', fontSize: 20 }}
              type='clear'
              onPress={this.createTSTD}
              title="TĐ" />
          </View>
          <View style={styles.Buttons}>
            <Button
              titleStyle={{ fontWeight: 'bold', fontSize: 20 }}
              type='clear'
              onPress={this.createTSSS1}
              title="S1" />
          </View>
          <View style={styles.Buttons}>
            <Button
              titleStyle={{ fontWeight: 'bold', fontSize: 20 }}
              type='clear'
              onPress={this.createTSSS2}
              title="S2" />
          </View>
          <View style={styles.Buttons}>
            <Button
              titleStyle={{ fontWeight: 'bold', fontSize: 20 }}
              type='clear'
              onPress={this.createTSSS3}
              title="S3" />
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
          length={(text) => this.setState({ TSTDInputValueslength: text })}
          vallength={this.state.TSTDInputValueslength}
          legal={(text) => this.setState({ TSTDInputValuesLegal: text })}
          valLegal={this.state.TSTDInputValuesLegal}
          road={(text) => this.setState({ TSTDInputValuesRoad: text })}
          valRoad={this.state.TSTDInputValuesRoad}
          tstdSaveOnPress={this.SaveTSTDOnPress}
          tstdExitOnPress={this.CancelTSTDOnPress}
          priceVisible={false}>
        </TaiSanTDSS>

        <TaiSanTDSS
          title="TÀI SẢN SO SÁNH 1"
          isVisible={this.state.TSSS1OverlayVisible}
          area={(text) => this.setState({ TSSS1InputValuesArea: text })}
          valArea={this.state.TSSS1InputValuesArea}
          location={(text) => this.setState({ TSSS1InputValuesLocation: text })}
          valLocation={this.state.TSSS1InputValuesLocation}
          facade={(text) => this.setState({ TSSS1InputValuesFacade: text })}
          valFacade={this.state.TSSS1InputValuesFacade}
          length={(text) => this.setState({ TSSS1InputValueslength: text })}
          vallength={this.state.TSSS1InputValueslength}
          legal={(text) => this.setState({ TSSS1InputValuesLegal: text })}
          valLegal={this.state.TSSS1InputValuesLegal}
          road={(text) => this.setState({ TSSS1InputValuesRoad: text })}
          valRoad={this.state.TSSS1InputValuesRoad}
          priceVisible={true}
          price={(text) => this.setState({ TSSS1InputValuesPrice: text })}
          valPrice={this.state.TSSS1InputValuesPrice}
          tstdSaveOnPress={this.SaveTSSS1OnPress}
          tstdExitOnPress={this.CancelTSSS1OnPress}>
        </TaiSanTDSS>

        <TaiSanTDSS
          title="TÀI SẢN SO SÁNH 2"
          isVisible={this.state.TSSS2OverlayVisible}
          area={(text) => this.setState({ TSSS2InputValuesArea: text })}
          valArea={this.state.TSSS2InputValuesArea}
          location={(text) => this.setState({ TSSS2InputValuesLocation: text })}
          valLocation={this.state.TSSS2InputValuesLocation}
          facade={(text) => this.setState({ TSSS2InputValuesFacade: text })}
          valFacade={this.state.TSSS2InputValuesFacade}
          length={(text) => this.setState({ TSSS2InputValueslength: text })}
          vallength={this.state.TSSS2InputValueslength}
          legal={(text) => this.setState({ TSSS2InputValuesLegal: text })}
          valLegal={this.state.TSSS2InputValuesLegal}
          road={(text) => this.setState({ TSSS2InputValuesRoad: text })}
          valRoad={this.state.TSSS2InputValuesRoad}
          priceVisible={true}
          price={(text) => this.setState({ TSSS2InputValuesPrice: text })}
          valPrice={this.state.TSSS2InputValuesPrice}
          tstdSaveOnPress={this.SaveTSSS2OnPress}
          tstdExitOnPress={this.CancelTSSS2OnPress}>
        </TaiSanTDSS>

        <TaiSanTDSS
          title="TÀI SẢN SO SÁNH 3"
          isVisible={this.state.TSSS3OverlayVisible}
          area={(text) => this.setState({ TSSS3InputValuesArea: text })}
          valArea={this.state.TSSS3InputValuesArea}
          location={(text) => this.setState({ TSSS3InputValuesLocation: text })}
          valLocation={this.state.TSSS3InputValuesLocation}
          facade={(text) => this.setState({ TSSS3InputValuesFacade: text })}
          valFacade={this.state.TSSS3InputValuesFacade}
          length={(text) => this.setState({ TSSS3InputValueslength: text })}
          vallength={this.state.TSSS3InputValueslength}
          legal={(text) => this.setState({ TSSS3InputValuesLegal: text })}
          valLegal={this.state.TSSS3InputValuesLegal}
          road={(text) => this.setState({ TSSS3InputValuesRoad: text })}
          valRoad={this.state.TSSS3InputValuesRoad}
          priceVisible={true}
          price={(text) => this.setState({ TSSS3InputValuesPrice: text })}
          valPrice={this.state.TSSS3InputValuesPrice}
          tstdSaveOnPress={this.SaveTSSS3OnPress}
          tstdExitOnPress={this.CancelTSSS3OnPress}>
        </TaiSanTDSS>

        <UpdateDatabase
          title="CẬP NHẬT GIÁ ĐẤT"
          isVisible={this.state.UpdateOverlayVisible}
          province={(text) => this.setState({ provinceValue: text })}
          valProvince={this.state.provinceValue}
          district={(text) => this.setState({ districtValue: text })}
          valDistrict={this.state.districtValue}
          commune={(text) => this.setState({ communeValue: text })}
          valCommune={this.state.communeValue}
          mapNumber={(text) => this.setState({ mapNumberValue: text })}
          valMapNumber={this.state.mapNumberValue}
          parcelNumber={(text) => this.setState({ parcelNumberValue: text })}
          valParcelNumber={this.state.parcelNumberValue}
          username={(text) => this.setState({ usernameValue: text })}
          valUsername={this.state.usernameValue}
          password={(text) => this.setState({ passwordValue: text })}
          valPassword={this.state.passwordValue}
          updateSaveOnPress={this.SaveUpdateOnPress}
          updateExitOnPress={this.CancelUpdateOnPress}
          >
        </UpdateDatabase>
      </KeyboardAvoidingView>

    );
  }
}

class UpdateDatabase extends React.Component {
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
            <Text>Tên Tỉnh:  </Text>
            <View style={styles.TextInputStyleUnderline}>
              <TextInput
                onChangeText={this.props.province}
                value={this.props.valProvince}
                placeholder={'Nhập Tên Tỉnh'}
                style={styles.TextInputStyle}
              />
            </View>
          </View>
          <View style={styles.ViewTextInputStyle}>
            <Text>Tên Huyện:  </Text>
            <View style={styles.TextInputStyleUnderline}>
              <TextInput
                onChangeText={this.props.district}
                value={this.props.valdistrict}
                placeholder='Nhập Tên Huyện'
                style={styles.TextInputStyle}
              />
            </View>
          </View>
          <View style={styles.ViewTextInputStyle}>
            <Text>Tên Xã:  </Text>
            <View style={styles.TextInputStyleUnderline}>
              <TextInput
                onChangeText={this.props.commune}
                value={this.props.valCommune}
                placeholder='Nhập Tên Xã'
                style={styles.TextInputStyle}
              />
            </View>
          </View>
          <View style={styles.ViewTextInputStyle}>
            <Text>Số Tờ Bản Đồ:  </Text>
            <View style={styles.TextInputStyleUnderline}>
              <TextInput
                onChangeText={this.props.mapNumber}
                value={this.props.valMapNumber}
                placeholder='Nhập Số Tờ Bản Đồ'
                style={styles.TextInputStyle}
              />
            </View>
          </View>
          <View style={styles.ViewTextInputStyle}>
            <Text>Số Hiệu Thửa:  </Text>
            <View style={styles.TextInputStyleUnderline}>
              <TextInput
                onChangeText={this.props.parcelNumber}
                value={this.props.valParcelNumber}
                placeholder='Nhập Số Hiệu Thửa'
                style={styles.TextInputStyle}
              />
            </View>
          </View>
          <View style={styles.ViewTextInputStyle}>
            <Text>Tên Đăng Nhập:  </Text>
            <View style={styles.TextInputStyleUnderline}>
              <TextInput
                onChangeText={this.props.username}
                value={this.props.valUsername}
                placeholder='Nhập Tên'
                style={styles.TextInputStyle}
              />
            </View>
          </View>
          <View style={styles.ViewTextInputStyle}>
            <Text>Mật Khẩu:  </Text>
            <View style={styles.TextInputStyleUnderline}>
              <TextInput
                secureTextEntry={true}
                onChangeText={this.props.password}
                value={this.props.valPassword}
                placeholder='Nhập Mật Khẩu'
                style={styles.TextInputStyle}
              />
            </View>
          </View>

          <View style={styles.CancelOKButton}>
            <View style={{ paddingLeft: 12 }}>
              <Button
                titleStyle={{ fontSize: 12 }}
                title="Thoát Ra"
                onPress={this.props.updateExitOnPress}
              >
              </Button>
            </View>
            <View style={{ paddingLeft: 15 }}>
              <Button
                titleStyle={{ fontSize: 12 }}
                title="Lưu Lại"
                onPress={this.props.updateSaveOnPress}
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
                onChangeText={this.props.length}
                value={this.props.vallength}
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
    alignItems: 'flex-start'
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
    marginBottom: 50,
    marginLeft: 10,

  },
  Buttons: {
    zIndex: 1,
    backgroundColor: '#FFCCFF',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
    borderRadius: 25,
    shadowColor: "#FFCCFF",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 30,
    marginTop: 10,

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