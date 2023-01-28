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
import Entypo from 'react-native-vector-icons/Entypo';
import HeaderComponent from '../components/HeaderComponent';
import axios from 'axios';
import {BASE_URL, ACCEPT_HEADER} from '../../Utils/baseurl';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Picker} from '@react-native-picker/picker';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import RNModal from 'react-native-modal';
import {useLoginContext} from './context/login_context';

const data = [
  {
    id: 1,
    name: 'Approved',
  },
  {
    id: 2,
    name: 'Not Approved',
  },
];

const Attendance = props => {
  const [selectuserid, Setselectuserid] = useState(0);
  const [selectuserid1, Setselectuserid1] = useState(0);
  const {role} = useLoginContext();

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      Attendanceapi();
    });
    Userapicall();
    return unsubscribe;
  }, [props]);
  const [modal, setmodal] = useState(false);
  const [getattendencedata, setattendencedata] = useState([]);
  const [isloading, setisloading] = useState(false);
  const Attendanceapi = async () => {
    var Token = await AsyncStorage.getItem('token');
    setisloading(true);
    // const formdata = new FormData();
    // formdata.append('id', selectuserid);
    // console.log('formdata===>', formdata);
    axios
      .get(BASE_URL + 'get-attendance', {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        setattendencedata(res.data.data);
        setBranchArray(res.data.data);
        setisloading(false);
      })
      .catch(err => console.log(err));
  };
  const Attendanceapi1 = async () => {
    var Token = await AsyncStorage.getItem('token');
    setisloading(true);
    const formdata = new FormData();
    formdata.append('id', selectuserid1);
    console.log('formdata===>', formdata);
    axios
      .post(BASE_URL + 'get-user-attendance', formdata, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        setattendencedata(res.data.data);
        setisloading(false);
        Setselectuserid1(0);
      })
      .catch(err => console.log(err));
  };
  const [getuser, setuserdata] = useState([]);
  const Userapicall = async () => {
    var Token = await AsyncStorage.getItem('token');
    axios
      .get(BASE_URL + 'get-user', {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        console.log('user data ====>', res.data.data);
        setuserdata(res.data.data);
      })
      .catch(err => console.log(JSON.stringify(err, null, 2)));
  };

  const [task_arrayholder, setBranchArray] = useState([]);

  const searchFilter = (text, id) => {
    const newData = task_arrayholder.filter(function (item) {
      const employee = item.username.name
        ? item.username.name.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return employee.indexOf(textData) > -1;
    });
    setattendencedata(newData);
  };

  const [getid, setid] = useState();
  const Satatus = async name => {
    var Token = await AsyncStorage.getItem('token');
    const formdata = new FormData();
    formdata.append('id', getid);
    formdata.append('status', name);
    console.log('formdata===>', formdata);
    axios
      .post(BASE_URL + 'attendance-status', formdata, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        console.log('statusdata', res.data);
        if (res.data.success === 1) {
          Toast.show(res.data.message);
          Attendanceapi();
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
      <HeaderComponent
        navigation={props.navigation}
        title="Attendance"
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
      {/* <View
        style={{
          width: '90%',
          backgroundColor: colors.white,
          marginTop: '5%',
          elevation: 5,
          borderRadius: 5,
          alignSelf: 'center',
        }}>
        <Picker
          selectedValue={selectuserid}
          dropdownIconColor={colors.themecolor}
          dropdownIconRippleColor={colors.themecolor}
          onValueChange={itemValue => {
            Setselectuserid(itemValue);
            Setselectuserid1(0);
            // set_indexvalue(itemValue);
          }}>
          <Picker.Item label="Select" value={0} />
          {getuser &&
            getuser.map((item, index) => {
              return <Picker.Item label={item.name} value={item.id} />;
            })}
        </Picker>
      </View>
      <View
        style={{
          marginTop: '5%',
          paddingHorizontal: '5%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => {
            Attendanceapi();
          }}
          style={{
            backgroundColor: colors.themecolor,
            width: metrics.WIDTH * 0.4,
            height: metrics.HEIGHT * 0.07,
            justifyContent: 'center',
            elevation: 5,
            borderRadius: 5,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '700',
              color: colors.white,
            }}>
            Filter
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Attendanceapi1();
          }}
          style={{
            backgroundColor: colors.white,
            width: metrics.WIDTH * 0.4,
            height: metrics.HEIGHT * 0.07,
            justifyContent: 'center',
            elevation: 5,
            borderRadius: 5,
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontWeight: '700',
              color: colors.themecolor,
            }}>
            Refresh
          </Text>
        </TouchableOpacity>
      </View> */}
      {isloading === true ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator size={50} color={colors.themecolor} />
        </View>
      ) : (
        <View style={{marginTop: '3%', flex: 1}}>
          <FlatList
            data={getattendencedata}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
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
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Entypo
                      name="user"
                      size={20}
                      color={colors.themecolor}
                      style={{marginLeft: '2%'}}
                    />
                    <Text
                      style={{
                        marginLeft: '2%',
                        color: colors.black,
                        fontWeight: 'bold',
                      }}>
                      {item.username.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: '3%',
                    }}>
                    <Fontisto
                      name="date"
                      size={20}
                      color={colors.themecolor}
                      style={{marginLeft: '2%'}}
                    />
                    <Text
                      style={{
                        marginLeft: '2%',
                        color: colors.black,
                        fontWeight: 'bold',
                      }}>
                      {moment(item.date).format('DD-MM-YYYY')}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: '3%',
                    }}>
                    <Ionicons
                      name="time-sharp"
                      size={20}
                      color={colors.themecolor}
                      style={{marginLeft: '2%'}}
                    />
                    <Text
                      style={{
                        marginLeft: '2%',
                        color: colors.black,
                        fontWeight: 'bold',
                      }}>
                      {item.time}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: '3%',
                    }}>
                    <Text
                      style={{
                        marginLeft: '2%',
                        color: colors.themecolor,
                        fontWeight: 'bold',
                        fontSize: 15,
                      }}>
                      Attendance :-
                    </Text>
                    {item.attendance === 'Not Approved ' ||
                    item.attendance === 'Not Approved' ||
                    item.attendance === 'Approved' ? (
                      <TouchableOpacity
                        onPress={() => {
                          {
                            role === '1' ||
                            role === 1 ||
                            role === '2' ||
                            role === 2
                              ? setmodal(true)
                              : null;
                          }
                          setid(item.id);
                        }}
                        style={{
                          padding: '2%',
                          marginLeft: '2%',
                          backgroundColor:
                            item.attendance === 'Not Approved ' ||
                            item.attendance === 'Not Approved'
                              ? '#CF3F82'
                              : item.attendance == 'Approved'
                              ? 'green'
                              : item.attendance == 'Leave'
                              ? '#687AB9'
                              : item.attendance == 'Holiday'
                              ? '#F19C01'
                              : null,
                          borderRadius: 5,
                        }}>
                        <Text
                          style={{
                            color:
                              item.attendance === 'Leave'
                                ? 'white'
                                : item.attendance === 'Holiday'
                                ? 'white'
                                : item.attendance == 'Approved'
                                ? 'white'
                                : item.attendance === 'Not Approved ' ||
                                  item.attendance == 'Not Approved'
                                ? 'white'
                                : null,
                            fontWeight: 'bold',
                          }}>
                          {item.attendance}
                        </Text>
                      </TouchableOpacity>
                    ) : (
                      <View
                        style={{
                          padding: '2%',
                          marginLeft: '2%',
                          backgroundColor:
                            item.attendance === 'Not Approved'
                              ? '#CF3F82'
                              : item.attendance == 'Approved'
                              ? 'green'
                              : item.attendance == 'Leave'
                              ? '#687AB9'
                              : item.attendance == 'Holiday'
                              ? '#F19C01'
                              : null,
                          borderRadius: 5,
                        }}>
                        <Text
                          style={{
                            color:
                              item.attendance === 'Leave'
                                ? 'white'
                                : item.attendance === 'Holiday'
                                ? 'white'
                                : item.attendance == 'Approved'
                                ? 'white'
                                : item.attendance === 'Not Approved'
                                ? 'white'
                                : null,
                            fontWeight: 'bold',
                          }}>
                          {item.attendance}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
      <RNModal
        animationType="slide"
        transparent={true}
        isVisible={modal}
        onBackButtonPress={() => {
          setmodal(false);
        }}
        onBackdropPress={() => {
          setmodal(false);
        }}>
        <View
          style={{
            backgroundColor: Colors.white,
            borderRadius: 5,
            // flex: 1,
            width: metrics.WIDTH * 0.8,
            alignSelf: 'center',
            marginTop: '10%',
            marginBottom: '10%',
            paddingBottom: '10%',
            elevation: 3,
          }}>
          <FlatList
            data={data}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    {
                      role === '1' || role === 1 || role === '2' || role === 2
                        ? Satatus(item.name)
                        : null;
                    }
                    setmodal(false);
                  }}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '10%',
                    marginBottom: '0%',
                  }}>
                  <Text
                    style={{
                      color: Colors.black,
                      fontWeight: 'bold',
                      fontSize: 16,
                    }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </RNModal>
    </View>
  );
};

export default Attendance;
