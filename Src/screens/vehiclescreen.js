import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  AsyncStorage,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import colors from '../../Utils/colors';
import metrics from '../../Utils/Metrics';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import HeaderComponent from '../components/HeaderComponent';
import axios from 'axios';
import {BASE_URL, ACCEPT_HEADER} from '../../Utils/baseurl';
import Toast from 'react-native-simple-toast';

const Vehiclescreen = props => {
  const busref = useRef();
  const busref1 = useRef();
  const busref2 = useRef();

  const [getname, setname] = useState('');
  const [getnumber, setnumber] = useState('');
  const [cheasesno, setchesesno] = useState('');
  const [getkm, setkm] = useState('');
  const [isloading, setisloading] = useState(false);
  const [getvehicleloading, setvehicleloading] = useState(false);
  const [getdata, setdata] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [get_array, set_array] = useState([]);
  const [get_id, set_id] = useState();

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      Vehicleapi();
    });

    return unsubscribe;
  });

  const Vehicleapi = async () => {
    setvehicleloading(true);
    var Token = await AsyncStorage.getItem('token');
    axios
      .get(BASE_URL + 'vehicle', {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        console.log('vehicle data ====>', res.data.data);
        setdata(res.data.data);
        setBranchArray(res.data.data);
        setvehicleloading(false);
      })
      .catch(err => console.log(JSON.stringify(err, null, 2)));
  };

  const Updatevehicleapi = async () => {
    if (getname == '' || getname == null) {
      Toast.show('Please Enter a name');
    } else {
      setisloading(true);
      var Token = await AsyncStorage.getItem('token');
      const formdata = new FormData();
      formdata.append('id', get_id);
      formdata.append('name', getname);
      formdata.append('number', getnumber);
      formdata.append('chassis_no', cheasesno);
      // formdata.append('starting_km', getkm);
      console.log('formdata==>', formdata);
      axios
        .post(
          'https://theapplified.com/thewindowbay/api/v1/update-vehicle',
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
            setModalVisible(false);
            Toast.show(res.data.message);
            Vehicleapi();
          }
          console.log('Vehicle Data===>', res.data);
        })
        .catch(err => console.log(JSON.stringify(err, null, 2)));
    }
  };

  const Userstatus = async id => {
    var Token = await AsyncStorage.getItem('token');
    const formdata = new FormData();
    formdata.append('id', id);
    formdata.append('status', 1);
    console.log('formdata--->', formdata);
    axios
      .post(BASE_URL + 'vehicle-status', formdata, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        console.log('resrequire--->', res.data);
        if (res.data.success === 1) {
          Toast.show(res.data.message);
          Vehicleapi();
        }
      })
      .catch(err => console.log(JSON.stringify(err, null, 2)));
  };
  const Userstatus1 = async id => {
    var Token = await AsyncStorage.getItem('token');
    const formdata = new FormData();
    formdata.append('id', id);
    formdata.append('status', 0);
    console.log('formdata--->', formdata);
    axios
      .post(BASE_URL + 'vehicle-status', formdata, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        console.log('resrequire--->', res.data);
        if (res.data.success === 1) {
          Toast.show(res.data.message);
          Vehicleapi();
        }
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
    setdata(newData);
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
      <HeaderComponent
        navigation={props.navigation}
        title="Vehicle"
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
      {getvehicleloading === true ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator size={50} color={colors.themecolor} />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={getvehicleloading}
              onRefresh={Vehicleapi}
            />
          }>
          {getdata && getdata.length > 0
            ? getdata.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(true);
                      set_array([item]);
                      set_id(item.id);
                      setname(item.name);
                      setnumber(item.number);
                      setchesesno(item.chassis_no);
                      setkm(item.starting_km);
                    }}
                    style={{
                      elevation: 3,
                      borderRadius: 5,
                      backgroundColor: colors.white,
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
                        marginLeft: '3%',
                        flexDirection: 'row',
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
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: '5%',
                        marginLeft: '5%',
                      }}>
                      <Text
                        style={{
                          color: colors.black,
                          fontWeight: 'bold',
                          fontSize: 16,
                        }}>
                        Status :
                      </Text>
                      {item.status == 1 ? (
                        <TouchableOpacity onPress={() => Userstatus1(item.id)}>
                          <MaterialIcons
                            name="check-box"
                            size={25}
                            color={colors.themecolor}
                          />
                        </TouchableOpacity>
                      ) : item.status == 0 ? (
                        <TouchableOpacity onPress={() => Userstatus(item.id)}>
                          <MaterialIcons
                            name="check-box-outline-blank"
                            size={25}
                            color={colors.themecolor}
                          />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                );
              })
            : null}
        </ScrollView>
      )}
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Addvehicle')}
        style={{
          backgroundColor: colors.white,
          borderRadius: 10,
          position: 'absolute',
          padding: '3%',
          bottom: '3%',
          right: '5%',
          elevation: 10,
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <Feather name="plus" color={colors.themecolor} size={29} style={{}} />
        <Text
          style={{marginLeft: 3, color: colors.themecolor, fontWeight: 'bold'}}>
          Add Vehicle
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <View
          style={{
            marginTop: '5%',
            // marginHorizontal: "5%",
            backgroundColor: colors.white,
            borderRadius: 5,
            paddingBottom: '5%',
            flex: 1,
            elevation: 3,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: '5%',
              justifyContent: 'space-between',
              marginTop: '5%',
            }}>
            <View>
              <Text
                style={{
                  color: colors.themecolor,
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>
                Update Vehicle Here
              </Text>
            </View>
            <View
              style={{
                alignItems: 'flex-end',
              }}>
              <Ionicons
                name="close-circle-sharp"
                size={30}
                color={colors.orange}
                style={{}}
                onPress={() => {
                  setModalVisible(false);
                }}
              />
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: '5%',
              marginHorizontal: '5%',
            }}>
            <View
              style={{flex: 1, height: 2, backgroundColor: colors.themecolor}}
            />
            <View></View>
          </View>
          {/* {holidayloading === true ? (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator size={25} color={colors.themecolor} />
            </View>
          ) : ( */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}
            style={{marginBottom: '18%'}}>
            {get_array && get_array.length > 0
              ? get_array.map((item, index) => {
                  // var Datt = [getdates - getmonth - getyear];
                  return (
                    <View>
                      <KeyboardAvoidingView
                        style={{flexGrow: 1, paddingBottom: '10%'}}
                        behavior={'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
                        <View
                          style={{
                            marginTop: '5%',
                            paddingBottom: '5%',
                            marginLeft: '5%',
                          }}>
                          <Text style={{color: colors.black, fontSize: 16}}>
                            Name :
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
                              value={getname}
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
                            <Text style={{color: colors.black, fontSize: 16}}>
                              Number :
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
                                value={getnumber}
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
                                value={cheasesno}
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
                                value={getkm}
                                ref={busref2}
                                placeholder="Enter a Starting Km..."
                                onChangeText={text => setkm(text)}
                                placeholderTextColor={colors.gray}
                                blurOnSubmit={false}
                              />
                            </View>
                          </View> */}
                        </View>
                      </KeyboardAvoidingView>
                    </View>
                  );
                })
              : null}
          </ScrollView>
          {/* )} */}
          <TouchableOpacity
            onPress={() => {
              Updatevehicleapi();
              // setcondition(false);
            }}
            style={{
              backgroundColor: '#ffa94d',
              width: metrics.WIDTH * 0.4,
              height: metrics.HEIGHT * 0.07,
              position: 'absolute',
              bottom: '2%',
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
                Update
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Vehiclescreen;
