import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  ScrollView,
  FlatList,
  AsyncStorage,
} from 'react-native';
import colors from '../../Utils/colors';
import metrics from '../../Utils/Metrics';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import HeaderComponent from '../components/HeaderComponent';
import {ACCEPT_HEADER, BASE_URL} from '../../Utils/baseurl';
import axios from 'axios';
import {useLoginContext} from './context/login_context';
import Toast from 'react-native-simple-toast';
const Home = props => {
  const {role, setLogout} = useLoginContext();
  useEffect(() => {
    // chaeckdevice();
  }, []);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      deshbord();
    });

    return unsubscribe;
  }, [props]);

  // const chaeckdevice = async () => {
  //   const device_id = await DeviceInfo.getDeviceId();
  //   // setdeviceid(device_id);
  //   console.log('device_id---->', device_id);
  // };

  const [on, off] = useState(true);
  const [on1, off1] = useState(true);
  const [getdata, SetData] = useState({});

  // const [getid, setid] = useState(props.route.params.userid);

  const deshbord = async () => {
    var Token = await AsyncStorage.getItem('token');
    axios
      .get(BASE_URL + 'get-dashboard', {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        if (res.data.status === 'Token is Expired') {
          setLogout();
        } else {
          console.log('userdata----=-=-=-=--.', res.data);
          SetData(res.data.data);
        }
      })
      .catch(err => console.log(JSON.stringify(err, null, 2)));
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
      <HeaderComponent
        navigation={props.navigation}
        title="Dashboard"
        isMenu={true}
      />
      {role === 4 || role === '4' || role === 3 || role === '3' ? null : (
        <ScrollView>
          <View style={{flexDirection: 'row', height: '30%'}}>
            <View
              style={{
                marginTop: metrics.HEIGHT * 0.02,
                marginHorizontal: '2%',
                borderWidth: 1,
                borderColor: '#8950FC',
                padding: '10%',
                elevation: 9,
                width: '45%',
                height: '90%',
                backgroundColor: '#EEE5FF',
                borderRadius: 5,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <View style={{justifyContent: 'center'}}>
                <Text style={{color: colors.black, fontSize: 16}}>
                  Attendance:{' '}
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    {getdata.today_attandance}{' '}
                  </Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Attendance')}
                style={{justifyContent: 'center'}}>
                <AntDesign name="rightcircle" color="#8950FC" size={30} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: metrics.HEIGHT * 0.02,
                marginHorizontal: '2%',
                borderWidth: 1,
                borderColor: '#FFA800',
                padding: '10%',
                elevation: 9,
                width: '45%',
                height: '90%',
                backgroundColor: '#FFF4DE',
                borderRadius: 5,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <View style={{justifyContent: 'center'}}>
                <Text style={{color: colors.black, fontSize: 16}}>
                  Total Lead:{' '}
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    {' '}
                    {getdata.lead}{' '}
                  </Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Lead')}
                style={{justifyContent: 'center'}}>
                <AntDesign name="rightcircle" color="#FFA800" size={30} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flexDirection: 'row', height: '30%'}}>
            <View
              style={{
                marginTop: metrics.HEIGHT * 0.02,
                marginHorizontal: '2%',
                borderWidth: 1,
                borderColor: '#000',
                padding: '10%',
                elevation: 9,
                width: '45%',
                height: '90%',
                backgroundColor: '#F3F4F6',
                borderRadius: 5,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <View style={{justifyContent: 'center'}}>
                <Text style={{color: colors.black, fontSize: 16}}>
                  Overtime:{'     '}
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    {getdata.yesterday_overtime}
                  </Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Overtime')}
                style={{justifyContent: 'center'}}>
                <AntDesign name="rightcircle" color="#000" size={30} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: metrics.HEIGHT * 0.02,
                marginHorizontal: '2%',
                borderWidth: 1,
                borderColor: '#FFA800',
                padding: '10%',
                elevation: 9,
                width: '45%',
                height: '90%',
                backgroundColor: '#FFF4DE',
                borderRadius: 5,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <View style={{justifyContent: 'center'}}>
                <Text style={{color: colors.black, fontSize: 16}}>
                  Vehicle:{'       '}
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    {' '}
                    {getdata.vehicle}
                  </Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Vehiclescreen')}
                style={{justifyContent: 'center'}}>
                <AntDesign name="rightcircle" color="#FFA800" size={30} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flexDirection: 'row', height: '30%'}}>
            <View
              style={{
                marginTop: metrics.HEIGHT * 0.02,
                marginHorizontal: '2%',
                borderWidth: 1,
                borderColor: '#155724',
                padding: '10%',
                elevation: 9,
                width: '45%',
                height: '90%',
                backgroundColor: '#D4EDDA',
                borderRadius: 5,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <View style={{justifyContent: 'center'}}>
                <Text style={{color: colors.black, fontSize: 16}}>
                  Holidays:{'    '}
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    {' '}
                    {getdata.total_holiday}{' '}
                  </Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => props.navigation.navigate('Holidayscreen')}
                style={{justifyContent: 'center'}}>
                <AntDesign name="rightcircle" color="#155724" size={30} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                marginTop: metrics.HEIGHT * 0.02,
                marginHorizontal: '2%',
                borderWidth: 1,
                borderColor: '#8950FC',
                padding: '10%',
                elevation: 9,
                width: '45%',
                height: '90%',
                backgroundColor: '#EEE5FF',
                borderRadius: 5,
                justifyContent: 'space-between',
                flexDirection: 'row',
              }}>
              <View style={{justifyContent: 'center'}}>
                <Text style={{color: colors.black, fontSize: 16}}>
                  Site Expense:{' '}
                  <Text
                    style={{
                      color: colors.black,
                      fontSize: 18,
                      fontWeight: 'bold',
                    }}>
                    {' '}
                    {}{' '}
                  </Text>
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => Toast.show('Comming Soon..!!')}
                style={{justifyContent: 'center'}}>
                <AntDesign name="rightcircle" color="#8950FC" size={30} />
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={{
              marginTop: metrics.HEIGHT * 0.02,
              marginHorizontal: '2%',

              padding: '10%',

              width: '45%',
              height: '100%',

              borderRadius: 5,
              justifyContent: 'space-between',
              flexDirection: 'row',
            }}></View>
          {/* <View
            style={{
              marginTop: metrics.HEIGHT * 0.02,
              marginHorizontal: '2%',
              borderWidth: 1,
              borderColor: '#3699FF',
              padding: '10%',
              elevation: 9,
              backgroundColor: '#E1F0FF',
              borderRadius: 5,
            }}>
            <Text style={{color: colors.black, fontSize: 16}}>
              In Process Vehicle:{' '}
              <Text
                style={{color: colors.black, fontSize: 18, fontWeight: 'bold'}}>
                {' '}
                {getdata.vehicle_process}{' '}
              </Text>
            </Text>
          </View> */}
          {/* <View
            style={{
              marginTop: metrics.HEIGHT * 0.02,
              marginHorizontal: '2%',
              borderWidth: 1,
              borderColor: '#F64E60',
              padding: '10%',
              elevation: 9,
              backgroundColor: '#FFE2E5',
              borderRadius: 5,
            }}>
            <Text style={{color: colors.black, fontSize: 16}}>
              Total Worker:{' '}
              <Text
                style={{color: colors.black, fontSize: 18, fontWeight: 'bold'}}>
                {getdata.emp_count}{' '}
              </Text>
            </Text>
          </View> */}
          {/* <View
            style={{
              marginTop: metrics.HEIGHT * 0.02,
              marginHorizontal: '2%',
              borderWidth: 1,
              borderColor: '#1BC5BD',
              padding: '10%',
              elevation: 9,
              backgroundColor: '#C9F7F5',
              borderRadius: 5,
            }}>
            <Text style={{color: colors.black, fontSize: 16}}>
              Total Employee:{' '}
              <Text
                style={{color: colors.black, fontSize: 18, fontWeight: 'bold'}}>
                {' '}
                {getdata.emp_count}{' '}
              </Text>
            </Text>
          </View> */}

          {/* <View
            style={{
              marginTop: metrics.HEIGHT * 0.02,
              marginHorizontal: '2%',
              borderWidth: 1,
              borderColor: '#155724',
              padding: '10%',
              elevation: 9,
              backgroundColor: '#D4EDDA',
              borderRadius: 5,
            }}>
            <Text style={{color: colors.black, fontSize: 16}}>
              Today's remaining Attendance:{' '}
              <Text
                style={{color: colors.black, fontSize: 18, fontWeight: 'bold'}}>
                {' '}
                {getdata.Today_remaining_attendence}
              </Text>
            </Text>
          </View> */}

          {/* <View
            style={{
              marginTop: metrics.HEIGHT * 0.02,
              marginHorizontal: '2%',
              borderWidth: 1,
              borderColor: '#000',
              padding: '10%',
              elevation: 9,
              backgroundColor: '#F3F4F6',
              borderRadius: 5,
            }}>
            <Text style={{color: colors.black, fontSize: 16}}>
              Not Approved User:{' '}
              <Text
                style={{color: colors.black, fontSize: 18, fontWeight: 'bold'}}>
                {getdata.notapproved_user_count}
              </Text>
            </Text>
          </View> */}
          {/* <View
            style={{
              marginTop: metrics.HEIGHT * 0.02,
              marginHorizontal: '2%',
              borderWidth: 1,
              borderColor: '#3699FF',
              padding: '10%',
              elevation: 9,
              backgroundColor: '#E1F0FF',
              borderRadius: 5,
            }}>
            <Text style={{color: colors.black, fontSize: 16}}>
              In Process Lead:{' '}
              <Text
                style={{color: colors.black, fontSize: 18, fontWeight: 'bold'}}>
                {' '}
                {getdata.lead_process}{' '}
              </Text>
            </Text>
          </View> */}
        </ScrollView>
      )}
    </View>
  );
};

export default Home;
