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
} from 'react-native';
import colors from '../../Utils/colors';
import metrics from '../../Utils/Metrics';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import Feather from 'react-native-vector-icons/Feather';
import HeaderComponent from '../components/HeaderComponent';
import axios from 'axios';
import {BASE_URL, ACCEPT_HEADER} from '../../Utils/baseurl';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import Toast from 'react-native-simple-toast';

const Holidayscreen = props => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [dates, setdates] = useState();
  const [months, setmonths] = useState();
  const [years, setyears] = useState();
  const [getdesc, setdesc] = useState('');
  const [holidayloading, setholidayloading] = useState(false);
  const [get_array, set_array] = useState([]);
  const [get_id, set_id] = useState();

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      Holidayapi();
    });

    return unsubscribe;
  });
  const [getdata, setdata] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [getDate, setDate] = useState('dd/mm/yyyy');
  const [isloading, setisloading] = useState(false);
  const [getdates, setdatess] = useState();
  const [getmonth, setmonth] = useState();
  const [getyear, setyear] = useState();
  const [condition, setcondition] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
    setcondition(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setcondition(true);
  };

  const handleConfirm = date => {
    setDate(moment(date).format('DD-MM-YYYY'));

    hideDatePicker();
  };

  const Holidayapi = async () => {
    setholidayloading(true);
    var Token = await AsyncStorage.getItem('token');
    axios
      .get(BASE_URL + 'holiday', {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        console.log('Holiday data ====>', res.data.data);
        setdata(res.data.data);
        setBranchArray(res.data.data);
        setholidayloading(false);
      })
      .catch(err => console.log(JSON.stringify(err, null, 2)));
  };

  const Updateholidayapi = async () => {
    if (getDate == '' || getDate == null) {
      Toast.show('Please select a date');
    } else {
      var Userid = await AsyncStorage.getItem('user_id');
      console.log('userid', Userid);
      setisloading(true);
      var Token = await AsyncStorage.getItem('token');
      const formdata = new FormData();
      formdata.append('id', get_id);
      formdata.append('user_id', Userid);
      formdata.append('date', getDate);
      // if (condition == true) {
      //   formdata.append('date', dates);
      //   formdata.append('month', months);
      //   formdata.append('year', years);
      // } else {
      //   formdata.append('date', getdates);
      //   formdata.append('month', getmonth);
      //   formdata.append('year', getyear);
      // }
      formdata.append('description', getdesc);
      console.log('formdata==>', formdata);
      axios
        .post(
          'https://theapplified.com/thewindowbay/api/v1/update-holiday',
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
            setcondition(false);
            setModalVisible(false);
            Toast.show(res.data.message);
            Holidayapi();
          }
          console.log('Leave Data===>', res.data);
        })
        .catch(err => {
          setisloading(false);
          Toast.show(
            'Something went wrong please check your internet connection',
          );
          console.log(err);
        });
    }
  };

  const [task_arrayholder, setBranchArray] = useState([]);

  const searchFilter = (text, id) => {
    const newData = task_arrayholder.filter(function (item) {
      const employee = item.date ? item.date.toUpperCase() : ''.toUpperCase();
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
        title="Holiday"
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
      {holidayloading === true ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator size={50} color={colors.themecolor} />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={holidayloading}
              onRefresh={Holidayapi}
            />
          }>
          {getdata && getdata.length > 0
            ? getdata.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(true);
                      set_array([item]);
                      console.log([item]);
                      setdesc(item.description);
                      setDate(item.date);
                      // setdatess(item.date);
                      // setmonth(item.month);
                      // setyear(item.year);
                      set_id(item.id);
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
                        marginLeft: '3%',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Fontisto
                        name="date"
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
                        {item.date}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            : null}
        </ScrollView>
      )}
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Addholiday')}
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
          Add Holiday
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
                Update Holiday Here
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
                            marginLeft: '5%',
                          }}>
                          <Text style={{color: colors.black, fontSize: 16}}>
                            Description :
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
                              value={getdesc}
                              returnKeyType="next"
                              placeholder="Enter a Description..."
                              onChangeText={text => setdesc(text)}
                              placeholderTextColor={colors.gray}
                              blurOnSubmit={false}
                            />
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
              Updateholidayapi();
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
      </Modal>
    </View>
  );
};

export default Holidayscreen;
