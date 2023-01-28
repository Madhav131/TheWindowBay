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
import {Picker} from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import DateTimePicker from '@react-native-community/datetimepicker';
import {template} from '@babel/core';
import {CheckBox} from 'react-native-elements';
const Leaveadd = props => {
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      Userapi();
    });
    return unsubscribe;
  }, [props]);
  const busref = useRef();
  const busref1 = useRef();
  const [selectuserid, Setselectuserid] = useState();
  const [getsubject, setsubject] = useState('');
  const [getmessage, setmessage] = useState('');
  const [isloading, setisloading] = useState(false);

  const [getcheck, setcheck] = useState([]);
  const [getindex, setindex] = useState([]);
  const [newArray, setArray] = useState([]);
  const [getlist, setlist] = useState([]);

  const [getcheck1, setcheck1] = useState([]);
  const [getindex1, setindex1] = useState([]);
  const [newArray1, setArray1] = useState([]);
  const [getlist1, setlist1] = useState([]);

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
      .catch(err => console.log('err-->', err));
  };

  const Addleaveapi = async () => {
    if (
      selectuserid === undefined ||
      selectuserid === null ||
      selectuserid === ''
    ) {
      Toast.show('Select user name');
    } else if (getsubject == '' || getsubject === null) {
      Toast.show('Please Enter Subject');
    } else if (getmessage == '' || getsubject == null) {
      Toast.show('Please Enter Message');
    } else if (
      formDate == moment(Date()).format('DD/MM/YYYY') ||
      formDate === null
    ) {
      Toast.show('Please Enter From Date');
    } else if (
      toDate == moment(Date()).format('DD/MM/YYYY') ||
      toDate === null
    ) {
      Toast.show('Please Enter To Date');
    } else {
      setisloading(true);
      var Token = await AsyncStorage.getItem('token');
      const formdata = new FormData();
      formdata.append('user_id', selectuserid);
      formdata.append('subject', getsubject);
      formdata.append('message', getmessage);
      formdata.append('from_date', formDate);
      formdata.append('to_date', toDate);
      // formdata.append('leavedates[0]', '2022-09-09');

      for (var i = 0; i < xyz.length; i++) {
        formdata.append('leavedates[' + i + ']', xyz[i]);
      }
      for (var i = 0; i < getlist.length; i++) {
        formdata.append('firsthalf[' + i + ']', getlist[i] ? 1 : 0);
      }
      for (var i = 0; i < getlist1.length; i++) {
        formdata.append('secondhalf[' + i + ']', getlist1[i] ? 1 : 0);
      }
      console.log('formdata==>', formdata);
      axios
        .post(BASE_URL + 'addLeave', formdata, {
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
          console.log('Leave Data===>', res.data);
        })
        .catch(err => console.log(JSON.stringify(err, null, 2)));
    }
  };

  const test = () => {
    for (var i = 0; i < getlist.length; i++) {
      console.log('test--==>');
    }
  };

  const [totalDays, setTotalDays] = useState(0);
  const [times, setTimes] = useState([]);
  const [getIndex, setDateIndex] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
  const [isFromTimeVisible, setFromTimeVisibility] = useState(false);
  const [isToTimeVisible, setToTimeVisibility] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [formDate, setFormDate] = useState();
  const [toDate, setToDate] = useState();
  const [array, AetArray] = useState([]);
  const [xyz, XYZ] = useState([]);
  useEffect(() => {
    var start = moment(formDate, 'YYYY-MM-DD');
    var end = moment(toDate, 'YYYY-MM-DD');
    const total_days = start.diff(end, 'days');

    setTotalDays(isNaN(total_days) ? 0 : Math.abs(total_days) + 1);
  }, [formDate, toDate]);

  useEffect(() => {
    const temp = [];

    for (var i = 0; i < totalDays; i++) {}
    // console.log(temp);
    // setTimes(temp);
  }, [totalDays]);

  // const allcheck = index => {
  //   for (var i = 0; i < xyz.length; i++) {
  //     check(xyz[i], i, true);
  //     check1(xyz[i], i, true);
  //   }
  // };
  useEffect(() => {
    const start = new Date(formDate);
    const end = new Date(toDate);

    const daysBetween = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    const arr = [];
    for (let i = 0; i <= daysBetween; i++) {
      const temp = new Date();
      temp.setDate(start.getDate() + i);

      array.push(moment(temp).format('YYYY-MM-DD'));
    }
    for (var i = 0; i < array.length; i++) {
      check(array[i], i, true);
      check1(array[i], i, true);
    }

    XYZ(array);
  }, [toDate]);

  const addFromTime = async date => {
    const temp = times;
    temp[getIndex].from = moment(date.nativeEvent.timestamp).format('hh:mm:ss');
    setTimes(temp);
    setRefresh(!refresh);
    // setFromTimeVisibility(false)
  };

  const addToTime = async date => {
    const temp = times;
    temp[getIndex].to = moment(date.nativeEvent.timestamp).format('hh:mm:ss');
    setTimes(temp);
    setRefresh(!refresh);
  };

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
          Leave Create
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} style={{}}>
        <View style={{marginTop: '5%', marginLeft: '5%', paddingBottom: '5%'}}>
          <Text style={{color: colors.black, fontSize: 16}}>User Name :</Text>
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
          <View style={{marginTop: '5%', paddingBottom: '5%'}}>
            <Text style={{color: colors.black, fontSize: 16}}>Subject :</Text>
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
                placeholder="Enter a Subject..."
                onChangeText={text => setsubject(text)}
                placeholderTextColor={colors.gray}
                ref={busref}
                onSubmitEditing={() => {
                  busref.current.focus();
                }}
                blurOnSubmit={false}
              />
            </View>
          </View>
          <View style={{marginTop: '5%', paddingBottom: '5%'}}>
            <Text style={{color: colors.black, fontSize: 16}}>Message :</Text>
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
                placeholder="Enter a Message..."
                onChangeText={text => setmessage(text)}
                placeholderTextColor={colors.gray}
                ref={busref}
                onSubmitEditing={() => {
                  busref.current.focus();
                }}
                blurOnSubmit={false}
              />
            </View>
          </View>
          <View
            style={{
              marginTop: '5%',
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '90%',
            }}>
            <Text
              style={{
                color: colors.themecolor,
              }}>
              From date:
            </Text>
            <Text
              style={{
                color: colors.themecolor,
                position: 'absolute',
                left: '50%',
              }}>
              To Date:
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: '5%',
            }}>
            <View style={{flexDirection: 'row'}}>
              <View
                style={{
                  marginHorizontal: '5%',
                  marginTop: '3%',
                  justifyContent: 'center',
                  borderWidth: 1,
                  width: metrics.WIDTH * 0.35,
                  height: metrics.HEIGHT * 0.06,
                  borderColor: '#ced4da',
                  borderRadius: 6,
                }}>
                <TouchableOpacity onPress={() => setDatePickerVisibility(true)}>
                  <View
                    style={{
                      //   backgroundColor: "grey",
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        color: colors.themecolor,
                        marginHorizontal: '5%',
                        alignSelf: 'center',
                      }}>
                      {moment(formDate).format('DD/MM/YYYY')}
                    </Text>
                    <Fontisto
                      name="date"
                      size={25}
                      style={{
                        marginHorizontal: '5%',
                        color: '#1864ab',
                        // backgroundColor: "red",
                      }}
                    />
                  </View>
                </TouchableOpacity>
                {isDatePickerVisible ? (
                  <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={date => {
                      setDatePickerVisibility(false),
                        setFormDate(
                          moment(date.nativeEvent.timestamp).format(
                            'YYYY-MM-DD',
                          ),
                        );
                    }}
                  />
                ) : null}
              </View>
              <View
                style={{
                  marginHorizontal: '5%',
                  marginTop: '3%',
                  justifyContent: 'center',
                  borderWidth: 1,
                  width: metrics.WIDTH * 0.35,
                  height: metrics.HEIGHT * 0.06,
                  borderColor: '#ced4da',
                  borderRadius: 6,
                }}>
                <TouchableOpacity
                  onPress={() => setDatePickerVisibility1(true)}>
                  <View
                    style={{
                      //   backgroundColor: "grey",
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text
                      style={{
                        alignSelf: 'center',
                        color: colors.themecolor,
                        marginHorizontal: '5%',
                      }}>
                      {moment(toDate).format('DD/MM/YYYY')}
                    </Text>
                    <Fontisto
                      name="date"
                      size={25}
                      style={{
                        marginHorizontal: '5%',
                        color: '#1864ab',
                        // backgroundColor: "red",
                      }}
                    />
                  </View>
                </TouchableOpacity>
                {isDatePickerVisible1 ? (
                  <DateTimePicker
                    value={new Date()}
                    mode="date"
                    display="default"
                    onChange={date => {
                      setDatePickerVisibility1(false),
                        setToDate(
                          moment(date.nativeEvent.timestamp).format(
                            'YYYY-MM-DD',
                          ),
                        );
                    }}
                  />
                ) : null}
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: '8%',
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
                  left: metrics.HEIGHT * 0.03,
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
              data={xyz}
              extraData={refresh}
              renderItem={({item, index}) => {
                return (
                  <View style={{marginTop: metrics.HEIGHT * 0.02}}>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginHorizontal: '8%',
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
                          {item}
                        </Text>
                      </View>
                      <View
                        style={{
                          right: metrics.HEIGHT * 0.03,
                        }}>
                        <CheckBox
                          checked={getcheck[(item, index)]}
                          onPress={() => check(item, index)}
                        />
                      </View>
                      <View
                        style={{
                          right: metrics.HEIGHT * 0.03,
                        }}>
                        <CheckBox
                          checked={getcheck1[(item, index)]}
                          onPress={() => check1(item, index)}
                        />
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </View>
          {isFromTimeVisible ? (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display="default"
              onChange={date => {
                setFromTimeVisibility(false), addFromTime(date);
              }}
            />
          ) : null}
          {isToTimeVisible ? (
            <DateTimePicker
              value={new Date()}
              mode="time"
              display="default"
              onChange={date => {
                setToTimeVisibility(false), addToTime(date);
              }}
            />
          ) : null}
        </View>
        <TouchableOpacity
          onPress={() => {
            Addleaveapi();
            // test();
          }}
          style={{
            backgroundColor: colors.themecolor,
            width: metrics.WIDTH * 0.4,
            height: metrics.HEIGHT * 0.07,
            justifyContent: 'center',
            elevation: 10,
            borderRadius: 5,
            alignSelf: 'center',
            marginBottom: '5%',
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
    </View>
  );
};

export default Leaveadd;

// const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
// const [getDate, setDate] = useState('DD/MM/YYYY');
// const showDatePicker = () => {
//   setDatePickerVisibility(true);
// };

// const hideDatePicker = () => {
//   setDatePickerVisibility(false);
// };

// const handleConfirm = date => {
//   setDate(moment(date).format('DD-MM-YYYY'));
//   hideDatePicker();
// };

// const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
// const [getTo, setTo] = useState('DD/MM/YYYY');
// const showDatePicker1 = () => {
//   setDatePickerVisibility1(true);
// };

// const hideDatePicker1 = () => {
//   setDatePickerVisibility1(false);
// };

// const handleConfirm1 = date => {
//   setTo(moment(date).format('DD-MM-YYYY'));
//   hideDatePicker1();
// };
