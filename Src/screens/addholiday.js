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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';

const Addholiday = props => {
  const [dates, setdates] = useState();
  const [months, setmonths] = useState();
  const [years, setyears] = useState();
  const [getdesc, setdesc] = useState('');
  useEffect(() => {}, []);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [getDate, setDate] = useState('dd/mm/yyyy');
  const [isloading, setisloading] = useState(false);

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

  const Addholidayapi = async () => {
    if (getDate == '' || getDate == null) {
      Toast.show('Please select a date');
    } else {
      var Userid = await AsyncStorage.getItem('user_id');
      console.log('userid', Userid);
      setisloading(true);
      var Token = await AsyncStorage.getItem('token');
      const formdata = new FormData();
      formdata.append('user_id', Userid);
      formdata.append('date', getDate);
      // formdata.append('month', months);
      // formdata.append('year', years);
      formdata.append('description', getdesc);
      console.log('formdata==>', formdata);
      axios
        .post(
          'https://theapplified.com/thewindowbay/api/v1/addUpdateHoliday',
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
            Toast.show(res.data.message);
            props.navigation.goBack();
          }
          console.log('Leave Data===>', res.data);
        })
        .catch(err => console.log(JSON.stringify(err, null, 2)));
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
          Add Holiday
        </Text>
      </View>
      <View style={{marginTop: '5%', paddingBottom: '5%', marginLeft: '5%'}}>
        <Text style={{color: colors.black, fontSize: 16}}>Date :</Text>
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
      <View style={{marginTop: '5%', paddingBottom: '5%', marginLeft: '5%'}}>
        <Text style={{color: colors.black, fontSize: 16}}>Description :</Text>
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
            placeholder="Enter a Description..."
            onChangeText={text => setdesc(text)}
            placeholderTextColor={colors.gray}
            blurOnSubmit={false}
          />
        </View>
        <TouchableOpacity
          onPress={() => {
            Addholidayapi();
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
            marginTop: '15%',
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
      </View>
    </View>
  );
};

export default Addholiday;
