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
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import colors from '../../Utils/colors';
import metrics from '../../Utils/Metrics';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HeaderComponent from '../components/HeaderComponent';
import axios from 'axios';
import {BASE_URL, ACCEPT_HEADER} from '../../Utils/baseurl';
import Toast from 'react-native-simple-toast';
import RNModal from 'react-native-modal';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const Vehiclehistory = props => {
  const [getvehicleloading, setvehicleloading] = useState(false);
  const [getdata, setdata] = useState([]);
  // const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      Vehiclehistoryapi();
    });
    return unsubscribe;
  });

  const Vehiclehistoryapi = async () => {
    setvehicleloading(true);
    var Token = await AsyncStorage.getItem('token');
    axios
      .get(BASE_URL + 'VehicleHistory', {
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
  const [task_arrayholder, setBranchArray] = useState([]);

  const searchFilter_vehicle = (text, id) => {
    const newData = task_arrayholder.filter(function (item) {
      const employee = item.vehicle.name
        ? item.vehicle.name.toUpperCase()
        : ''.toUpperCase();
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
        title="Vehicle History"
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
          onChangeText={value => searchFilter_vehicle(value)}
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
              onRefresh={Vehiclehistoryapi}
            />
          }>
          <View style={{marginTop: '3%'}}>
            {getdata && getdata.length > 0
              ? getdata.map((item, index) => {
                  return (
                    <View
                      onPress={() => {
                        // setModalVisible(true);
                        // console.log([item]);
                      }}
                      style={{
                        borderRadius: 5,
                        backgroundColor: colors.lighttheme,
                        marginTop: '5%',
                        marginBottom: '1%',
                        marginHorizontal: '5%',
                        paddingBottom: '3%',
                        paddingTop: '3%',
                        width: metrics.WIDTH * 0.9,
                      }}>
                      <View
                        style={{
                          marginLeft: '5%',
                        }}>
                        <Text
                          style={{
                            color: colors.themecolor,
                            fontSize: 16,
                            fontWeight: 'bold',
                          }}>
                          Starting Km photo :-
                        </Text>
                      </View>
                      <View style={{marginTop: '5%', alignSelf: 'center'}}>
                        <Image
                          source={{uri: item.startkm_photo_fullpath}}
                          resizeMode="stretch"
                          style={{
                            width: metrics.WIDTH * 0.4,
                            height: metrics.HEIGHT * 0.2,
                            borderRadius: 5,
                          }}
                        />
                      </View>

                      <View
                        style={{
                          // padding: '3%',
                          // marginLeft: '3%',
                          flexDirection: 'row',
                          marginTop: '5%',
                          alignSelf: 'center',
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
                          {item.vehicle.name}
                        </Text>
                      </View>
                      {/* <View
                        style={{
                          // padding: '3%',
                          marginLeft: '3%',
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: '3%',
                        }}>
                        <FontAwesome
                          name="phone-square"
                          size={20}
                          color={colors.themecolor}
                        />
                        <Text
                          style={{
                            marginLeft: '6%',
                            color: colors.black,
                            fontSize: 15,
                            fontWeight: 'bold',
                          }}>
                          {item.vehicle.number}
                        </Text>
                      </View> */}
                      {/* <View
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
                            fontSize: 15,
                            fontWeight: 'bold',
                          }}>
                          Vehicle Name :-
                        </Text>
                        <Text
                          style={{
                            marginLeft: '3%',
                            color: colors.black,
                            fontSize: 15,
                            fontWeight: 'bold',
                          }}>
                          {item.vehicle.name}
                        </Text>
                      </View> */}
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
                            fontSize: 15,
                            fontWeight: 'bold',
                          }}>
                          Starting KM :-
                        </Text>
                        <Text
                          style={{
                            marginLeft: '3%',
                            color: colors.black,
                            fontSize: 15,
                            fontWeight: 'bold',
                          }}>
                          {item.vehicle.starting_km}
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
                            fontSize: 15,
                            fontWeight: 'bold',
                          }}>
                          Ending KM :-
                        </Text>
                        <Text
                          style={{
                            marginLeft: '3%',
                            color: colors.black,
                            fontSize: 15,
                            fontWeight: 'bold',
                          }}>
                          {item.ending_km}
                        </Text>
                      </View>
                      <View
                        style={{
                          marginLeft: '5%',
                          marginTop: 15,
                        }}>
                        <Text
                          style={{
                            color: colors.themecolor,
                            fontSize: 16,
                            fontWeight: 'bold',
                          }}>
                          Ending Km photo :-
                        </Text>
                      </View>
                      <View style={{marginTop: '5%', alignSelf: 'center'}}>
                        <Image
                          source={{uri: item.km_photo_fullpath}}
                          resizeMode="stretch"
                          style={{
                            width: metrics.WIDTH * 0.4,
                            height: metrics.HEIGHT * 0.2,
                            borderRadius: 5,
                          }}
                        />
                      </View>
                    </View>
                  );
                })
              : null}
          </View>
        </ScrollView>
      )}
      {/* <RNModal
        // animationType="slide"
        transparent={true}
        isVisible={isModalVisible}
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}>
        <View
          style={{
            // marginHorizontal: "5%",
            backgroundColor: colors.white,
            borderRadius: 5,
            paddingBottom: '5%',
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
                More Details
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
            style={{marginBottom: '18%'}}></ScrollView>
        </View>
      </RNModal> */}
    </View>
  );
};

export default Vehiclehistory;
