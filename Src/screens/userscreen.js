import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  AsyncStorage,
  ActivityIndicator,
  RefreshControl,
  Modal,
  TextInput,
} from 'react-native';
import colors from '../../Utils/colors';
import metrics from '../../Utils/Metrics';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import HeaderComponent from '../components/HeaderComponent';
import axios from 'axios';
import {BASE_URL, ACCEPT_HEADER} from '../../Utils/baseurl';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ScrollView} from 'react-native-gesture-handler';
import Toast from 'react-native-simple-toast';
import {Picker} from '@react-native-picker/picker';
import RNModal from 'react-native-modal';
import CheckBox from '@react-native-community/checkbox';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const data = [
  {
    id: 1,
    title: 'Admin',
    role: 2,
  },
  {
    id: 2,
    title: 'Employee',
    role: 3,
  },
  {
    id: 3,
    title: 'Worker',
    role: 4,
  },
];

const Userscreen = props => {
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      Userapicall();
    });
    return unsubscribe;
  });
  const [rolemodel, setrolemodel] = useState(false);
  const [getupdateid, setupdateid] = useState('');
  const [getname, setname] = useState('');
  const [getnumber, setnumber] = useState('');
  const [getemail, setemail] = useState('');
  const [getpassword, setpassword] = useState('');
  const [isloading, setisloading] = useState(false);
  const [selectuserid, Setselectuserid] = useState('');
  const [getdata, setdata] = useState([]);
  const [userloading, setuserloading] = useState(false);
  const [isUserModel, setIsUserModel] = useState('');
  const busref = useRef();
  const busref1 = useRef();
  const busref2 = useRef();
  const [condition, setcondition] = useState(false);
  const [getroleid, setroleid] = useState();
  const [getrolename, setrolename] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState(false);
  const [getindex, setindex] = useState();
  const [getcheck, setcheck] = useState([]);
  const [newArray, setArray] = useState([]);
  const [getlist, setlist] = useState([]);
  const [id, setid] = useState();
  const [getstatus, setstatus] = useState();
  const [getwage, setwage] = useState('');

  const check = (item, index, value) => {
    console.log('item-----', getindex);
    setindex(1);
    if (value) getcheck[2] = value;
    else getcheck[1] = !getcheck[2];

    // setlist(getindex);

    if (getcheck[1]) setArray([...newArray, item]);
    else
      setArray(
        newArray.filter(function (i) {
          return i.id !== item.id;
        }),
      );

    if (setcheck[item] == true) {
      // console.log('name', item.provider.name);
      setlist.push(getindex);

      setlist(getindex);
    } else {
      var temp = getcheck.filter((x, i) => x !== getindex);
      setlist(temp);
      console.log('temp----', temp);
    }

    console.log('-=================new array ', newArray);
  };

  const UpdateUserApi = async () => {
    if (getname == '' || getname == null) {
      Toast.show('Please Enter a name');
    } else if (getnumber == '' || getnumber == null) {
      Toast.show('Please Enter a number');
    } else {
      var Userid = await AsyncStorage.getItem('user_id');
      console.log('userid', Userid);
      setisloading(true);
      var Token = await AsyncStorage.getItem('token');
      const formdata = new FormData();
      formdata.append('id', getupdateid);
      formdata.append('name', getname);
      formdata.append('email', getemail);
      formdata.append('number', getnumber);
      formdata.append('password', getpassword);
      // if (condition == true) {
      //   formdata.append('role', getroleid);
      // } else {
      formdata.append('role', selectuserid);
      // }
      formdata.append('wage', getwage);

      console.log('formdata==>', formdata);
      axios
        .post(
          'https://theapplified.com/thewindowbay/api/v1/update-user',
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
          if (res.data.success == 1) {
            Toast.show(res.data.message);
            Userapicall();
            setIsUserModel(false);
            if (condition == true) {
              setcondition(false);
            }
            // props.navigation.goBack();
          } else {
            setisloading(false);
            Toast.show(res.data.message);
          }
          console.log('Vehicle Data===>', res.data);
        })
        .catch(err => {
          setisloading(false);
          console.log(err);
        });
    }
  };

  const Userapicall = async () => {
    setuserloading(true);
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
        setdata(res.data.data);
        setBranchArray(res.data.data);
        setuserloading(false);
      })
      .catch(err => console.log(JSON.stringify(err, null, 2)));
  };

  const Userstatus = async id => {
    var Token = await AsyncStorage.getItem('token');
    const formdata = new FormData();
    formdata.append('id', id);
    formdata.append('status', 1);
    console.log('formdata--->', formdata);
    axios
      .post(BASE_URL + 'user-status', formdata, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        console.log('resrequire--->', res.data);
        if (res.data.success === 1) {
          Toast.show(res.data.message);
          Userapicall();
        }
      })
      .catch(err => console.log(JSON.stringify(err, null, 2)));
  };
  const Userstatus1 = async id => {
    var Token = await AsyncStorage.getItem('token');
    const formdata = new FormData();
    formdata.append('id', id);
    formdata.append('status', 0);
    console.log('formdata--->', formdata);
    axios
      .post(BASE_URL + 'user-status', formdata, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        console.log('resrequire--->', res.data);
        if (res.data.success === 1) {
          Toast.show(res.data.message);
          Userapicall();
        }
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
    setdata(newData);
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
      <HeaderComponent
        navigation={props.navigation}
        title="User"
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
      {userloading === true ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator size={50} color={colors.themecolor} />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={userloading} onRefresh={Userapicall} />
          }>
          <View style={{flex: 1, marginTop: metrics.HEIGHT * 0.02}}>
            {/* <FlatList
          data={getdata}
          renderItem={({item, index}) => { */}
            {getdata && getdata.length > 0
              ? getdata.map((item, index) => {
                  return (
                    <TouchableOpacity
                      key={item.id}
                      onPress={() => {
                        check(item, index);
                        setupdateid(item.id);
                        setname(item.name);
                        setemail(item.email);
                        setnumber(item.number);
                        setpassword(item.show_password);
                        Setselectuserid(item.role);
                        console.log('roleeeee', item.role);
                        setwage(item.wage);
                        setIsUserModel(true);
                      }}
                      style={{
                        // elevation: 3,
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
                          {item.name}
                        </Text>
                        {/* <TouchableOpacity
                          style={{position: 'absolute', right: 15}}>
                          <AntDesign name="delete" size={25} color="red" />
                        </TouchableOpacity> */}
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: '3%',
                          marginTop: '3%',
                        }}>
                        <FontAwesome
                          name="phone-square"
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
                          {item.number}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: '3%',
                          marginTop: '3%',
                        }}>
                        <MaterialCommunityIcons
                          name="email"
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
                          {item.email}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginLeft: '3%',
                          marginTop: '3%',
                        }}>
                        <Text
                          style={{
                            color: colors.themecolor,
                            fontWeight: 'bold',
                            fontSize: 16,
                          }}>
                          Role :
                        </Text>
                        <Text
                          style={{
                            marginLeft: '2%',
                            color: colors.black,
                            fontSize: 15,
                            fontWeight: 'bold',
                          }}>
                          {item.role == 2
                            ? 'Admin'
                            : item.role == 3
                            ? 'Employee'
                            : item.role == 4
                            ? 'Worker'
                            : null}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          marginTop: '5%',
                          marginLeft: '5%',
                        }}>
                        <Text
                          style={{
                            color: Colors.black,
                            fontWeight: 'bold',
                            fontSize: 16,
                          }}>
                          Status :
                        </Text>
                        {item.status == 1 ? (
                          <TouchableOpacity
                            onPress={() => Userstatus1(item.id)}>
                            <MaterialIcons
                              name="check-box"
                              size={25}
                              color={colors.themecolor}
                            />
                          </TouchableOpacity>
                        ) : item.status == 0 ? (
                          <TouchableOpacity onPress={() => Userstatus(item.id)}>
                            <MaterialIcons
                              name="check-box-outline-blank"
                              size={25}
                              color={colors.themecolor}
                            />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  );
                })
              : null}
          </View>
        </ScrollView>
      )}
      <TouchableOpacity
        onPress={() => {
          props.navigation.navigate('Adduser');
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
          Add User
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isUserModel}
        onRequestClose={() => {
          setIsUserModel(false);
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
            <TouchableOpacity onPress={() => setIsUserModel(false)}>
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
              Edit User
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginHorizontal: '5%',
              justifyContent: 'space-between',
              marginTop: '5%',
              flex: 1,
            }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View
                style={{
                  marginTop: '5%',
                  paddingBottom: '5%',
                  marginLeft: '5%',
                }}>
                <Text style={{color: colors.black, fontSize: 16}}>Name :</Text>
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
                    value={getname}
                    placeholder="Enter a Name..."
                    onChangeText={text => setname(text)}
                    placeholderTextColor={colors.gray}
                    onSubmitEditing={() => {
                      busref.current.focus();
                    }}
                    blurOnSubmit={false}
                  />
                </View>
                <View style={{marginTop: '5%', paddingBottom: '5%'}}>
                  <Text style={{color: colors.black, fontSize: 16}}>
                    Email :
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
                      keyboardType="email-address"
                      returnKeyType="next"
                      ref={busref}
                      value={getemail}
                      placeholder="Enter a Email..."
                      onChangeText={text => setemail(text)}
                      placeholderTextColor={colors.gray}
                      onSubmitEditing={() => {
                        busref1.current.focus();
                      }}
                      blurOnSubmit={false}
                    />
                  </View>
                </View>
                <View style={{marginTop: '5%', paddingBottom: '5%'}}>
                  <Text style={{color: colors.black, fontSize: 16}}>
                    Number :
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
                      keyboardType="phone-pad"
                      returnKeyType="next"
                      ref={busref1}
                      value={getnumber}
                      placeholder="Enter a Number..."
                      maxLength={10}
                      onChangeText={text => setnumber(text)}
                      onSubmitEditing={() => {
                        busref2.current.focus();
                      }}
                      placeholderTextColor={colors.gray}
                      blurOnSubmit={false}
                    />
                  </View>
                </View>
                <View style={{marginTop: '5%', paddingBottom: '5%'}}>
                  <Text style={{color: colors.black, fontSize: 16}}>
                    Password :
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
                      ref={busref2}
                      value={getpassword}
                      placeholder="Enter a Password..."
                      onChangeText={text => setpassword(text)}
                      placeholderTextColor={colors.gray}
                      blurOnSubmit={false}
                    />
                  </View>
                  <View style={{marginTop: '5%', paddingBottom: '5%'}}>
                    {/* <Text style={{color: colors.black, fontSize: 16}}>
                      Role :
                    </Text>
                    <TouchableOpacity
                      onPress={() => {
                        setrolemodel(true);
                      }}
                      style={{
                        width: '90%',
                        backgroundColor: colors.white,
                        marginTop: '5%',
                        elevation: 5,
                        borderRadius: 5,
                        width: '90%',
                        backgroundColor: colors.white,
                        height: metrics.HEIGHT * 0.06,
                        justifyContent: 'center',
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
                            {getrolename}
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
                            {selectuserid == 2
                              ? 'Admin'
                              : selectuserid == 3
                              ? 'Employee'
                              : selectuserid == 4
                              ? 'Worker'
                              : null}
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
                      <Text style={{color: colors.black, fontSize: 16}}>
                        Role :
                      </Text>
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
                          {data.map((item, index) => {
                            return (
                              <Picker.Item
                                label={item.title}
                                value={item.role}
                              />
                            );
                          })}
                        </Picker>
                      </View>
                    </View>
                    {selectuserid == 4 || selectuserid == 3 ? (
                      <View style={{marginTop: '5%', paddingBottom: '5%'}}>
                        <Text style={{color: colors.black, fontSize: 16}}>
                          Wage :
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
                            keyboardType="number-pad"
                            value={getwage}
                            returnKeyType="next"
                            placeholder="Enter a wage..."
                            onChangeText={text => setwage(text)}
                            placeholderTextColor={colors.gray}
                            maxLength={10}
                            blurOnSubmit={false}
                          />
                        </View>
                      </View>
                    ) : null}
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => {
                    UpdateUserApi();
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
      {/* <RNModal
        // animationType="slide"
        transparent={true}
        isVisible={rolemodel}
        onBackButtonPress={() => setrolemodel(false)}
        onBackdropPress={() => setrolemodel(false)}>
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
            data={data}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setrolename(item.title);
                    setroleid(item.role);
                    setrolemodel(false);
                    setcondition(true);
                  }}
                  style={{padding: '3%'}}>
                  <Text style={{color: colors.black, fontSize: 15}}>
                    {item.title}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </RNModal> */}
    </View>
  );
};

export default Userscreen;
