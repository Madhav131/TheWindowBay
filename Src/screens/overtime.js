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
import Entypo from 'react-native-vector-icons/Entypo';
import HeaderComponent from '../components/HeaderComponent';
import axios from 'axios';
import {BASE_URL, ACCEPT_HEADER} from '../../Utils/baseurl';
import Toast from 'react-native-simple-toast';
import moment from 'moment';
import {Picker} from '@react-native-picker/picker';
import RNModal from 'react-native-modal';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useLoginContext} from './context/login_context';

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

const Overtime = props => {
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      overtimeget();
    });
    return unsubscribe;
  });
  const [getovertime, setovertime] = useState([]);
  const [load, setload] = useState(false);
  const [getlocations, setlocations] = useState('');
  const {role} = useLoginContext();

  const overtimeget = async () => {
    setload(true);
    var Token = await AsyncStorage.getItem('token');
    axios
      .get(BASE_URL + 'get-overtime', {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        console.log('res overtime-->', res.data);
        setovertime(res.data.data);
        setBranchArray(res.data.data);
        setload(false);
      })
      .catch(err => {
        console.log(err);
      });
  };
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [getDate, setDate] = useState(moment(Date()).format('DD/MM/YYYY'));
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
  const [isDatePickerVisible2, setDatePickerVisibility2] = useState(false);
  const [getTo2, setTo2] = useState('hh/mm/ss');
  const showDatePicker2 = () => {
    setDatePickerVisibility2(true);
  };

  const hideDatePicker2 = () => {
    setDatePickerVisibility2(false);
  };

  const handleConfirm2 = time => {
    setTo2(moment(time).format('hh:mm:ss'));
    hideDatePicker2();
  };

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      Userapicall();
    });
    return unsubscribe;
  }, [props]);
  const [getuser, setuserdata] = useState([]);
  const [isername, setuser] = useState();
  const [iserid, setuseid] = useState();
  var [getarray, setArray] = useState([]);

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
  const [getmodel, setmodel] = useState(false);
  const [overtimemodel, setovertimemodel] = useState(false);
  const [condition, setcondition] = useState(false);
  const [getusername, setusername] = useState('');
  const [getuserid, setuserid] = useState('');
  const [isloading, setisloading] = useState(false);
  const [id, setid] = useState();
  const [current_index, setIndex] = useState('');

  const updateovertime = async () => {
    setisloading(true);
    var Token = await AsyncStorage.getItem('token');
    const formdata = new FormData();
    formdata.append('id', id);
    if (condition == true) {
      // formdata.append('user_id', getuserid);
    } else {
      formdata.append('user_id', iserid);
    }
    formdata.append('date', getDate);
    formdata.append('fromtime', getTo);
    formdata.append('totime', getTo2);
    formdata.append('location', getlocations);
    console.log('formdata--->', formdata);
    axios
      .post(BASE_URL + 'update-overtime', formdata, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        console.log('sdssdfs--->', res.data);
        if (res.data.success === 1) {
          setmodel(false);
          setisloading(false);
          overtimeget();
          Toast.show(res.data.message);
          if (condition == true) {
            setcondition(false);
          }
        }
      })
      .catch(err => console.log(err));
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
    setovertime(newData);
  };
  const [isModalVisible1, setModalVisible1] = useState('');

  const toggleModal = () => {
    setModalVisible1(!isModalVisible1);
  };

  const Statusupdateapi = async id => {
    var Token = await AsyncStorage.getItem('token');
    const formdata = new FormData();
    formdata.append('id', getid);
    formdata.append('status', id);
    console.log('formdata', formdata);
    axios
      .post(BASE_URL + 'update-overtime-status', formdata, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        console.log('status-->>', res.data);
        if (res.data.success === 1) Toast.show(res.data.message);
        setModalVisible1(false);
        overtimeget();
      })
      .catch(err => console.log(JSON.stringify(err, null, 2)));
  };

  const change = async (index, item) => {
    const temp = await getarray;
    temp[current_index] = await item;
    setArray(temp);
    // setRefresh(!isRefresh);
  };
  const [getid, set_id] = useState();

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
      <HeaderComponent
        navigation={props.navigation}
        title="Overtime"
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
            <RefreshControl refreshing={load} onRefresh={overtimeget} />
          }>
          <FlatList
            data={getovertime}
            renderItem={({item, index}) => {
              return (
                <View
                  onPress={() => {
                    // // setmodel(true);
                    // setuser(item.username.name);
                    // setuseid(item.username.id);
                    // setDate(item.date);
                    // setTo(item.fromtime);
                    // setTo2(item.totime);
                    // setid(item.id);
                    // setlocations(item.location);
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
                    <Entypo
                      name="user"
                      size={20}
                      color={colors.themecolor}
                      style={{width: metrics.WIDTH * 0.28}}
                    />
                    <Text
                      style={{
                        marginLeft: '2%',
                        color: colors.black,
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      {item.username.name}
                    </Text>
                  </View>
                  <View
                    style={{
                      // padding: '3%',
                      marginLeft: '3%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: '3%',
                    }}>
                    <Fontisto
                      name="date"
                      size={20}
                      color={colors.themecolor}
                      style={{width: metrics.WIDTH * 0.25}}
                    />
                    <Text
                      style={{
                        marginLeft: '5%',
                        color: colors.black,
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      {moment(item.date).format('DD-MM-YYYY') == 'Invalid date'
                        ? 'select a date'
                        : moment(item.date).format('DD-MM-YYYY')}
                    </Text>
                  </View>
                  <View
                    style={{
                      // padding: '3%',
                      marginLeft: '3%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: '3%',
                    }}>
                    <Text
                      style={{
                        color: colors.themecolor,
                        fontSize: 16,
                        fontWeight: 'bold',
                        width: metrics.WIDTH * 0.25,
                      }}>
                      From Time :
                    </Text>
                    <Text
                      style={{
                        marginLeft: '5%',
                        color: colors.black,
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      {item.fromtime}
                    </Text>
                  </View>
                  <View
                    style={{
                      // padding: '3%',
                      marginLeft: '3%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: '3%',
                    }}>
                    <Text
                      style={{
                        color: colors.themecolor,
                        fontSize: 16,
                        fontWeight: 'bold',
                        width: metrics.WIDTH * 0.25,
                      }}>
                      To Time :
                    </Text>
                    <Text
                      style={{
                        marginLeft: '5%',
                        color: colors.black,
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      {item.totime}
                    </Text>
                  </View>
                  <View
                    style={{
                      // padding: '3%',
                      marginLeft: '3%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: '3%',
                    }}>
                    <Text
                      style={{
                        color: colors.themecolor,
                        fontSize: 16,
                        fontWeight: 'bold',
                        width: metrics.WIDTH * 0.25,
                      }}>
                      Location
                    </Text>
                    <Text
                      style={{
                        marginLeft: '5%',
                        color: colors.black,
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      {item.location}
                    </Text>
                  </View>
                  <View
                    style={{
                      // padding: '3%',
                      marginLeft: '3%',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: '3%',
                    }}>
                    <Text
                      style={{
                        color: colors.themecolor,
                        fontSize: 16,
                        fontWeight: 'bold',
                        width: metrics.WIDTH * 0.25,
                      }}>
                      Status
                    </Text>
                    {role === '1' ||
                    role === 1 ||
                    role === 2 ||
                    role === '2' ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: '3%',
                          marginTop: '3%',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            {
                              item.status == 2
                                ? Toast.show('Status is already completed.')
                                : setIndex(index);
                            }
                            item.status == 2
                              ? null
                              : setModalVisible1(!isModalVisible1);
                            set_id(item.id);
                          }}
                          // style={[
                          //   styles.colorpending,
                          //   {
                          //     marginLeft: '5%',
                          //     // backgroundColor: colors.themecolor,
                          //     padding: '1%',
                          //     borderRadius: 3,
                          //   },
                          // ]}
                          style={[
                            item.status == 0
                              ? {backgroundColor: '#f5edd7'}
                              : item.status == 1
                              ? {backgroundColor: '#ebc7c9'}
                              : item.status == 2
                              ? {backgroundColor: '#c7ebd2'}
                              : item.status == 3
                              ? {backgroundColor: '#CDE2FC'}
                              : item.status == 4
                              ? {backgroundColor: '#c1edf5'}
                              : null,
                            {
                              marginLeft: '5%',
                              padding: '1%',
                              borderRadius: 3,
                            },
                          ]}>
                          <Text
                            style={[
                              item.status == 0
                                ? {color: '#edb00c'}
                                : item.status == 1
                                ? {color: '#f20714'}
                                : item.status == 2
                                ? {color: '#43BF57'}
                                : null,
                              {
                                marginLeft: '2%',
                                fontWeight: 'bold',
                                fontSize: 15,
                                padding: 5,
                              },
                            ]}>
                            {item.status == 0
                              ? 'Pending'
                              : item.status == 1
                              ? 'Rejected'
                              : item.status == 2
                              ? 'Approved'
                              : null}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <Text
                        style={{
                          marginLeft: '5%',
                          color:
                            item.status == 0
                              ? 'Yellow'
                              : item.status == 1
                              ? 'red'
                              : item.status == 2
                              ? colors.themecolor
                              : null,
                          fontSize: 15,
                          fontWeight: 'bold',
                        }}>
                        {item.status == null
                          ? ''
                          : item.status == 0
                          ? 'Pending'
                          : item.status == 1
                          ? 'Rejected'
                          : item.status == 2
                          ? 'Approved'
                          : null}
                      </Text>
                    )}
                  </View>
                </View>
              );
            }}
          />
        </ScrollView>
      </View>
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Addovertime');
        }}
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
          Add Overtime
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={getmodel}
        onRequestClose={() => {
          setmodel(false);
        }}>
        <View
          style={{
            marginTop: '7%',
            // marginHorizontal: "5%",
            backgroundColor: colors.white,
            borderRadius: 5,
            paddingBottom: '5%',
            flex: 1,
            elevation: 3,
          }}>
          <View
            style={{
              padding: '5%',
              backgroundColor: colors.white,
              elevation: 5,
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <TouchableOpacity onPress={() => setmodel(false)}>
              <Ionicons
                name="arrow-back-circle"
                size={30}
                color={colors.themecolor}
              />
            </TouchableOpacity>
            <Text
              style={{
                color: colors.black,
                fontSize: 16,
                marginLeft: '2%',
                fontWeight: 'bold',
              }}>
              Edit Overtime
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: '5%',
              justifyContent: 'space-between',
              marginTop: '5%',
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  marginTop: '5%',
                  paddingBottom: '5%',
                  marginLeft: '5%',
                }}>
                {/* <Text style={{color: colors.black, fontSize: 16}}>Name :</Text>
                <TouchableOpacity
                  onPress={() => {
                    setovertimemodel(true);
                  }}
                  style={{
                    backgroundColor: colors.white,
                    elevation: 5,
                    borderRadius: 5,
                    width: '90%',
                    backgroundColor: colors.white,
                    height: metrics.HEIGHT * 0.06,
                    justifyContent: 'center',
                    marginTop: '5%',
                  }}>
                  {condition == true ? (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: colors.black,
                          marginLeft: '5%',
                          fontSize: 15,
                        }}>
                        {getusername}
                      </Text>
                      <MaterialIcons
                        name="arrow-drop-down"
                        size={25}
                        color={colors.themecolor}
                        style={{marginRight: '5%'}}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          color: colors.black,
                          marginLeft: '5%',
                          fontSize: 15,
                        }}>
                        {isername}
                      </Text>
                      <MaterialIcons
                        name="arrow-drop-down"
                        size={25}
                        color={colors.themecolor}
                        style={{marginRight: '5%'}}
                      />
                    </View>
                  )}
                </TouchableOpacity> */}
                <View style={{marginTop: '5%', paddingBottom: '5%'}}>
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 16,
                    }}>
                    Date :
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
                <View
                  style={{
                    marginTop: '5%',
                    paddingBottom: '5%',
                  }}>
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 16,
                    }}>
                    From Time :
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
                </View>
                <View style={{marginTop: '5%', paddingBottom: '5%'}}>
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 16,
                    }}>
                    To Time :
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
                      isVisible={isDatePickerVisible2}
                      mode="time"
                      onConfirm={handleConfirm2}
                      onCancel={hideDatePicker2}
                    />
                    <TouchableOpacity onPress={showDatePicker2}>
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
                          {getTo2}
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
                    <Text
                      style={{
                        color: colors.black,
                        fontSize: 16,
                        marginLeft: '2%',
                      }}>
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
                        value={getlocations}
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
                <TouchableOpacity
                  onPress={() => {
                    updateovertime();
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
                    <View
                      style={{justifyContent: 'center', alignItems: 'center'}}>
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
            </ScrollView>
          </View>
        </View>
      </Modal>
      <RNModal
        // animationType="slide"
        transparent={true}
        isVisible={overtimemodel}
        onBackButtonPress={() => setovertimemodel(false)}
        onBackdropPress={() => setovertimemodel(false)}>
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
            data={getuser}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setusername(item.name);
                    setuserid(item.id);
                    setovertimemodel(false);
                    setcondition(true);
                  }}
                  style={{padding: '3%'}}>
                  <Text style={{color: colors.black, fontSize: 15}}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </RNModal>
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
              marginTop: '5%',
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
                      change(index, item);
                      Statusupdateapi(item.id);
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
    </View>
  );
};

export default Overtime;
