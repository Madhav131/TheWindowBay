import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  AsyncStorage,
  ScrollView,
  Modal,
  ActivityIndicator,
  FlatList,
  ImageBackground,
  TextInput,
  PermissionsAndroid,
  RefreshControl,
  Platform,
  Image,
} from 'react-native';
import colors from '../../../Utils/colors';
import metrics from '../../../Utils/Metrics';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import HeaderComponent from '../../components/HeaderComponent';
import axios from 'axios';
import {BASE_URL, ACCEPT_HEADER} from '../../../Utils/baseurl';
import Toast from 'react-native-simple-toast';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import moment from 'moment';
import RNModal from 'react-native-modal';

const data = [
  {
    id: '1',
    title: 'Pending',
  },
  {
    id: '2',
    title: 'In Progress',
  },
];

const Chosevehicle = props => {
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      Vehiclechoseapi();
    });
    return unsubscribe;
  }, [props]);
  const [load, setload] = useState(false);
  const [load1, setload1] = useState(false);
  const [vehicledata, setvehicledata] = useState([]);

  const Vehiclechoseapi = async () => {
    setload(true);
    var Token = await AsyncStorage.getItem('token');
    axios
      .get(BASE_URL + 'get-vehiclechoose', {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        console.log('vehicle data ====>', res.data.data);
        setvehicledata(res.data.data);
        setBranchArray(res.data.data);
        setload(false);
      })
      .catch(err => console.log(JSON.stringify(err, null, 2)));
  };

  const [task_arrayholder, setBranchArray] = useState([]);

  const searchFilter = (text, id) => {
    const newData = task_arrayholder.filter(function (item) {
      const employee = item.name ? item.name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return employee.indexOf(textData) > -1;
    });
    setvehicledata(newData);
  };

  const [getvehiclemodal, setvehiclemodal] = useState(false);
  const [vehicle, setvehicle] = useState('');
  const [vehicleid, setvehicleid] = useState('');

  const [ismodel, setismodel] = useState(false);
  const [startingkm, setstartingkm] = useState('');

  const [isVisible, setisVisible] = useState(false);
  const [filePath, setFilePath] = useState({});
  const [type, settype] = useState({});
  const [fileName, setfileName] = useState({});
  const [getcounter, setcounter] = useState(0);
  const [imguri, seturi] = useState('');

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
        // If CAMERA Permission is granted
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
        // If WRITE_EXTERNAL_STORAGE Permission is granted
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
        console.log('base64 -> ', response.assets[0].base64);
        console.log('uri -> ', response.assets[0].uri);
        console.log('width -> ', response.assets[0].width);
        console.log('height -> ', response.assets[0].height);
        console.log('fileSize -> ', response.assets[0].fileSize);
        console.log('type -> ', response.assets[0].type);
        console.log('fileName -> ', response.assets[0].fileName);
        setFilePath(response);
        seturi(response.assets[0].uri);

        settype(response.assets[0].type);
        setfileName(response.assets[0].fileName);
        setisVisible(!isVisible);
      });
    }
  };

  const chooseFile = type => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 0.5,
    };
    launchImageLibrary(options, response => {
      console.log('Response = ', response);

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
      console.log('base64 -> ', response.assets[0].base64);
      console.log('uri -> ', response.assets[0].uri);
      console.log('width -> ', response.assets[0].width);
      console.log('height -> ', response.assets[0].height);
      console.log('fileSize -> ', response.assets[0].fileSize);
      console.log('type -> ', response.assets[0].type);
      console.log('fileName -> ', response.assets[0].type);
      setFilePath(response);
      seturi(response.assets[0].uri);
      AsyncStorage.setItem('img', response.assets[0].uri);
      settype(response.assets[0].type);
      setfileName(response.assets[0].fileName);
      setisVisible(!isVisible);
    });
  };
  const [id, setid] = useState();

  const vehicleusedapi = async () => {
    if (imguri === '' || imguri === null) {
      Toast.show('Please Select a km photo');
    } else if (startingkm === '' || startingkm === null) {
      Toast.show('Please Enter a starting km');
    } else {
      setload1(true);
      var Token = await AsyncStorage.getItem('token');
      const formdata = new FormData();
      formdata.append('id', id);
      formdata.append('used', vehicleid);
      formdata.append('strating_km', startingkm);
      var img = {uri: imguri, name: fileName, type: type};
      formdata.append('kmphoto', img);
      console.log('formdata --->', formdata);
      axios
        .post(BASE_URL + 'vehicle-choose', formdata, {
          headers: {
            Accept: ACCEPT_HEADER,
            Authorization: 'Bearer ' + Token,
          },
        })
        .then(res => {
          console.log('res--->', res.data);
          if (res.data.success === 1) {
            setismodel(false);
            setload1(false);
            Vehiclechoseapi();
            setstartingkm('');
            seturi('');
          }
        })
        .catch(err => {
          setload1(false);
          console.log('err', err);
        });
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
      <HeaderComponent
        navigation={props.navigation}
        title="Vehicle Choose"
        isMenu={true}
      />
      <View
        style={{
          width: '90%',
          flexDirection: 'row',
          borderRadius: 30,
          height: metrics.HEIGHT * 0.07,
          marginTop: '5%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.white,
          elevation: 8,
          marginHorizontal: '5%',
          marginBottom: '2%',
          background: 'transparent',
        }}>
        <Fontisto name="search" color={colors.themecolor} size={20} />
        <TextInput
          keyboardType="default"
          placeholder="Search..."
          placeholderTextColor={colors.gray}
          style={{
            width: '80%',
            marginLeft: '5%',
            fontSize: 14,
            fontWeight: '700',
            color: colors.black,
          }}
          onChangeText={value => searchFilter(value)}
        />
      </View>
      <View style={{flex: 1}}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={load} onRefresh={Vehiclechoseapi} />
          }>
          <View style={{marginTop: '3%'}}>
            {vehicledata && vehicledata.length > 0
              ? vehicledata.map((item, index) => {
                  return (
                    <View
                      onPress={() => {
                        // setModalVisible(true);
                        // console.log([item]);
                      }}
                      style={{
                        elevation: 0,
                        boxShedow: 5,
                        borderRadius: 5,
                        backgroundColor: colors.lighttheme,
                        marginTop: '5%',
                        marginBottom: '1%',
                        marginHorizontal: '5%',
                        paddingBottom: '3%',
                        paddingTop: '3%',
                        width: metrics.WIDTH * 0.9,
                      }}>
                      <View
                        style={{
                          // padding: '3%',
                          // marginLeft: '3%',
                          flexDirection: 'row',
                          marginTop: '5%',
                          alignSelf: 'center',
                          alignItems: 'center',
                        }}>
                        <Fontisto
                          name="car"
                          size={20}
                          color={colors.themecolor}
                        />
                        <Text
                          style={{
                            marginLeft: '5%',
                            color: colors.black,
                            fontSize: 15,
                            fontWeight: 'bold',
                          }}>
                          {item.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          marginLeft: '3%',
                          flexDirection: 'row',
                        }}>
                        <Text
                          style={{
                            color: colors.themecolor,
                            fontSize: 16,
                            fontWeight: 'bold',
                            marginTop: '2%',
                          }}>
                          Km photo :-
                        </Text>
                        <View style={{marginTop: '5%', marginLeft: '3%'}}>
                          <Image
                            source={{uri: item.image_path}}
                            resizeMode="stretch"
                            style={{
                              width: metrics.WIDTH * 0.4,
                              height: metrics.HEIGHT * 0.2,
                              borderRadius: 5,
                            }}
                          />
                        </View>
                      </View>
                      <View
                        style={{
                          marginTop: metrics.HEIGHT * 0.03,
                          flexDirection: 'row',
                          alignSelf: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            color: colors.themecolor,
                            fontSize: 15,
                            fontWeight: 'bold',
                            alignItems: 'center',
                          }}>
                          Used :
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            item.used == 1
                              ? setvehiclemodal(true)
                              : item.used == 2
                              ? Toast.show('Already in progress...!')
                              : null;
                            setid(item.id);
                          }}
                          style={{
                            marginLeft: '3%',
                            backgroundColor:
                              item.used == 1
                                ? colors.themecolor
                                : item.used == 2
                                ? colors.themecolor
                                : null,
                            padding: '2%',
                            borderRadius: 5,
                          }}>
                          <Text
                            style={{
                              color:
                                item.used == 1
                                  ? 'white'
                                  : item.used == 2
                                  ? 'white'
                                  : null,
                            }}>
                            {item.used == 1
                              ? 'Pending'
                              : item.used == 2
                              ? 'In Progress'
                              : null}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              : null}
          </View>
        </ScrollView>
      </View>
      <RNModal
        // animationType="slide"
        transparent={true}
        isVisible={getvehiclemodal}
        onBackButtonPress={() => setvehiclemodal(false)}
        onBackdropPress={() => setvehiclemodal(false)}>
        <View
          style={{
            marginTop: '7%',
            // marginHorizontal: "5%",
            backgroundColor: colors.white,
            borderRadius: 5,
            alignSelf: 'center',
            elevation: 3,
            width: metrics.WIDTH * 0.9,
            padding: '5%',
          }}>
          <FlatList
            data={data}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setvehicle(item.title);
                    setvehicleid(item.id);
                    setvehiclemodal(false);
                    item.id == 2 ? setismodel(true) : null;
                  }}
                  style={{padding: '3%'}}>
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 15,
                      fontWeight: 'bold',
                    }}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </RNModal>
      <RNModal
        // animationType="slide"
        transparent={true}
        isVisible={ismodel}
        onBackButtonPress={() => {
          setismodel(false);
          setstartingkm('');
          seturi('');
        }}
        onBackdropPress={() => {
          setismodel(false);
          setstartingkm('');
          seturi('');
        }}>
        <View
          style={{
            marginTop: '7%',
            // marginHorizontal: "5%",
            backgroundColor: colors.white,
            borderRadius: 5,
            alignSelf: 'center',
            elevation: 3,
            width: metrics.WIDTH * 0.9,
            padding: '5%',
            flex: 1,
          }}>
          <View
            style={{
              marginTop: '5%',
              width: metrics.WIDTH * 0.8,
              alignItems: 'flex-end',
            }}>
            <Ionicons
              name="close-circle-sharp"
              size={30}
              color={colors.themecolor}
              style={{}}
              onPress={() => {
                setismodel(false);
                setstartingkm('');
                seturi('');
              }}
            />
          </View>
          <Text style={{color: colors.black, fontSize: 16}}>Starting Km :</Text>
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
              placeholder="Enter a Starting Km..."
              onChangeText={text => setstartingkm(text)}
              placeholderTextColor={colors.gray}
              blurOnSubmit={false}
            />
          </View>
          <View style={{marginTop: '10%'}}>
            <Text style={{color: colors.black, fontSize: 16}}>Km Photo :</Text>
          </View>
          <TouchableOpacity
            onPress={() => setisVisible(true)}
            style={{alignSelf: 'center', marginTop: '5%'}}>
            {imguri == null || imguri == '' ? (
              <View
                style={{
                  height: metrics.HEIGHT * 0.2,
                  width: metrics.WIDTH * 0.4,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: colors.blue,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcons
                  name="pencil-plus"
                  size={30}
                  color={colors.black}
                />
              </View>
            ) : (
              <Image
                source={{uri: imguri}}
                style={{
                  height: metrics.HEIGHT * 0.2,
                  width: metrics.WIDTH * 0.4,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: colors.blue,
                }}
                resizeMode="contain"
              />
            )}
          </TouchableOpacity>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'absolute',
              bottom: '0%',
              right: '0%',
            }}>
            <TouchableOpacity
              onPress={() => {
                setismodel(false);
              }}
              style={{
                backgroundColor: colors.white,
                borderRadius: 5,
                right: '15%',
                padding: '5%',
              }}>
              <Text
                style={{
                  color: colors.themecolor,
                  fontWeight: 'bold',
                  fontSize: 15,
                }}>
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                vehicleusedapi();
              }}
              style={{
                backgroundColor: colors.themecolor,
                padding: '10%',
                right: '15%',
                borderRadius: 5,
              }}>
              {load1 == true ? (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <ActivityIndicator size={25} color={colors.white} />
                </View>
              ) : (
                <Text style={{color: colors.white}}>Submit</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
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

export default Chosevehicle;
