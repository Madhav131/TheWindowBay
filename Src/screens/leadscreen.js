import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  AsyncStorage,
  ScrollView,
  Modal,
  ActivityIndicator,
  FlatList,
  ImageBackground,
  TextInput,
  KeyboardAvoidingView,
  RefreshControl,
  Platform,
  StyleSheet,
  PermissionsAndroid,
} from 'react-native';
import colors from '../../Utils/colors';
import metrics from '../../Utils/Metrics';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';
import HeaderComponent from '../components/HeaderComponent';
import axios from 'axios';
import {BASE_URL, ACCEPT_HEADER} from '../../Utils/baseurl';
import Toast from 'react-native-simple-toast';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {useLoginContext} from './context/login_context';
import {Picker} from '@react-native-picker/picker';

const status = [
  {
    id: 0,
    title: 'Pending',
  },
  {
    id: 1,
    title: 'On hold',
  },
  {
    id: 2,
    title: 'Completed',
  },
  {
    id: 3,
    title: 'Not Interested',
  },
  {
    id: 4,
    title: 'In process',
  },
];

const Lead = props => {
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      Leadapi();
    });
    return unsubscribe;
  });
  const busref = useRef();
  const busref1 = useRef();
  const busref2 = useRef();
  const [getname, setname] = useState('');
  const [getnumber, setnumber] = useState('');
  const [getemail, setemail] = useState('');
  const [getNarration, setNarration] = useState('');
  const [isloading, setisloading] = useState(false);
  const [getdata, setdata] = useState([]);
  const [get_array, set_array] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isModalVisible1, setModalVisible1] = useState('');
  const [current_index, setIndex] = useState('');
  var [getarray, setArray] = useState([]);
  const [getstatusid, setstatusid] = useState('');
  const [getid, set_id] = useState();
  const {role} = useLoginContext();

  const [leadloading, setisleadloading] = useState(false);
  const Leadapi = async () => {
    setisleadloading(true);
    var Token = await AsyncStorage.getItem('token');
    axios
      .get(BASE_URL + 'lead', {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        console.log('lead data ====>', res.data.data);
        setdata(res.data.data);
        setBranchArray(res.data.data);
        setisleadloading(false);
      })
      .catch(err => console.log(JSON.stringify(err, null, 2)));
  };

  const Updateleadapi = async () => {
    // const re =
    //   /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (getname == '' || getname == null) {
      Toast.show('Please Enter Name');
      // } else if (getnumber == '' || getnumber == null) {
      //   Toast.show('Please Enter 10 Digits Number');
      // } else if (re.test(String(getemail).toLowerCase()) == false) {
      //   Toast.show('Please Enter Valid E-Mail Id');
    } else {
      setisloading(true);
      var Token = await AsyncStorage.getItem('token');
      const formdata = new FormData();
      formdata.append('id', getid);
      if (role === '1' || role === 1 || role === '2' || role === 2) {
        formdata.append('employee_id', selectuserid);
      }
      formdata.append('name', getname);
      formdata.append('number', getnumber);
      formdata.append('email', getemail);
      formdata.append('narration', getNarration);
      formdata.append('reminderdate', getDate);
      formdata.append('remindertime', getTo);
      formdata.append('location', getlocations);

      formdata.append('images', '');
      console.log('formdata==>', formdata);
      axios
        .post(BASE_URL + 'update-lead', formdata, {
          headers: {
            Accept: ACCEPT_HEADER,
            Authorization: 'Bearer ' + Token,
          },
        })
        .then(res => {
          setisloading(false);
          if (res.data.success === 1) {
            Toast.show(res.data.message);
            setModalVisible(false);
            Leadapi();
          }
          console.log('leadpostdata ===>', res.data);
        })
        .catch(err => console.log(JSON.stringify(err, null, 2)));
    }
  };

  const delete_image = async id => {
    var Token = await AsyncStorage.getItem('token');
    const formdata = new FormData();
    formdata.append('id', id);
    axios
      .post(BASE_URL + 'delete-image', formdata, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        console.log('image---dalete-->>', res.data);
        Toast.show(res.data.message);
        Leadapi();
        setModalVisible(false);
      })
      .catch(err => console.log(JSON.stringify(err, null, 2)));
  };

  const toggleModal = () => {
    setModalVisible1(!isModalVisible1);
  };

  const change = async (index, item) => {
    const temp = await getarray;
    temp[current_index] = await item;
    setArray(temp);
    // setRefresh(!isRefresh);
  };

  const Statusupdateapi = async id => {
    var Token = await AsyncStorage.getItem('token');
    const formdata = new FormData();
    formdata.append('id', getid);
    formdata.append('status', id);
    console.log('formdata', formdata);
    axios
      .post(BASE_URL + 'update-status', formdata, {
        headers: {
          Accept: ACCEPT_HEADER,
          Authorization: 'Bearer ' + Token,
        },
      })
      .then(res => {
        console.log('status-->>', res.data);
        if (res.data.success === 1) Toast.show(res.data.message);
        setModalVisible1(false);
        Leadapi();
      })
      .catch(err => console.log(JSON.stringify(err, null, 2)));
  };

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const [getDate, setDate] = useState(moment(Date()).format('DD/MM/YYYY'));
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setDate(moment(date).format('YYYY-MM-DD'));
    hideDatePicker();
  };

  const [isDatePickerVisible1, setDatePickerVisibility1] = useState(false);
  const [getTo, setTo] = useState('hh/mm');
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

  const [task_arrayholder, setBranchArray] = useState([]);
  const [getlocations, setlocations] = useState('');

  const searchFilter = (text, id) => {
    const newData = task_arrayholder.filter(function (item) {
      const employee = item.name ? item.name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return employee.indexOf(textData) > -1;
    });
    setdata(newData);
  };
  const [selectuserid, Setselectuserid] = useState();

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      Userapi();
    });
    return unsubscribe;
  });
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
      .catch(err => console.log(JSON.stringify(err, null, 2)));
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
      <HeaderComponent
        navigation={props.navigation}
        title="Lead"
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
      {leadloading === true ? (
        <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
          <ActivityIndicator size={50} color={colors.themecolor} />
        </View>
      ) : (
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={leadloading} onRefresh={Leadapi} />
          }>
          {getdata && getdata.length > 0
            ? getdata.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(true);
                      set_array([item]);
                      setname(item.name);
                      setnumber(item.number);
                      setemail(item.email);
                      setNarration(item.narration);
                      setDate(item.reminderdate);
                      setTo(item.remindertime);
                      set_id(item.id);
                      setlocations(item.location);
                      Setselectuserid(item.employee_id);
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
                        // padding: '3%',
                        marginLeft: '3%',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Entypo name="user" size={20} color={colors.themecolor} />
                      <Text
                        style={{
                          marginLeft: '5%',
                          color: colors.black,
                          fontSize: 15,
                          fontWeight: 'bold',
                        }}>
                        {item.name}
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
                        {item.reminderdate == null
                          ? 'Enter Reminder Date'
                          : moment(item.reminderdate).format('DD-MM-YYYY')}
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
                        {item.remindertime == null
                          ? 'Enter Reminder Time'
                          : item.remindertime}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginLeft: '3%',
                        marginTop: '3%',
                      }}>
                      <Ionicons
                        name="stats-chart"
                        size={20}
                        color={colors.themecolor}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          {
                            item.status == 2
                              ? Toast.show('Status is already completed.')
                              : setIndex(index);
                          }
                          item.status == 2
                            ? null
                            : setModalVisible1(!isModalVisible1);
                          setIndex(index);
                          set_id(item.id);
                        }}
                        // style={[
                        //   styles.colorpending,
                        //   {
                        //     marginLeft: '5%',
                        //     // backgroundColor: colors.themecolor,
                        //     padding: '1%',
                        //     borderRadius: 3,
                        //   },
                        // ]}
                        style={[
                          item.status == 0
                            ? {backgroundColor: '#f5edd7'}
                            : item.status == 1
                            ? {backgroundColor: '#ebc7c9'}
                            : item.status == 2
                            ? {backgroundColor: '#c7ebd2'}
                            : item.status == 3
                            ? {backgroundColor: '#CDE2FC'}
                            : item.status == 4
                            ? {backgroundColor: '#c1edf5'}
                            : null,
                          {
                            marginLeft: '5%',
                            padding: '1%',
                            borderRadius: 3,
                          },
                        ]}>
                        <Text
                          style={[
                            item.status == 0
                              ? {color: '#edb00c'}
                              : item.status == 1
                              ? {color: '#f20714'}
                              : item.status == 2
                              ? {color: '#43BF57'}
                              : item.status == 3
                              ? {color: '#1445b8'}
                              : item.status == 4
                              ? {color: '#06687a'}
                              : null,
                            {
                              marginLeft: '2%',
                              fontWeight: 'bold',
                              fontSize: 15,
                            },
                          ]}>
                          {item.status == 0
                            ? 'Pending'
                            : item.status == 1
                            ? 'On hold'
                            : item.status == 2
                            ? 'Completed'
                            : item.status == 3
                            ? 'Not Interested'
                            : item.status == 4
                            ? 'In Process'
                            : null}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })
            : null}
        </ScrollView>
      )}
      <TouchableOpacity
        onPress={() => props.navigation.navigate('Addlead')}
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
          Add Lead
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
                Update Lead Here
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
          {leadloading === true ? (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <ActivityIndicator size={25} color={colors.themecolor} />
            </View>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{flexGrow: 1}}
              style={{marginBottom: '18%'}}>
              {get_array && get_array.length > 0
                ? get_array.map((item, index) => {
                    return (
                      <View>
                        <FlatList
                          data={item.image}
                          horizontal={true}
                          style={{marginTop: '5%'}}
                          renderItem={({item, index}) => {
                            return (
                              <View
                                style={{
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                  borderColor: colors.themecolor,
                                  borderWidth: 2,
                                  width: 100,
                                  backgroundColor: colors.white,
                                  height: 130,
                                  marginLeft: 10,
                                  alignSelf: 'center',
                                }}>
                                <ImageBackground
                                  source={{uri: item.image_path}}
                                  style={{
                                    width: 90,
                                    height: 90,
                                    alignSelf: 'center',
                                  }}></ImageBackground>
                                <TouchableOpacity
                                  onPress={() => delete_image(item.id)}
                                  style={{
                                    backgroundColor: colors.themecolor,
                                    width: 90,
                                    marginTop: '5%',
                                    elevation: 3,
                                  }}>
                                  <Text
                                    style={{
                                      color: colors.white,
                                      textAlign: 'center',
                                    }}>
                                    delete
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            );
                          }}
                        />
                        {/* <KeyboardAvoidingView
                          style={{flexGrow: 1, paddingBottom: '20%'}}
                          behavior={'height'}
                          keyboardVerticalOffset={
                            Platform.OS === 'ios' ? 40 : 0
                          }> */}
                        {role === '1' ||
                        role === 1 ||
                        role === '2' ||
                        role === 2 ? (
                          <>
                            <Text
                              style={{
                                color: colors.black,
                                fontSize: 16,
                                marginHorizontal: '5%',
                              }}>
                              User Name :
                            </Text>
                            <View
                              style={{
                                width: '85%',
                                backgroundColor: colors.white,
                                marginTop: '5%',
                                elevation: 5,
                                borderRadius: 5,
                                marginHorizontal: '5%',
                              }}>
                              <Picker
                                selectedValue={selectuserid}
                                dropdownIconColor={colors.themecolor}
                                itemStyle={{height: 50}}
                                style={{
                                  color: colors.black,
                                  fontWeight: 'bold',
                                }}
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
                          </>
                        ) : null}
                        <View
                          style={{
                            marginTop: '5%',
                            marginLeft: '5%',
                            paddingBottom: '5%',
                          }}>
                          <Text style={{color: colors.black, fontSize: 16}}>
                            Name :
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
                              value={getname}
                              keyboardType="default"
                              returnKeyType="next"
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
                                value={
                                  getnumber == 'undefined' ? '' : getnumber
                                }
                                keyboardType="number-pad"
                                returnKeyType="next"
                                placeholder="Enter a Number..."
                                onChangeText={text => setnumber(text)}
                                placeholderTextColor={colors.gray}
                                maxLength={10}
                                ref={busref}
                                onSubmitEditing={() => {
                                  busref1.current.focus();
                                }}
                                blurOnSubmit={false}
                              />
                            </View>
                          </View>
                          <View style={{paddingBottom: '5%'}}>
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
                                value={getemail == 'undefined' ? '' : getemail}
                                keyboardType="email-address"
                                returnKeyType="next"
                                placeholder="Enter a Email..."
                                onChangeText={text => setemail(text)}
                                placeholderTextColor={colors.gray}
                                ref={busref1}
                                onSubmitEditing={() => {
                                  busref2.current.focus();
                                }}
                                blurOnSubmit={false}
                              />
                            </View>
                          </View>
                          <View style={{paddingBottom: '5%'}}>
                            <Text style={{color: colors.black, fontSize: 16}}>
                              Narration :
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
                                value={
                                  getNarration == 'undefined'
                                    ? ''
                                    : getNarration
                                }
                                keyboardType="default"
                                returnKeyType="next"
                                placeholder="Enter a Narration..."
                                onChangeText={text => setNarration(text)}
                                placeholderTextColor={colors.gray}
                                ref={busref2}
                                // onSubmitEditing={() => {
                                //   busref1.current.focus();
                                // }}
                                blurOnSubmit={false}
                              />
                            </View>
                            <View
                              style={{marginTop: '5%', paddingBottom: '5%'}}>
                              <Text
                                style={{
                                  color: colors.black,
                                  fontSize: 16,
                                }}>
                                Reminder Date :
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
                                      {getDate === null
                                        ? 'dd/mm/yyyy'
                                        : getDate}
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
                            <View
                              style={{marginTop: '5%', paddingBottom: '5%'}}>
                              <Text
                                style={{
                                  color: colors.black,
                                  fontSize: 16,
                                }}>
                                Reminder Time :
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
                                      {getTo === null ? 'hh/mm/ss' : getTo}
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
                            <View
                              style={{paddingBottom: '5%', marginTop: '5%'}}>
                              <Text style={{color: colors.black, fontSize: 16}}>
                                Location :
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
                                  value={getlocations}
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
                          </View>
                        </View>
                        {/* </KeyboardAvoidingView> */}
                      </View>
                    );
                  })
                : null}
            </ScrollView>
          )}
          <TouchableOpacity
            onPress={() => {
              Updateleadapi();
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible1}
        onRequestClose={() => setModalVisible1(false)}>
        <View
          style={{
            // marginHorizontal: "5%",
            // alignSelf: "center",
            backgroundColor: colors.white,
            alignItems: 'center',
            borderRadius: 5,
            paddingBottom: '50%',
            // flex: 1,
            elevation: 3,
          }}>
          <View
            style={{
              marginTop: Platform.OS === 'ios' ? '10%' : '5%',
              width: metrics.WIDTH * 0.95,
              alignItems: 'flex-end',
            }}>
            <Ionicons
              name="close-circle-sharp"
              size={30}
              color={colors.themecolor}
              style={{}}
              onPress={() => setModalVisible1(false)}
            />
          </View>
          <View
            style={{
              marginTop: '20%',
              width: metrics.WIDTH * 0.5,
              marginHorizontal: '5%',
              backgroundColor: colors.white,
            }}>
            <FlatList
              data={status}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setstatusid(item.id);
                      change(index, item);
                      Statusupdateapi(item.id);
                      // setsize(item.title);
                      toggleModal();
                    }}>
                    <View
                      style={{
                        marginTop: '5%',
                        alignSelf: 'center',
                        alignItems: 'center',
                        marginBottom: '5%',
                        backgroundColor: colors.white,
                      }}>
                      <Text
                        style={{
                          color: colors.themecolor,
                          fontWeight: '500',
                          fontSize: 20,
                        }}>
                        {item.title}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Lead;

const styles = StyleSheet.create({
  colorpending: {
    backgroundColor: 'orange',
  },
});
