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
} from 'react-native';
import colors from '../../Utils/colors';
import metrics from '../../Utils/Metrics';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import HeaderComponent from '../components/HeaderComponent';
import axios from 'axios';
import {BASE_URL, ACCEPT_HEADER} from '../../Utils/baseurl';
import Toast from 'react-native-simple-toast';

const Employee = props => {
  const [load, setload] = useState(false);
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      Userapicall();
    });
    return unsubscribe;
  }, [props]);
  const [getuser, setuserdata] = useState([]);
  const [isername, setuser] = useState();
  const [iserid, setuseid] = useState();

  const Userapicall = async () => {
    setload(true);
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
        setBranchArray(res.data.data);
        setload(false);
      })
      .catch(err => console.log(JSON.stringify(err, null, 2)));
  };

  const [task_arrayholder, setBranchArray] = useState([]);

  const searchFilter = (text, id) => {
    const newData = task_arrayholder.filter(function (item) {
      const employee = item.name ? item.name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return employee.indexOf(textData) > -1;
    });
    setuserdata(newData);
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
      <HeaderComponent
        navigation={props.navigation}
        title="Employee"
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
            <RefreshControl refreshing={load} onRefresh={Userapicall} />
          }>
          <FlatList
            data={getuser}
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
                    <Entypo name="user" size={20} color={colors.themecolor} />
                    <Text
                      style={{
                        marginLeft: '2%',
                        color: colors.black,
                        fontSize: 15,
                        fontWeight: 'bold',
                      }}>
                      {item.name}
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate('Employeeview', {
                          id: item.id,
                        });
                      }}
                      style={{position: 'absolute', right: 10}}>
                      <Entypo name="eye" size={25} color={colors.themecolor} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </ScrollView>
      </View>
    </View>
  );
};

export default Employee;
