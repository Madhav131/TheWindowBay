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
import {timing} from 'react-native-reanimated';

const Addovertime = props => {
  const [selectuserid, Setselectuserid] = useState();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isloading, setLoading] = useState(false);
  const [getlocations, setlocations] = useState('');

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

  const createovertime = async () => {
    if (getDate == moment(Date()).format('DD/MM/YYYY') || getDate == null) {
      Toast.show('please select date');
    } else if (getTo == 'hh/mm/ss' || getTo == null) {
      Toast.show('please select From Time');
    } else if (getTo2 == 'hh/mm/ss' || getTo2 == null) {
      Toast.show('please select To Time');
    } else if (getlocations == '' || getlocations == null) {
      Toast.show('please enter a Location');
    } else {
      setLoading(true);
      var Token = await AsyncStorage.getItem('token');
      const formdata = new FormData();
      // formdata.append('user_id', selectuserid);
      formdata.append('date', getDate);
      formdata.append('fromtime', getTo);
      formdata.append('totime', getTo2);
      formdata.append('location', getlocations);
      console.log('formdata--->', formdata);
      axios
        .post(BASE_URL + 'create-overtime', formdata, {
          headers: {
            Accept: ACCEPT_HEADER,
            Authorization: 'Bearer ' + Token,
          },
        })
        .then(res => {
          console.log('sdssdfs--->', res.data);
          if (res.data.success === 1) {
            Toast.show(res.data.message);
            props.navigation.goBack(null);
            setLoading(false);
          }
        })
        .catch(err => console.log(err));
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
          Create Overtime
        </Text>
      </View>
      <ScrollView
        style={{marginBottom: '5%', paddingBottom: '5%'}}
        showsVerticalScrollIndicator={false}>
        {/* <Text
          style={{
            color: colors.black,
            fontSize: 16,
            marginHorizontal: '5%',
            marginTop: '5%',
          }}>
          User Name :
        </Text>
        <View
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
              // set_indexvalue(itemValue);
            }}>
            <Picker.Item label="Select" value={0} />
            {getuser.map((item, index) => {
              return <Picker.Item label={item.name} value={item.id} />;
            })}
          </Picker>
        </View> */}
        <View style={{marginTop: '5%', paddingBottom: '5%'}}>
          <Text
            style={{color: colors.black, fontSize: 16, marginHorizontal: '5%'}}>
            Date :
          </Text>
          <View
            style={{
              width: '90%',
              backgroundColor: colors.white,
              marginTop: '5%',
              elevation: 5,
              borderRadius: 5,
              alignSelf: 'center',
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
            style={{color: colors.black, fontSize: 16, marginHorizontal: '5%'}}>
            From Time :
          </Text>
          <View
            style={{
              width: '90%',
              backgroundColor: colors.white,
              marginTop: '5%',
              elevation: 5,
              borderRadius: 5,
              alignSelf: 'center',
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
            style={{color: colors.black, fontSize: 16, marginHorizontal: '5%'}}>
            To Time :
          </Text>
          <View
            style={{
              width: '90%',
              backgroundColor: colors.white,
              marginTop: '5%',
              elevation: 5,
              borderRadius: 5,
              alignSelf: 'center',
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
        </View>
        <View style={{paddingBottom: '5%', marginTop: '5%'}}>
          <Text style={{color: colors.black, fontSize: 16, marginLeft: '5%'}}>
            Location :
          </Text>
          <View
            style={{
              width: '90%',
              backgroundColor: colors.white,
              marginTop: '5%',
              elevation: 5,
              borderRadius: 5,
              marginHorizontal: '5%',
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
        <TouchableOpacity
          onPress={() => {
            createovertime();
          }}
          style={{
            backgroundColor: colors.themecolor,
            width: metrics.WIDTH * 0.4,
            height: metrics.HEIGHT * 0.07,
            justifyContent: 'center',
            elevation: 5,
            borderRadius: 5,
            alignSelf: 'center',
            marginTop: '15%',
            marginBottom: '2%',
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

export default Addovertime;
