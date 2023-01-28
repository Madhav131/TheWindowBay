import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  AsyncStorage,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import colors from '../../Utils/colors';
import metrics from '../../Utils/Metrics';
import Entypo from 'react-native-vector-icons/Entypo';
import {useLoginContext} from '../../Src/screens/context/login_context';
import Toast from 'react-native-simple-toast';
import RNModal from 'react-native-modal';
import messaging from '@react-native-firebase/messaging';

const Login = props => {
  const {login_loading} = useLoginContext();
  const {Loginapi} = useLoginContext();
  const [visible, setvisible] = useState(false);
  const busref = useRef();
  const [getemail, setemail] = useState('');
  const [Password, setpassword] = useState('');
  const [getlogout, ismodellogout] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('islogin').then(Value => {
      const logi = Value;
      // console.log('logi', logi);
      if (logi === 'yes') {
        props.navigation.navigate('Home');
      } else {
        props.navigation.navigate('Login');
      }
    });
  });

  const [fcmToken, setFCMToken] = useState('');

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    console.log('Authorization enabled:', enabled);

    if (enabled == 1 || enabled == 2) {
      getFcmToken();
    } else {
      requestUserPermission();
    }
  };

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();

    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  };

  const getFcmToken = async () => {
    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      console.log('----fcm token', fcmToken);
      setFCMToken(fcmToken);
    } else {
      console.log('Failed', 'No token received');
    }
  };

  // useEffect(() => {
  //   NetInfo.fetch().then(state => {
  //     // console.log('Connection type', state.type);
  //     // console.log('Is connected?', state.isConnected);
  //   });
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     if (state.isConnected == false) {
  //       ismodellogout(true);
  //     }
  //     if (state.isConnected == true) {
  //       ismodellogout(false);
  //     }
  //     // console.log('Connection type', state.type);
  //     // console.log('Is connected?', state.isConnected);
  //   });

  //   return unsubscribe;
  // });

  const Apilogin = async () => {
    if (getemail == '' || getemail == null) {
      Toast.show('Please enter your email');
      return;
    } else if (Password == '' || Password == null) {
      Toast.show('Please enter your password');
      return;
    }
    const param = {email: getemail, password: Password};
    Loginapi(param, props, true);
  };

  return (
    <View style={{flex: 1, backgroundColor: 'whitesmoke'}}>
      <StatusBar barStyle="light-content" backgroundColor={colors.gray} />
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}>
        <ScrollView contentContainerStyle={{paddingBottom: '10%'}}>
          <View
            style={{
              height: metrics.HEIGHT * 0.2,
              marginTop: '25%',
              justifyContent: 'center',
              flexDirection: 'row',
            }}>
            <Image
              source={require('../assets/twb.png')}
              style={{
                height: metrics.HEIGHT * 0.2,
                width: metrics.WIDTH * 0.5,
                marginLeft: '1%',
                justifyContent: 'center',
                alignSelf: 'center',
              }}
              resizeMode="stretch"
            />
          </View>
          <View style={{justifyContent: 'center'}}>
            <Text
              style={{
                fontSize: 22,
                color: colors.black,
                fontWeight: 'bold',
                textAlign: 'center',
                marginTop: '10%',
              }}>
              {/* The Window Bay */}
            </Text>
          </View>
          <View
            style={{
              width: '80%',
              marginHorizontal: '10%',
              marginTop: '10%',
              backgroundColor: colors.white,
              borderRadius: 10,
              elevation: 10,
              flexDirection: 'row',
              height: Platform.OS === 'ios' ? metrics.HEIGHT * 0.06 : 53,
            }}>
            <View style={{width: '90%', justifyContent: 'center'}}>
              <TextInput
                style={{
                  color: colors.black,
                  fontSize: 16,
                  fontWeight: '600',
                  marginLeft: '5%',
                }}
                keyboardType="email-address"
                returnKeyType="next"
                onChangeText={text => setemail(text)}
                placeholder="Email"
                placeholderTextColor={colors.gray}
                onSubmitEditing={() => {
                  busref.current.focus();
                }}
                blurOnSubmit={false}
              />
            </View>
          </View>
          <View
            style={{
              width: '80%',
              marginHorizontal: '10%',
              marginTop: '5%',
              backgroundColor: colors.white,
              borderRadius: 10,
              elevation: 10,
              flexDirection: 'row',
              height: Platform.OS === 'ios' ? metrics.HEIGHT * 0.06 : 53,
            }}>
            <View style={{width: '80%', justifyContent: 'center'}}>
              <TextInput
                style={{
                  color: colors.black,
                  fontSize: 16,
                  fontWeight: '600',
                  marginLeft: '5%',
                }}
                secureTextEntry={visible == true ? true : false}
                placeholder="Password"
                placeholderTextColor={colors.gray}
                keyboardType="default"
                // value={getpass}
                ref={busref}
                onChangeText={text => setpassword(text)}
              />
            </View>
            <View style={{justifyContent: 'center', width: '20%'}}>
              <Entypo
                style={{alignSelf: 'center'}}
                size={25}
                color={colors.themecolor}
                name={visible == true ? 'eye-with-line' : 'eye'}
                onPress={() => {
                  setvisible(!visible);
                }}
              />
            </View>
          </View>

          <TouchableOpacity
            // style={{backgroundColor: colors.black}}
            onPress={() => {
              Apilogin();
            }}>
            <View
              style={{
                marginTop: '10%',
                padding: '4%',
                // paddingBottom: '10%',
                // height: '25%',
                backgroundColor: colors.themecolor,
                borderRadius: 10,
                width: '40%',
                // marginHorizontal: '10%',
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {login_loading == true ? (
                <View style={{justifyContent: 'center', alignItems: 'center'}}>
                  <ActivityIndicator size={25} color={colors.white} />
                </View>
              ) : (
                <Text
                  style={{
                    textAlign: 'center',
                    color: colors.white,
                    fontSize: 18,
                    fontWeight: '800',
                  }}>
                  Login
                </Text>
              )}
            </View>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
      <RNModal
        animationType="Bottom half"
        transparent={true}
        isVisible={getlogout}
        onBackButtonPress={() => ismodellogout(false)}
        onBackdropPress={() => ismodellogout(false)}>
        <View
          style={{
            backgroundColor: colors.white,
            width: metrics.WIDTH * 1,
            borderRadius: 5,
            paddingTop: '5%',
            marginTop: '30%',
            alignSelf: 'center',
            // marginBottom: '20%',
            position: 'absolute',
            bottom: '-5%',
            paddingBottom: '20%',
          }}>
          <View
            style={{
              marginHorizontal: '5%',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '10%',
            }}>
            <Image
              source={require('../assets/nonet.png')}
              resizeMode="contain"
              style={{
                width: metrics.WIDTH * 0.8,
                height: metrics.HEIGHT * 0.2,
              }}
            />
          </View>
          <Text
            style={{
              marginHorizontal: '5%',
              fontWeight: 'bold',
              fontSize: 15,
              color: 'red',
            }}>
            * Please Check Your Internet Connection.
          </Text>
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: '8%',
            }}
            onPress={() => {
              ismodellogout(false);
            }}>
            <Text
              style={{
                color: colors.themecolor,
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              RETRY
            </Text>
          </TouchableOpacity>
        </View>
      </RNModal>
    </View>
  );
};

export default Login;
