import React, {useEffect, useState} from 'react';
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
  Platform,
} from 'react-native';
import colors from '../../Utils/colors';
import metrics from '../../Utils/Metrics';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import HeaderComponent from '../components/HeaderComponent';
import axios from 'axios';
import {BASE_URL, ACCEPT_HEADER} from '../../Utils/baseurl';
import {Picker} from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import Toast from 'react-native-simple-toast';
import RNModal from 'react-native-modal';
import {useLoginContext} from './context/login_context';
import {CheckBox} from 'react-native-elements';
const status = [
  {
    id: 0,
    title: 'Pending',
  },
  {
    id: 1,
    title: 'Rejected',
  },
  {
    id: 2,
    title: 'Approved',
  },
];

const Leavescreen = props => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible1, setModalVisible1] = useState('');
  const [selectuserid, Setselectuserid] = useState();
  const [getsubject, setsubject] = useState('');
  const [getmessage, setmessage] = useState('');
  const [isloading, setisloading] = useState(false);

  const [get_userid, set_userid] = useState();
  const [get_username, set_username] = useState('');
  const [get_usercon, set_usercon] = useState(false);
  const [getleaveloading, setleaveloading] = useState(false);
  const [current_index, setIndex] = useState('');
  var [get_array, set_Array] = useState([]);
  const [getid, set_id] = useState();
  const [getstatusid, setstatusid] = useState('');
  const [ids, setids] = useState();
  const {role} = useLoginContext();

  const [getitem, SetItem] = useState();
  const [getitem1, SetItem1] = useState();
  const [getitem2, SetItem2] = useState([]);

  const toggleModal = () => {
    setModalVisible1(!isModalVisible1);
  };

  const change = async (index, item) => {
    const temp = await get_array;
    temp[current_index] = await item;
    set_Array(temp);
    // setRefresh(!isRefresh);
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      Leaveapi();
      Userapi();
    });

    return unsubscribe;
  });

  const [getdata, setdata] = useState([]);

  const Leaveapi = async () => {
    setleaveloading(true);
    var Token = await AsyncStorage.getItem('token');
    axios
      .get(BASE_URL + 'leave', {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        console.log('lead data ====>', res.data.data);
        setdata(res.data.data);
        setBranchArray(res.data.data);
        setleaveloading(false);
      })
      .catch(err => console.log(JSON.stringify(err, null, 2)));
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [getDate, setDate] = useState();
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setDate(moment(date).format('DD-MM-YYYY'));
    hideDatePicker();
  };

  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
  const [getTo, setTo] = useState();
  const showDatePicker1 = () => {
    setDatePickerVisibility1(true);
  };

  const hideDatePicker1 = () => {
    setDatePickerVisibility1(false);
  };

  const handleConfirm1 = date => {
    setTo(moment(date).format('DD-MM-YYYY'));
    hideDatePicker1();
  };

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

  const Updateleaveapi = async () => {
    setisloading(true);
    var Token = await AsyncStorage.getItem('token');
    const formdata = new FormData();
    formdata.append('id', ids);
    if (get_usercon == true) {
      formdata.append('user_id', selectuserid);
    } else {
      formdata.append('user_id', get_userid);
    }
    formdata.append('subject', getsubject);
    formdata.append('message', getmessage);
    formdata.append('from_date', getDate);
    formdata.append('to_date', getTo);
    console.log('formdata==>', formdata);
    axios
      .post(BASE_URL + 'leave-update', formdata, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        console.log('Leave Data===>', res.data);
        setisloading(false);
        if (res.data.success == 1) {
          Toast.show(res.data.message);
          setModalVisible(false);
          Leaveapi();
        }
      })
      .catch(err => console.log(JSON.stringify(err, null, 2)));
  };

  const Statusupdateapi = async id => {
    var Token = await AsyncStorage.getItem('token');
    const formdata = new FormData();
    formdata.append('id', getid);
    formdata.append('status', id);
    for (var i = 0; i < getitem2.length; i++) {
      formdata.append('leavedaysmain_id[' + i + ']', getitem2[i].id);
    }
    if (getcondation === false) {
      for (var i = 0; i < getitem2.length; i++) {
        formdata.append('admin_firsthalf[' + i + ']', getitem2[i].firsthalf);
      }
      for (var i = 0; i < getitem2.length; i++) {
        formdata.append('admin_secondhalf[' + i + ']', getitem2[i].secondhalf);
      }
    } else {
      for (var i = 0; i < getlist.length; i++) {
        formdata.append('admin_firsthalf[' + i + ']', getlist[i] ? 1 : 0);
      }
      for (var i = 0; i < getlist1.length; i++) {
        formdata.append('admin_secondhalf[' + i + ']', getlist1[i] ? 1 : 0);
      }
    }

    console.log('formdata', formdata);
    axios
      .post(BASE_URL + 'update-leave-status', formdata, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        console.log('status-->>', res.data);
        if (res.data.success === 1) Toast.show(res.data.message);
        setModalVisible1(false);
        setisappmodel(false);
        setDate2('dd/mm/yyyy');
        setDate3('dd/mm/yyyy');
        Leaveapi();
      })
      .catch(err => console.log(JSON.stringify(err, null, 2)));
  };

  const [isappmodel, setisappmodel] = useState(false);
  const [getappids, setappid] = useState('');
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [getDate2, setDate2] = useState('dd/mm/yyyy');
  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
  };

  const hideDatePicker2 = () => {
    setDatePickerVisibility2(false);
  };

  const handleConfirm2 = date => {
    setDate2(moment(date).format('DD-MM-YYYY'));
    hideDatePicker2();
  };
  const [isDatePickerVisible3, setDatePickerVisibility3] = useState(false);
  const [getDate3, setDate3] = useState('dd/mm/yyyy');
  const showDatePicker3 = () => {
    setDatePickerVisibility3(true);
  };

  const hideDatePicker3 = () => {
    setDatePickerVisibility3(false);
  };

  const handleConfirm3 = date => {
    setDate3(moment(date).format('DD-MM-YYYY'));
    hideDatePicker3();
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
    setdata(newData);
  };

  const [getindex, setindex] = useState([]);
  const [getcheck, setcheck] = useState([]);
  const [newArray, setArray] = useState([]);
  const [getlist, setlist] = useState([]);

  const [getindex1, setindex1] = useState([]);
  const [getcheck1, setcheck1] = useState([]);
  const [newArray1, setArray1] = useState([]);
  const [getlist1, setlist1] = useState([]);
  const [getcondation, SetCondation] = useState(false);

  const check = (item, index, value) => {
    setindex(item);
    if (value) getcheck[index] = value;
    else getcheck[index] = !getcheck[index];
    if (getcheck[index]) setArray([...newArray, item]);
    else
      setArray(
        newArray.filter(function (i) {
          return i.id !== item.id;
        }),
      );

    if (setcheck[item] == true) {
      setlist.push(getindex);

      setlist(getindex);
    } else {
      var temp = getcheck.filter((x, i) => x !== getindex);

      setlist(temp);
    }
  };
  const check1 = (item, index, value) => {
    setindex1(item);
    if (value) getcheck1[index] = value;
    else getcheck1[index] = !getcheck1[index];
    if (getcheck1[index]) setArray1([...newArray1, item]);
    else
      setArray1(
        newArray1.filter(function (i) {
          return i.id !== item.id;
        }),
      );

    if (setcheck1[item] == true) {
      setlist1.push(getindex1);

      setlist1(getindex1);
    } else {
      var temp1 = getcheck1.filter((x, i) => x !== getindex1);
      setlist1(temp1);
      console.log('temp----', temp1);
    }

    console.log('-=================new array ', newArray1);
  };
  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
      <HeaderComponent
        navigation={props.navigation}
        title="Leave"
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
      {getleaveloading === true ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator size={50} color={colors.themecolor} />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={getleaveloading} onRefresh={Leaveapi} />
          }>
          {getdata && getdata.length > 0
            ? getdata.map((item, index) => {
                return (
                  <View
                    // onPress={() => {
                    //   setModalVisible(true);
                    //   set_array([item]);
                    //   setsubject(item.subject);
                    //   setmessage(item.message);
                    //   setDate(item.from_date);
                    //   setTo(item.to_date);
                    //   set_userid(item.username.id);
                    //   set_username(item.username.name);
                    //   setids(item.id);
                    // }}
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
                      <Entypo name="user" size={20} color={colors.themecolor} />
                      <Text
                        style={{
                          marginLeft: '5%',
                          color: colors.black,
                          fontSize: 15,
                          fontWeight: 'bold',
                        }}>
                        {item.username.name}
                      </Text>
                      {role === '1' ||
                      role === 1 ||
                      role === 2 ||
                      role === '2' ? (
                        <TouchableOpacity
                          onPress={() => {
                            props.navigation.navigate('Viewleave', {
                              item: item,
                            });
                          }}
                          style={{position: 'absolute', right: 20}}>
                          <FontAwesome
                            name="eye"
                            size={25}
                            color={colors.themecolor}
                          />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: '3%',
                        marginTop: '3%',
                      }}>
                      <Ionicons
                        name="stats-chart"
                        size={20}
                        color={colors.themecolor}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          {
                            role === '1' ||
                            role === 1 ||
                            role === '2' ||
                            role === 2
                              ? item.status == 0
                                ? (setModalVisible1(!isModalVisible1),
                                  SetItem(
                                    moment(item.from_date).format('DD-MM-YYYY'),
                                  ),
                                  SetItem1(
                                    moment(item.to_date).format('DD-MM-YYYY'),
                                  ),
                                  SetItem2(item.get_data))
                                : null
                              : null;
                          }
                          setIndex(index);
                          set_id(item.id);
                        }}
                        style={{
                          marginLeft: '5%',
                          backgroundColor:
                            item.status == 0
                              ? '#edb00c'
                              : item.status == 1
                              ? '#f20714'
                              : item.status == 2
                              ? 'green'
                              : item.status == 3
                              ? '#22920F'
                              : null,
                          padding: '1%',
                          borderRadius: 3,
                        }}>
                        <Text
                          style={{
                            marginLeft: '2%',
                            color: colors.white,
                            fontSize: 15,
                            fontWeight: 'bold',
                          }}>
                          {item.status == 0
                            ? 'Pending'
                            : item.status == 1
                            ? 'Rejected'
                            : item.status == 2
                            ? 'Approved'
                            : item.status == 3
                            ? 'Partially Approved'
                            : null}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            : null}
        </ScrollView>
      )}
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Leaveadd')}
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
          Add Leave
        </Text>
      </TouchableOpacity>
      {/* Status modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible1}
        onRequestClose={() => setModalVisible1(false)}>
        <View
          style={{
            // marginHorizontal: "5%",
            // alignSelf: "center",
            backgroundColor: colors.white,
            alignItems: 'center',
            borderRadius: 5,
            paddingBottom: '50%',
            // flex: 1,
            elevation: 3,
          }}>
          <View
            style={{
              marginTop: Platform.OS === 'ios' ? '15%' : '5%',
              width: metrics.WIDTH * 0.95,
              alignItems: 'flex-end',
            }}>
            <Ionicons
              name="close-circle-sharp"
              size={30}
              color={colors.themecolor}
              style={{}}
              onPress={() => setModalVisible1(false)}
            />
          </View>
          <View
            style={{
              marginTop: '20%',
              width: metrics.WIDTH * 0.5,
              marginHorizontal: '5%',
              backgroundColor: colors.white,
            }}>
            <FlatList
              data={status}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setstatusid(item.id);
                      change(index, item);

                      {
                        item.id == 2 || item.id == 3
                          ? setisappmodel(true)
                          : item.id == 0 || item.id == 1
                          ? Statusupdateapi(item.id)
                          : null;
                      }
                      // setsize(item.title);
                      toggleModal();
                    }}>
                    <View
                      style={{
                        marginTop: '5%',
                        alignSelf: 'center',
                        alignItems: 'center',
                        marginBottom: '5%',
                        backgroundColor: colors.white,
                      }}>
                      <Text
                        style={{
                          color: colors.themecolor,
                          fontWeight: '500',
                          fontSize: 20,
                        }}>
                        {item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
      {/* Status modal */}
      {/* approvel modal */}
      <RNModal
        animationType="slide"
        transparent={true}
        isVisible={isappmodel}
        onBackButtonPress={() => {
          setisappmodel(false);
          SetCondation(false);
        }}
        onBackdropPress={() => {
          setisappmodel(false);
          SetCondation(false);
        }}>
        <View
          style={{
            // marginHorizontal: "5%",
            // alignSelf: "center",
            backgroundColor: colors.white,
            // alignItems: 'center',
            borderRadius: 5,
            paddingBottom: '50%',
            // flex: 1,
            elevation: 3,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: '5%',
              justifyContent: 'space-between',
              marginTop: '5%',
              width: metrics.WIDTH * 0.8,
            }}>
            <View>
              <Text
                style={{
                  color: colors.themecolor,
                  fontWeight: 'bold',
                  fontSize: 18,
                }}>
                Approved
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
                  setisappmodel(false);
                  SetCondation(false);
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
          <View
            style={{
              width: metrics.WIDTH * 0.85,
              marginHorizontal: '5%',
              backgroundColor: colors.white,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <View style={{marginTop: '5%', paddingBottom: '5%'}}>
              <Text style={{color: colors.black, fontSize: 16}}>
                From Date :
              </Text>
              <View
                style={{
                  width: metrics.WIDTH * 0.4,
                  backgroundColor: colors.white,
                  marginTop: '5%',
                  elevation: 5,
                  borderRadius: 5,
                }}>
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
                    {getitem}
                  </Text>
                </View>
              </View>
            </View>
            <View
              style={{
                marginTop: '5%',
                paddingBottom: '5%',
                marginRight: metrics.HEIGHT * 0.02,
              }}>
              <Text style={{color: colors.black, fontSize: 16}}>To Date :</Text>
              <View
                style={{
                  width: metrics.WIDTH * 0.4,
                  backgroundColor: colors.white,
                  marginTop: '5%',
                  elevation: 5,
                  borderRadius: 5,
                }}>
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
                    {getitem1}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Text
            style={{
              color: colors.black,
              fontSize: 18,
              marginBottom: '5%',
              left: metrics.HEIGHT * 0.01,
            }}>
            Approval:
          </Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: '3%',
            }}>
            <View>
              <Text
                style={{color: colors.black, fontSize: 16, fontWeight: 'bold'}}>
                Date
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: colors.black,
                  fontSize: 16,
                  fontWeight: 'bold',
                  // left: metrics.HEIGHT * 0.03,
                }}>
                First Half
              </Text>
            </View>
            <View>
              <Text
                style={{color: colors.black, fontSize: 16, fontWeight: 'bold'}}>
                Second Half
              </Text>
            </View>
          </View>
          <View>
            <FlatList
              data={getitem2}
              renderItem={({item, index}) => {
                return (
                  <View style={{marginTop: metrics.HEIGHT * 0.02}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: '3%',
                      }}>
                      <View
                        style={{
                          justifyContent: 'center',
                        }}>
                        <Text
                          style={{
                            color: colors.black,
                            fontSize: 16,
                          }}>
                          {item.leavedates}
                        </Text>
                      </View>
                      <View
                        style={{
                          right: metrics.HEIGHT * 0.03,
                        }}>
                        <CheckBox
                          checked={
                            getcondation === false
                              ? item.firsthalf === 1
                                ? true
                                : false
                              : getcheck[(item, index)]
                          }
                          onPress={() => {
                            check(item, index), SetCondation(true);
                          }}
                        />
                      </View>
                      <View
                        style={{
                          right: metrics.HEIGHT * 0.03,
                        }}>
                        <CheckBox
                          checked={
                            getcondation === false
                              ? item.firsthalf === 1
                                ? true
                                : false
                              : getcheck1[(item, index)]
                          }
                          onPress={() => {
                            check1(item, index), SetCondation(true);
                          }}
                        />
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </View>
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
                setisappmodel(false);
                setDate2('dd/mm/yyyy');
                setDate3('dd/mm/yyyy');
              }}
              style={{
                backgroundColor: colors.white,
                borderRadius: 5,
                right: '15%',
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
                Statusupdateapi(getstatusid);
              }}
              style={{
                backgroundColor: colors.themecolor,
                padding: '10%',
                right: '15%',
                borderRadius: 5,
              }}>
              <Text style={{color: colors.white}}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </RNModal>
      {/* approvel modal */}
      {/* <Modal
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
                Update Leave Here
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

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{flexGrow: 1}}
            style={{marginBottom: '18%'}}>
            {get_array && get_array.length > 0
              ? get_array.map((item, index) => {
                  return (
                    <View>
                      <KeyboardAvoidingView
                        style={{flexGrow: 1, paddingBottom: '10%'}}
                        behavior={'height'}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
                        <View
                          style={{
                            marginTop: '5%',
                            marginLeft: '5%',
                            paddingBottom: '5%',
                          }}>
                          <Text style={{color: colors.black, fontSize: 16}}>
                            User Name :
                          </Text>
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
                              dropdownIconColor={colors.themecolor}
                              dropdownIconRippleColor={colors.themecolor}
                              onValueChange={itemValue => {
                                Setselectuserid(itemValue);
                                set_usercon(true);
                              }}>
                              <Picker.Item
                                label={get_username}
                                value={get_userid}
                              />
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
                          <View style={{marginTop: '5%', paddingBottom: '5%'}}>
                            <Text style={{color: colors.black, fontSize: 16}}>
                              Subject :
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
                                value={getsubject}
                                keyboardType="default"
                                returnKeyType="next"
                                placeholder="Enter a Subject..."
                                onChangeText={text => setsubject(text)}
                                placeholderTextColor={colors.gray}
                                blurOnSubmit={false}
                              />
                            </View>
                          </View>
                          <View style={{marginTop: '5%', paddingBottom: '5%'}}>
                            <Text style={{color: colors.black, fontSize: 16}}>
                              Message :
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
                                value={getmessage}
                                keyboardType="default"
                                returnKeyType="next"
                                placeholder="Enter a Message..."
                                onChangeText={text => setmessage(text)}
                                placeholderTextColor={colors.gray}
                                blurOnSubmit={false}
                              />
                            </View>
                          </View>
                          <View style={{marginTop: '5%', paddingBottom: '5%'}}>
                            <Text style={{color: colors.black, fontSize: 16}}>
                              From Date :
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
                            <Text style={{color: colors.black, fontSize: 16}}>
                              To Date :
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
                                mode="date"
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
                        </View>
                      </KeyboardAvoidingView>
                    </View>
                  );
                })
              : null}
          </ScrollView>

          <TouchableOpacity
            onPress={() => {
              Updateleaveapi();
            }}
            style={{
              backgroundColor: '#ffa94d',
              width: metrics.WIDTH * 0.4,
              height: metrics.HEIGHT * 0.07,
              position: 'absolute',
              bottom: '0%',
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
      </Modal> */}
    </View>
  );
};

export default Leavescreen;
