import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  AsyncStorage,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  FlatList,
  ImageBackground,
  Platform,
} from 'react-native';
import axios from 'axios';
import {BASE_URL, ACCEPT_HEADER} from '../../Utils/baseurl';
import colors from '../../Utils/colors';
import metrics from '../../Utils/Metrics';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Toast from 'react-native-simple-toast';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const Addvehicle = props => {
  const busref = useRef();
  const busref1 = useRef();
  const busref2 = useRef();

  const [getname, setname] = useState('');
  const [getnumber, setnumber] = useState('');
  const [cheasesno, setchesesno] = useState('');
  const [getkm, setkm] = useState('');
  const [isloading, setisloading] = useState(false);

  const Addvehicleapi = async () => {
    if (getname == '' || getname == null) {
      Toast.show('Please Enter a name');
    } else if (getnumber == '' || getnumber == null) {
      Toast.show('Please Enter a number');
    } else if (cheasesno == '' || cheasesno == null) {
      Toast.show('Please Enter a Chassis No');
    } else {
      var Userid = await AsyncStorage.getItem('user_id');
      console.log('userid', Userid);
      setisloading(true);
      var Token = await AsyncStorage.getItem('token');
      const formdata = new FormData();
      formdata.append('name', getname);
      formdata.append('number', getnumber);
      formdata.append('chassis_no', cheasesno);
      // formdata.append('starting_km', getkm);
      console.log('formdata==>', formdata);
      axios
        .post(BASE_URL + 'addUpdateVehicle', formdata, {
          headers: {
            Accept: ACCEPT_HEADER,
            Authorization: 'Bearer ' + Token,
          },
        })
        .then(res => {
          setisloading(false);
          if (res.data.success === 1) {
            Toast.show(res.data.message);
            props.navigation.goBack();
          }
          console.log('Vehicle Data===>', res.data);
        })
        .catch(err => {
          Toast.show(
            'Something went wrong please check your internet connection',
          );
          setisloading(false);
          console.log(err);
        });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: colors.white,
          height: metrics.HEIGHT * 0.09,
          alignItems: 'center',
          elevation: 5,
          padding: '5%',
          marginTop: Platform.OS === 'ios' ? metrics.HEIGHT * 0.02 : 0,
        }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
          <Ionicons
            name="arrow-back-circle"
            size={30}
            color={colors.themecolor}
          />
        </TouchableOpacity>
        <Text
          style={{
            marginLeft: '3%',
            color: colors.themecolor,
            fontSize: 18,
            fontWeight: 'bold',
          }}>
          Add Vehicle
        </Text>
      </View>
      <ScrollView>
        <View style={{marginTop: '5%', paddingBottom: '5%', marginLeft: '5%'}}>
          <Text style={{color: colors.black, fontSize: 16}}>Name :</Text>
          <View
            style={{
              width: '90%',
              backgroundColor: colors.white,
              marginTop: '5%',
              elevation: 5,
              borderRadius: 5,
            }}>
            <TextInput
              style={{
                color: colors.black,
                fontSize: 16,
                fontWeight: '600',
                marginLeft: '5%',
              }}
              keyboardType="default"
              returnKeyType="next"
              placeholder="Enter a Name..."
              onChangeText={text => setname(text)}
              placeholderTextColor={colors.gray}
              onSubmitEditing={() => {
                busref.current.focus();
              }}
              blurOnSubmit={false}
            />
          </View>
          <View style={{marginTop: '5%', paddingBottom: '5%'}}>
            <Text style={{color: colors.black, fontSize: 16}}>Number :</Text>
            <View
              style={{
                width: '90%',
                backgroundColor: colors.white,
                marginTop: '5%',
                elevation: 5,
                borderRadius: 5,
              }}>
              <TextInput
                style={{
                  color: colors.black,
                  fontSize: 16,
                  fontWeight: '600',
                  marginLeft: '5%',
                }}
                keyboardType="phone-pad"
                returnKeyType="next"
                ref={busref}
                placeholder="Enter a Number..."
                maxLength={10}
                onChangeText={text => setnumber(text)}
                placeholderTextColor={colors.gray}
                onSubmitEditing={() => {
                  busref1.current.focus();
                }}
                blurOnSubmit={false}
              />
            </View>
          </View>
          <View style={{marginTop: '5%', paddingBottom: '5%'}}>
            <Text style={{color: colors.black, fontSize: 16}}>
              Chassis No :
            </Text>
            <View
              style={{
                width: '90%',
                backgroundColor: colors.white,
                marginTop: '5%',
                elevation: 5,
                borderRadius: 5,
              }}>
              <TextInput
                style={{
                  color: colors.black,
                  fontSize: 16,
                  fontWeight: '600',
                  marginLeft: '5%',
                }}
                keyboardType="phone-pad"
                returnKeyType="next"
                ref={busref1}
                placeholder="Enter a Chassis No..."
                onChangeText={text => setchesesno(text)}
                onSubmitEditing={() => {
                  busref2.current.focus();
                }}
                placeholderTextColor={colors.gray}
                blurOnSubmit={false}
              />
            </View>
          </View>
          {/* <View style={{marginTop: '5%', paddingBottom: '5%'}}>
            <Text style={{color: colors.black, fontSize: 16}}>
              Starting Km :
            </Text>
            <View
              style={{
                width: '90%',
                backgroundColor: colors.white,
                marginTop: '5%',
                elevation: 5,
                borderRadius: 5,
              }}>
              <TextInput
                style={{
                  color: colors.black,
                  fontSize: 16,
                  fontWeight: '600',
                  marginLeft: '5%',
                }}
                keyboardType="phone-pad"
                returnKeyType="next"
                ref={busref2}
                placeholder="Enter a Starting Km..."
                onChangeText={text => setkm(text)}
                placeholderTextColor={colors.gray}
                blurOnSubmit={false}
              />
            </View>
          </View> */}
          <TouchableOpacity
            onPress={() => {
              Addvehicleapi();
            }}
            style={{
              backgroundColor: colors.themecolor,
              width: metrics.WIDTH * 0.4,
              height: metrics.HEIGHT * 0.07,
              justifyContent: 'center',
              elevation: 10,
              borderRadius: 5,
              alignSelf: 'center',
              marginTop: '15%',
            }}>
            {isloading === true ? (
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator size={25} color={colors.white} />
              </View>
            ) : (
              <Text
                style={{
                  textAlign: 'center',
                  fontWeight: '700',
                  color: colors.white,
                }}>
                Submit
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Addvehicle;
