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
import {CheckBox} from 'react-native-elements';
const Viewleave = props => {
  //   useEffect(() => {
  //     const unsubscribe = props.navigation.addListener('focus', () => {
  //       Userapi();
  //     });
  //     return unsubscribe;
  //   });
  const busref = useRef();
  const busref1 = useRef();
  const [selectuserid, Setselectuserid] = useState();
  const [getsubject, setsubject] = useState('');
  const [getmessage, setmessage] = useState('');
  const [isloading, setisloading] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [getDate, setDate] = useState();
  const [getarray, SetArray] = useState([]);
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

  const [totalDays, setTotalDays] = useState(0);

  //   useEffect(() => {
  //     var start = moment(getDate, 'YYYY-MM-DD');
  //     var end = moment(getTo, 'YYYY-MM-DD');
  //     const total_days = start.diff(end, 'days');
  //     console.log('sfdgf', total_days, isNaN(totalDays));
  //     setTotalDays(isNaN(total_days) ? 0 : Math.abs(total_days) + 1);
  //     console.log(Math.abs(total_days));
  //   }, [getDate, getTo]);

  useEffect(() => {
    const {item} = props.route.params;
    if (item !== '') {
      Setselectuserid(item.username.name);
      setsubject(item.subject);
      setmessage(item.message);
      setDate(item.from_date);
      setTo(item.to_date);
      SetArray(item.get_data);
    } else {
    }
  });

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
          View Leave
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
              height: 50,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: colors.black,
                fontSize: 16,
                fontWeight: '600',
                marginLeft: 5,
              }}>
              {selectuserid}
            </Text>
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
                height: 50,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: 16,
                  fontWeight: '600',
                  marginLeft: 5,
                }}>
                {getsubject}
              </Text>
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
                height: 50,
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  color: colors.black,
                  fontSize: 16,
                  fontWeight: '600',
                  marginLeft: 5,
                }}>
                {getmessage}
              </Text>
            </View>
          </View>
          <View style={{marginTop: '5%', paddingBottom: '5%'}}>
            <Text style={{color: colors.black, fontSize: 16}}>From Date :</Text>
            <View
              style={{
                width: '90%',
                backgroundColor: colors.white,
                marginTop: '5%',
                elevation: 5,
                borderRadius: 5,
              }}>
              <View>
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
              </View>
            </View>
          </View>
          <View style={{marginTop: '5%', paddingBottom: '5%'}}>
            <Text style={{color: colors.black, fontSize: 16}}>To Date :</Text>
            <View
              style={{
                width: '90%',
                backgroundColor: colors.white,
                marginTop: '5%',
                elevation: 5,
                borderRadius: 5,
              }}>
              <View>
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
              </View>
            </View>
          </View>
          <Text style={{color: colors.black, fontSize: 18, marginBottom: '5%'}}>
            Requested:
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
              data={getarray}
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
                          checked={item.firsthalf === 1 ? true : false}
                        />
                      </View>
                      <View
                        style={{
                          right: metrics.HEIGHT * 0.03,
                        }}>
                        <CheckBox
                          checked={item.secondhalf === 1 ? true : false}
                          // onPress={() => check1(item, index)}
                        />
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </View>
          <Text style={{color: colors.black, fontSize: 18, marginBottom: '5%'}}>
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
              data={getarray}
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
                          checked={item.admin_firsthalf === 1 ? true : false}
                        />
                      </View>
                      <View
                        style={{
                          right: metrics.HEIGHT * 0.03,
                        }}>
                        <CheckBox
                          checked={item.admin_secondhalf === 1 ? true : false}
                          // onPress={() => check1(item, index)}
                        />
                      </View>
                    </View>
                  </View>
                );
              }}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Viewleave;
