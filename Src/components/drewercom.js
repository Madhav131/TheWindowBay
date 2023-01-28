import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  AsyncStorage,
  ScrollView,
  Platform,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Login from '../screens/loginscreen';
import colors from '../../Utils/colors';
import metrics from '../../Utils/Metrics';
import Home from '../screens/homescreen';
import {NavigationActions} from '@react-navigation/compat';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {useLoginContext} from '../../Src/screens/context/login_context';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';

const Drewercom = props => {
  const {role, setLogout} = useLoginContext();
  const [focus, setfocus] = useState(false);
  const onLogout = async () => {
    AsyncStorage.clear();
    AsyncStorage.clear(role);
    props.navigation.reset({routes: [{name: 'Login'}]});
  };
  const navigateToScreen = (rout, index) => () => {
    const navigationAction = NavigationActions.navigate({
      routeName: rout,
    });
    props.navigation.closeDrawer();
    // props.navigation.dispatch(DrawerActions.closeDrawer());
    props.navigation.dispatch(navigationAction);
  };

  useEffect(() => {
    console.log('role-->', role);
  });

  return (
    <View style={{flex: 1, backgroundColor: colors.lighttheme}}>
      <ScrollView showsVerticalScrollIndicator={false} style={{flex: 1}}>
        <View
          style={{
            flex: 1,
            marginBottom: '30%',
            marginTop: Platform.OS === 'ios' ? metrics.HEIGHT * 0.05 : 0,
          }}>
          <TouchableOpacity
            onPress={navigateToScreen('Home')}
            style={{
              flexDirection: 'row',
              marginTop: '8%',
              marginHorizontal: '8%',
              alignItems: 'center',
            }}>
            <Entypo name="home" size={25} color={colors.themecolor} />
            <Text
              style={{
                color: colors.black,
                fontWeight: 'bold',
                marginLeft: '5%',
              }}>
              Deshboard
            </Text>
          </TouchableOpacity>
          {role === '3' || role === 3 ? (
            <>
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.gray,
                  marginTop: '5%',
                }}
              />
              <TouchableOpacity
                onPress={navigateToScreen('Chosevehicle')}
                style={{
                  flexDirection: 'row',
                  marginTop: '8%',
                  marginHorizontal: '8%',
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcons
                  name="car-multiple"
                  size={25}
                  color={colors.themecolor}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontWeight: 'bold',
                    marginLeft: '5%',
                  }}>
                  Vehicle Choose
                </Text>
              </TouchableOpacity>
            </>
          ) : role === '1' || role === 1 || role === 2 || role === '2' ? (
            <>
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.gray,
                  marginTop: '5%',
                }}
              />
              <TouchableOpacity
                onPress={navigateToScreen('Userscreen')}
                style={{
                  flexDirection: 'row',
                  marginTop: '8%',
                  marginHorizontal: '8%',
                  alignItems: 'center',
                }}>
                <FontAwesome
                  name="user-circle-o"
                  size={25}
                  color={colors.themecolor}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontWeight: 'bold',
                    marginLeft: '5%',
                  }}>
                  User
                </Text>
              </TouchableOpacity>
            </>
          ) : null}
          {role === '4' || role === 4 ? null : (
            <>
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.gray,
                  marginTop: '8%',
                }}
              />
              <TouchableOpacity
                onPress={navigateToScreen('Lead')}
                style={{
                  flexDirection: 'row',
                  marginTop: '8%',
                  marginHorizontal: '8%',
                  alignItems: 'center',
                  marginBottom: '2%',
                }}>
                <MaterialIcons
                  name="leaderboard"
                  size={25}
                  color={colors.themecolor}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontWeight: 'bold',
                    marginLeft: '5%',
                  }}>
                  Lead
                </Text>
              </TouchableOpacity>
            </>
          )}
          {role === '3' || role === 3 ? (
            <>
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.gray,
                  marginTop: '5%',
                }}
              />
              <TouchableOpacity
                onPress={navigateToScreen('Vehiclecomplete')}
                style={{
                  flexDirection: 'row',
                  marginTop: '8%',
                  marginHorizontal: '8%',
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcons
                  name="shield-car"
                  size={25}
                  color={colors.themecolor}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontWeight: 'bold',
                    marginLeft: '5%',
                  }}>
                  Vehicle Complete
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.gray,
                  marginTop: '8%',
                }}
              />
              <TouchableOpacity
                onPress={navigateToScreen('Attendance')}
                style={{
                  flexDirection: 'row',
                  marginTop: '8%',
                  marginHorizontal: '8%',
                  alignItems: 'center',
                }}>
                <Ionicons
                  name="ios-people-sharp"
                  size={25}
                  color={colors.themecolor}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontWeight: 'bold',
                    marginLeft: '5%',
                  }}>
                  Attendance
                </Text>
              </TouchableOpacity>
            </>
          ) : role === '1' || role === 1 || role === 2 || role === '2' ? (
            <>
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.gray,
                  marginTop: '8%',
                }}
              />
              <TouchableOpacity
                onPress={navigateToScreen('Attendance')}
                style={{
                  flexDirection: 'row',
                  marginTop: '8%',
                  marginHorizontal: '8%',
                  alignItems: 'center',
                }}>
                <Ionicons
                  name="ios-people-sharp"
                  size={25}
                  color={colors.themecolor}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontWeight: 'bold',
                    marginLeft: '5%',
                  }}>
                  Attendance
                </Text>
              </TouchableOpacity>
            </>
          ) : null}

          {role === 4 || role === '4' ? (
            <>
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.gray,
                  marginTop: '8%',
                }}
              />
              <TouchableOpacity
                onPress={navigateToScreen('Attendance')}
                style={{
                  flexDirection: 'row',
                  marginTop: '8%',
                  marginHorizontal: '8%',
                  alignItems: 'center',
                }}>
                <Ionicons
                  name="ios-people-sharp"
                  size={25}
                  color={colors.themecolor}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontWeight: 'bold',
                    marginLeft: '5%',
                  }}>
                  Attendance
                </Text>
              </TouchableOpacity>
            </>
          ) : null}

          <View
            style={{
              height: 1,
              backgroundColor: colors.gray,
              marginTop: '8%',
            }}
          />
          <TouchableOpacity
            onPress={navigateToScreen('Leavescreen')}
            style={{
              flexDirection: 'row',
              marginTop: '8%',
              marginHorizontal: '8%',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons
              name="exit-run"
              size={25}
              color={colors.themecolor}
            />
            <Text
              style={{
                color: colors.black,
                fontWeight: 'bold',
                marginLeft: '5%',
              }}>
              Leave
            </Text>
          </TouchableOpacity>
          {role === '3' || role === 3 ? null : role === '1' ||
            role === 1 ||
            role === '2' ||
            role === 2 ? (
            <>
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.gray,
                  marginTop: '8%',
                }}
              />
              <TouchableOpacity
                onPress={navigateToScreen('Vehiclescreen')}
                style={{
                  flexDirection: 'row',
                  marginTop: '8%',
                  marginHorizontal: '8%',
                  alignItems: 'center',
                }}>
                <Ionicons
                  name="ios-car-sport-sharp"
                  size={25}
                  color={colors.themecolor}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontWeight: 'bold',
                    marginLeft: '5%',
                  }}>
                  Vehicle
                </Text>
              </TouchableOpacity>
            </>
          ) : null}
          {role === '3' ||
          role === 3 ||
          role === '1' ||
          role === 1 ||
          role === '2' ||
          role === 2 ? (
            <>
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.gray,
                  marginTop: '8%',
                }}
              />
              <TouchableOpacity
                onPress={navigateToScreen('Vehiclehistory')}
                style={{
                  flexDirection: 'row',
                  marginTop: '8%',
                  marginHorizontal: '8%',
                  alignItems: 'center',
                }}>
                <FontAwesome
                  name="history"
                  size={25}
                  color={colors.themecolor}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontWeight: 'bold',
                    marginLeft: '5%',
                  }}>
                  Vehicle History
                </Text>
              </TouchableOpacity>
            </>
          ) : null}
          {role === '3' || role === 3 ? null : role === '1' ||
            role === 1 ||
            role === '2' ||
            role === 2 ? (
            <>
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.gray,
                  marginTop: '8%',
                }}
              />
              <TouchableOpacity
                onPress={navigateToScreen('Holidayscreen')}
                style={{
                  flexDirection: 'row',
                  marginTop: '8%',
                  marginHorizontal: '8%',
                  alignItems: 'center',
                }}>
                <Fontisto
                  name="holiday-village"
                  size={25}
                  color={colors.themecolor}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontWeight: 'bold',
                    marginLeft: '5%',
                  }}>
                  Holiday
                </Text>
              </TouchableOpacity>
            </>
          ) : null}
          {/* {role === '3' || role === 3 ? null : role === '1' || role === 1 ? (
            <>
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.gray,
                  marginTop: '8%',
                }}
              />
              <TouchableOpacity
                onPress={navigateToScreen('Monthattendence')}
                style={{
                  flexDirection: 'row',
                  marginTop: '8%',
                  marginHorizontal: '8%',
                  alignItems: 'center',
                }}>
                <MaterialCommunityIcons
                  name="calendar-month"
                  size={25}
                  color={colors.themecolor}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontWeight: 'bold',
                    marginLeft: '5%',
                  }}>
                  Month Attendance
                </Text>
              </TouchableOpacity>
            </>
          ) : null} */}
          {/* {role === '3' || role === 3 ? null : role === '1' || role === 1 ? (
            <>
              <View
                style={{
                  height: 1,
                  backgroundColor: colors.gray,
                  marginTop: '8%',
                }}
              />
              <TouchableOpacity
                onPress={navigateToScreen('Employee')}
                style={{
                  flexDirection: 'row',
                  marginTop: '8%',
                  marginHorizontal: '8%',
                  alignItems: 'center',
                }}>
                <MaterialIcons
                  name="emoji-people"
                  size={25}
                  color={colors.themecolor}
                />
                <Text
                  style={{
                    color: colors.black,
                    fontWeight: 'bold',
                    marginLeft: '5%',
                  }}>
                  Employee
                </Text>
              </TouchableOpacity>
            </>
          ) : null} */}
          <View
            style={{
              height: 1,
              backgroundColor: colors.gray,
              marginTop: '8%',
            }}
          />
          <TouchableOpacity
            onPress={navigateToScreen('Overtime')}
            style={{
              flexDirection: 'row',
              marginTop: '8%',
              marginHorizontal: '8%',
              alignItems: 'center',
            }}>
            <MaterialIcons
              name="more-time"
              size={25}
              color={colors.themecolor}
            />
            <Text
              style={{
                color: colors.black,
                fontWeight: 'bold',
                marginLeft: '5%',
              }}>
              Overtime
            </Text>
          </TouchableOpacity>
          <View
            style={{
              height: 1,
              backgroundColor: colors.gray,
              marginTop: '8%',
            }}
          />
        </View>
      </ScrollView>

      <TouchableOpacity
        onPress={() => setLogout(props)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: '5%',
          position: 'absolute',
          bottom: '0%',
          justifyContent: 'space-between',
          width: '100%',
          backgroundColor: colors.themecolor,
          height: Platform.OS === 'ios' ? metrics.HEIGHT * 0.08 : 50,
        }}>
        <Text style={{color: colors.white, fontSize: 16, fontWeight: 'bold'}}>
          Logout
        </Text>
        <AntDesign name="rightcircle" size={20} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

export default Drewercom;
