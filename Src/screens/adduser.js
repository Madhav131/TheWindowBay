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
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-simple-toast';
import {Picker} from '@react-native-picker/picker';

const Adduser = props => {
  const busref = useRef();
  const busref1 = useRef();
  const busref2 = useRef();
  const [selectuserid, Setselectuserid] = useState();
  const [getname, setname] = useState('');
  const [getnumber, setnumber] = useState('');
  const [getemail, setemail] = useState('');
  const [getpassword, setpassword] = useState('');
  const [isloading, setisloading] = useState(false);
  const [getwage, setwage] = useState('');

  const Adduserapi = async () => {
    if (getname == '' || getname == null) {
      Toast.show('Please Enter a name');
    } else if (getnumber == '' || getnumber == null) {
      Toast.show('Please Enter a number');
    } else if (
      selectuserid == '' ||
      selectuserid == null ||
      selectuserid == undefined
    ) {
      Toast.show('Please Select a role');
    } else if (getemail == '' || getemail == null) {
      Toast.show('Please Enter your email address');
    } else if (getpassword == '' || getpassword == null) {
      Toast.show('Please Enter your password');
    } else {
      var Userid = await AsyncStorage.getItem('user_id');
      console.log('userid', Userid);
      setisloading(true);
      var Token = await AsyncStorage.getItem('token');
      const formdata = new FormData();
      formdata.append('name', getname);
      formdata.append('email', getemail);
      formdata.append('number', getnumber);
      formdata.append('password', getpassword);
      formdata.append('role', selectuserid);
      formdata.append('wage', getwage);
      console.log('formdata==>', formdata);
      axios
        .post(
          'https://theapplified.com/thewindowbay/api/v1/create-user',
          formdata,
          {
            headers: {
              Accept: ACCEPT_HEADER,
              Authorization: 'Bearer ' + Token,
            },
          },
        )
        .then(res => {
          setisloading(false);
          if (res.data.success === 1) {
            Toast.show(res.data.message);
            props.navigation.goBack();
          } else {
            Toast.show(res.data.message);
          }
          console.log('Vehicle Data===>', res.data);
        })
        .catch(err => {
          setisloading(false);
          console.log(JSON.stringify(err, null, 2));
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
          Create User
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
            <Text style={{color: colors.black, fontSize: 16}}>Email :</Text>
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
                keyboardType="email-address"
                returnKeyType="next"
                ref={busref}
                placeholder="Enter a Email..."
                onChangeText={text => setemail(text)}
                placeholderTextColor={colors.gray}
                onSubmitEditing={() => {
                  busref1.current.focus();
                }}
                blurOnSubmit={false}
              />
            </View>
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
                ref={busref1}
                placeholder="Enter a Number..."
                maxLength={10}
                onChangeText={text => setnumber(text)}
                onSubmitEditing={() => {
                  busref2.current.focus();
                }}
                placeholderTextColor={colors.gray}
                blurOnSubmit={false}
              />
            </View>
          </View>
          <View style={{marginTop: '5%', paddingBottom: '5%'}}>
            <Text style={{color: colors.black, fontSize: 16}}>Password :</Text>
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
                secureTextEntry={true}
                ref={busref2}
                placeholder="Enter a Password..."
                onChangeText={text => setpassword(text)}
                placeholderTextColor={colors.gray}
                blurOnSubmit={false}
              />
            </View>
            <View style={{marginTop: '5%', paddingBottom: '5%'}}>
              <Text style={{color: colors.black, fontSize: 16}}>Role :</Text>
              <View
                style={{
                  width: '90%',
                  backgroundColor: colors.white,
                  marginTop: '5%',
                  elevation: 5,
                  borderRadius: 5,
                }}>
                <Picker
                  selectedValue={selectuserid}
                  itemStyle={{height: 50}}
                  dropdownIconColor={colors.themecolor}
                  dropdownIconRippleColor={colors.themecolor}
                  onValueChange={itemValue => {
                    Setselectuserid(itemValue);
                    // set_indexvalue(itemValue);
                  }}>
                  <Picker.Item label="Select a Role" value="" />
                  <Picker.Item label="Admin" value="2" />
                  <Picker.Item label="Employee" value="3" />
                  <Picker.Item label="Worker" value="4" />
                </Picker>
              </View>
            </View>
            {selectuserid == 4 || selectuserid == 3 ? (
              <View style={{marginTop: '5%', paddingBottom: '5%'}}>
                <Text style={{color: colors.black, fontSize: 16}}>Wage :</Text>
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
                    keyboardType="number-pad"
                    returnKeyType="next"
                    placeholder="Enter a wage..."
                    onChangeText={text => setwage(text)}
                    placeholderTextColor={colors.gray}
                    maxLength={10}
                    blurOnSubmit={false}
                  />
                </View>
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            onPress={() => {
              Adduserapi();
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

export default Adduser;
