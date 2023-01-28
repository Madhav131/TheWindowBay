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
  PermissionsAndroid,
  Platform,
} from 'react-native';
import axios from 'axios';
import {BASE_URL, ACCEPT_HEADER} from '../../Utils/baseurl';
import colors from '../../Utils/colors';
import metrics from '../../Utils/Metrics';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-simple-toast';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {Picker} from '@react-native-picker/picker';
import {useLoginContext} from './context/login_context';

const Addlead = props => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [getDate, setDate] = useState(moment(Date()).format('YYYY-MM-DD'));
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setDate(moment(date).format('YYYY-MM-DD'));
    hideDatePicker();
  };

  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
  const [getTo, setTo] = useState('hh/mm/ss');
  const showDatePicker1 = () => {
    setDatePickerVisibility1(true);
  };

  const hideDatePicker1 = () => {
    setDatePickerVisibility1(false);
  };

  const handleConfirm1 = time => {
    setTo(moment(time).format('hh:mm:ss'));
    hideDatePicker1();
  };

  const busref = useRef();
  const busref1 = useRef();
  const busref2 = useRef();

  const [filePath, setFilePath] = useState({});
  const [gettypepicker, settypepicker] = useState();
  const [image_array, SetImage_array] = useState([]);
  const [isVisible, setisVisible] = useState(false);
  const [selectuserid, Setselectuserid] = useState();
  const {role} = useLoginContext();

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      Userapi();
    });
    return unsubscribe;
  });

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else {
      return true;
    }
  };

  const requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'External Storage Write Permission',
            message: 'App needs write permission',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        alert('Write permission err', err);
      }
      return false;
    } else {
      return true;
    }
  };

  const captureImage = async type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, response => {
        console.log('Response = ', response);
        SetImage_array(response.assets);
        if (response.didCancel) {
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          alert(response.errorMessage);
          return;
        }
        // console.log('base64 -> ', response.assets[0].base64);
        // console.log('uri -> ', response.assets[0].uri);
        // console.log('width -> ', response.assets[0].width);
        // console.log('height -> ', response.assets[0].height);
        // console.log('fileSize -> ', response.assets[0].fileSize);
        // console.log('type -> ', response.assets[0].type);
        // console.log('fileName -> ', response.assets[0].fileName);
        setFilePath(response);
        // seturi(response.assets[0].uri);
        AsyncStorage.setItem('img', response.assets[0].uri);
        setisVisible(!isVisible);

        // settype(response.assets[0].type);
        // setfileName(response.assets[0].fileName);
      });
    }
  };

  const chooseFile = type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      selectionLimit: 0,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);
      SetImage_array(response.assets);
      if (response.didCancel) {
        alert('User cancelled camera picker');
        return;
      } else if (response.errorCode == 'camera_unavailable') {
        alert('Camera not available on device');
        return;
      } else if (response.errorCode == 'permission') {
        alert('Permission not satisfied');
        return;
      } else if (response.errorCode == 'others') {
        alert(response.errorMessage);
        return;
      }
      setFilePath(response);

      AsyncStorage.setItem('img', response.assets[0].uri);
      // settype(response.assets[0].type);
      // setfileName(response.assets[0].fileName);
      setisVisible(!isVisible);
    });
  };
  const removephoto = index => {
    let result = image_array.filter((item, key) => key != index);
    SetImage_array(result);
  };

  const [getname, setname] = useState();
  const [getnumber, setnumber] = useState();
  const [getemail, setemail] = useState();
  const [getNarration, setNarration] = useState();
  const [isloading, setisloading] = useState(false);
  const [getlocations, setlocations] = useState('');
  const [get_user, set_user] = useState([]);
  const Userapi = async () => {
    var Token = await AsyncStorage.getItem('token');
    axios
      .get(BASE_URL + 'get-user', {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        console.log('userdata----=-=-=-=--.', res.data);
        set_user(res.data.data);
      })
      .catch(err => console.log(JSON.stringify(err, null, 2)));
  };

  const Addleadapi = async () => {
    if (role === '1' || role === 1 || role === '2' || role === 2) {
      if (selectuserid == '' || selectuserid == null) {
        Toast.show('Please select a user');
      }
    } else {
    }
    if (getname == '' || getname == null) {
      Toast.show('Please Enter Name');
    } else if (getnumber == '' || getnumber == null) {
      Toast.show('Please Enter 10 Digits Number');
    } else if (getlocations == '' || getlocations == null) {
      Toast.show('Please Enter Valid E-Mail Id');
    } else {
      setisloading(true);
      var Token = await AsyncStorage.getItem('token');
      const formdata = new FormData();
      if (role === '1' || role === 1 || role === '2' || role === 2) {
        formdata.append('employee_id', selectuserid);
      }
      formdata.append('name', getname);
      formdata.append('number', getnumber);
      formdata.append('email', getemail);
      formdata.append('narration', getNarration);
      formdata.append('reminderdate', getDate);
      formdata.append('remindertime', getTo);
      formdata.append('location', getlocations);
      for (var i = 0; i < image_array.length; i++) {
        formdata.append('images[' + i + ']', {
          uri: image_array[i].uri,
          name: image_array[i].fileName,
          type: image_array[i].type,
        });
      }
      console.log('formdata==>', formdata);
      axios
        .post(BASE_URL + 'addLead', formdata, {
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
          console.log('leadpostdata ===>', res.data);
        })
        .catch(err => {
          setisloading(false);
          Toast.show('Something went wrong please try again');
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
          Lead Create
        </Text>
      </View>
      <KeyboardAvoidingView
        style={{flexGrow: 1, paddingBottom: '10%'}}
        behavior={'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
        <ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <TouchableOpacity
            onPress={() => {
              setisVisible(true);
              // select_deselect_images();
            }}
            // onPress={() => chooseFile('photo')}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '5%',
              borderRadius: 130,
              borderColor: colors.themecolor,
              borderWidth: 2,
              width: 100,
              backgroundColor: colors.white,
              height: 100,
              alignSelf: 'center',
            }}>
            <Text style={{color: colors.black, fontSize: 22}}>+</Text>
          </TouchableOpacity>
          <View
            style={{
              marginTop: '5%',
              marginLeft: '3%',
              // backgroundColor: 'red',
              // height: metrics.HEIGHT * 0.2,
            }}>
            <FlatList
              data={image_array}
              horizontal={true}
              renderItem={({item, index}) => {
                return (
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderColor: colors.themecolor,
                      borderWidth: 2,
                      width: 100,
                      backgroundColor: colors.white,
                      height: 130,
                      marginLeft: 10,
                      alignSelf: 'center',
                    }}>
                    <ImageBackground
                      source={{uri: item.uri}}
                      style={{
                        width: 90,
                        height: 90,

                        alignSelf: 'center',
                      }}></ImageBackground>
                    <TouchableOpacity
                      onPress={() => removephoto(index)}
                      style={{
                        backgroundColor: colors.themecolor,
                        width: 90,
                        marginTop: '5%',
                        elevation: 3,
                      }}>
                      <Text style={{color: colors.white, textAlign: 'center'}}>
                        delete
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              }}
            />
          </View>
          {role === '1' || role === 1 || role === '2' || role === 2 ? (
            <>
              <Text
                style={{
                  color: colors.black,
                  fontSize: 16,
                  marginHorizontal: '5%',
                }}>
                User Name :
              </Text>
              <View
                style={{
                  width: '85%',
                  backgroundColor: colors.white,
                  marginTop: '5%',
                  elevation: 5,
                  borderRadius: 5,
                  marginHorizontal: '5%',
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
                  <Picker.Item label="Select" value="" />
                  {get_user && get_user.length > 0
                    ? get_user.map((item, index) => {
                        return (
                          <Picker.Item
                            label={item.name}
                            // value={item.model_code}
                            value={item.id}
                          />
                        );
                      })
                    : null}
                </Picker>
              </View>
            </>
          ) : null}
          <View
            style={{marginTop: '5%', marginLeft: '5%', paddingBottom: '5%'}}>
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
                  keyboardType="number-pad"
                  returnKeyType="next"
                  placeholder="Enter a Number..."
                  onChangeText={text => setnumber(text)}
                  placeholderTextColor={colors.gray}
                  maxLength={10}
                  ref={busref}
                  onSubmitEditing={() => {
                    busref1.current.focus();
                  }}
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <View style={{paddingBottom: '5%'}}>
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
                  placeholder="Enter a Email..."
                  onChangeText={text => setemail(text)}
                  placeholderTextColor={colors.gray}
                  ref={busref1}
                  onSubmitEditing={() => {
                    busref2.current.focus();
                  }}
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <View style={{paddingBottom: '5%'}}>
              <Text style={{color: colors.black, fontSize: 16}}>
                Narration :
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
                  keyboardType="default"
                  returnKeyType="next"
                  placeholder="Enter a Narration..."
                  onChangeText={text => setNarration(text)}
                  placeholderTextColor={colors.gray}
                  ref={busref2}
                  // onSubmitEditing={() => {
                  //   busref1.current.focus();
                  // }}
                  blurOnSubmit={false}
                />
              </View>
            </View>
            <View style={{marginTop: '5%', paddingBottom: '5%'}}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: 16,
                }}>
                Reminder Date :
              </Text>
              <View
                style={{
                  width: '90%',
                  backgroundColor: colors.white,
                  marginTop: '5%',
                  elevation: 5,
                  borderRadius: 5,
                }}>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
                />
                <TouchableOpacity onPress={showDatePicker}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: '5%',
                      paddingBottom: '5%',
                    }}>
                    <Text
                      style={{
                        color: colors.black,
                        alignSelf: 'center',
                        marginHorizontal: '5%',
                      }}>
                      {getDate}
                    </Text>
                    <Fontisto
                      name="date"
                      size={25}
                      style={{
                        marginHorizontal: '5%',
                        color: colors.orange,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{marginTop: '5%', paddingBottom: '5%'}}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: 16,
                }}>
                Reminder Time :
              </Text>
              <View
                style={{
                  width: '90%',
                  backgroundColor: colors.white,
                  marginTop: '5%',
                  elevation: 5,
                  borderRadius: 5,
                }}>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible1}
                  mode="time"
                  onConfirm={handleConfirm1}
                  onCancel={hideDatePicker1}
                />
                <TouchableOpacity onPress={showDatePicker1}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginTop: '5%',
                      paddingBottom: '5%',
                    }}>
                    <Text
                      style={{
                        color: colors.black,
                        alignSelf: 'center',
                        marginHorizontal: '5%',
                      }}>
                      {getTo}
                    </Text>
                    <Ionicons
                      name="time"
                      size={25}
                      style={{
                        marginHorizontal: '5%',
                        color: colors.orange,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{paddingBottom: '5%', marginTop: '5%'}}>
                <Text style={{color: colors.black, fontSize: 16}}>
                  Location :
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
                    keyboardType="default"
                    returnKeyType="next"
                    placeholder="Enter a Location..."
                    onChangeText={text => setlocations(text)}
                    placeholderTextColor={colors.gray}
                    // ref={busref2}
                    // onSubmitEditing={() => {
                    //   busref1.current.focus();
                    // }}
                    blurOnSubmit={false}
                  />
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              Addleadapi();
            }}
            style={{
              backgroundColor: colors.themecolor,
              width: metrics.WIDTH * 0.4,
              height: metrics.HEIGHT * 0.07,
              // position: 'absolute',
              // bottom: '2%',
              justifyContent: 'center',
              elevation: 10,
              borderRadius: 5,
              alignSelf: 'center',
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
        </ScrollView>
      </KeyboardAvoidingView>
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          setisVisible(false);
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-end',
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}>
          <View
            style={{
              backgroundColor: colors.white,
              height: metrics.HEIGHT * 0.4,
              width: metrics.WIDTH * 1,
            }}>
            <View style={{marginTop: '5%', marginHorizontal: '5%'}}>
              <Text
                style={{
                  fontSize: metrics.HEIGHT * 0.04,
                  fontWeight: 'bold',
                }}>
                Select Images
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => chooseFile('photo')}
              style={{
                flexDirection: 'row',
                marginLeft: '5%',
                marginTop: '5%',
                alignContent: 'center',
              }}>
              <MaterialIcons name="photo" size={30} />
              <Text
                style={{
                  fontSize: metrics.HEIGHT * 0.026,
                  color: colors.black,
                  marginLeft: '2%',
                }}>
                Choose From Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => captureImage('photo')}
              style={{
                flexDirection: 'row',
                marginLeft: '5%',
                marginTop: '5%',
                alignContent: 'center',
              }}>
              <Entypo name="camera" size={30} />
              <Text
                style={{
                  fontSize: metrics.HEIGHT * 0.026,
                  color: colors.black,
                  marginLeft: '2%',
                }}>
                Take A Photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setisVisible(false);
              }}
              style={{
                marginTop: '5%',
                alignSelf: 'flex-end',
                marginHorizontal: '5%',
              }}>
              <Text
                style={{
                  fontSize: metrics.HEIGHT * 0.022,
                  fontWeight: 'bold',
                  color: colors.black,
                }}>
                CANCLE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Addlead;
