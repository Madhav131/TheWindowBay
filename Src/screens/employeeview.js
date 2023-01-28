import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ScrollView,
  AsyncStorage,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import colors from '../../Utils/colors';
import metrics from '../../Utils/Metrics';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import HeaderComponent from '../components/HeaderComponent';
import axios from 'axios';
import {BASE_URL, ACCEPT_HEADER} from '../../Utils/baseurl';
import Toast from 'react-native-simple-toast';

const Employeeview = props => {
  const [load, setload] = useState(false);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      Employeeapi();
    });
    return unsubscribe;
  }, [props]);

  const [ids, setid] = useState(props.route.params.id);
  const [getdata, setdata] = useState([]);
  const Employeeapi = async () => {
    setload(true);
    var Token = await AsyncStorage.getItem('token');
    const formdata = new FormData();
    formdata.append('id', ids);
    console.log('formdata --->', formdata);
    axios
      .post(BASE_URL + 'get-employee', formdata, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        console.log(res.data);
        setdata(res.data.data);
        setBranchArray(res.data.data);
        setload(false);
      });
  };

  const [task_arrayholder, setBranchArray] = useState([]);

  const searchFilter = (text, id) => {
    const newData = task_arrayholder.filter(function (item) {
      const employee = item.user.name
        ? item.user.name.toUpperCase()
        : ''.toUpperCase();
      const textData = text.toUpperCase();
      return employee.indexOf(textData) > -1;
    });
    setdata(newData);
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
      <View
        style={{
          padding: '5%',
          backgroundColor: colors.white,
          elevation: 5,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <TouchableOpacity onPress={() => props.navigation.goBack(null)}>
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
          Employee View
        </Text>
      </View>
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
      {load == true ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: '10%',
          }}>
          <ActivityIndicator size={30} color={colors.themecolor} />
        </View>
      ) : (
        <View style={{flex: 1}}>
          {getdata == 0 ? (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '20%',
              }}>
              <Text
                style={{color: colors.black, fontSize: 16, fontWeight: 'bold'}}>
                No Data Found...!
              </Text>
            </View>
          ) : (
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={load} onRefresh={Employeeapi} />
              }>
              <FlatList
                data={getdata}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity
                      onPress={() => {}}
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
                        />
                        <Text
                          style={{
                            marginLeft: '2%',
                            color: colors.black,
                            fontSize: 15,
                            fontWeight: 'bold',
                          }}>
                          {item.user.name}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
              />
            </ScrollView>
          )}
        </View>
      )}
    </View>
  );
};

export default Employeeview;
