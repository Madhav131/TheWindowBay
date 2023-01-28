import React from 'react';
import {Platform, Text, View} from 'react-native';
import colors from '../../Utils/colors';
import metrics from '../../Utils/Metrics';
import Ionicons from 'react-native-vector-icons/Ionicons';

const HeaderComponent = props => {
  return (
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
      {props.isMenu ? (
        <Ionicons
          name="menu-sharp"
          color={colors.themecolor}
          size={32}
          onPress={() => props.navigation.toggleDrawer()}
        />
      ) : (
        <Ionicons
          name="ios-arrow-back"
          color={colors.themecolor}
          size={32}
          onPress={() => props.navigation.goBack()}
        />
      )}
      <Text
        style={{
          marginLeft: '5%',
          color: colors.themecolor,
          fontSize: 18,
          fontWeight: 'bold',
        }}>
        {props.title}
      </Text>
    </View>
  );
};
export default HeaderComponent;
