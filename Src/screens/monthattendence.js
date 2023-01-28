import React from 'react';
import {View, Text, TouchableOpacity, StatusBar} from 'react-native';
import colors from '../../Utils/colors';
import metrics from '../../Utils/Metrics';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderComponent from '../components/HeaderComponent';

const Monthattendence = props => {
  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <StatusBar backgroundColor={colors.white} barStyle={'dark-content'} />
      <HeaderComponent
        navigation={props.navigation}
        title="Monthly Attendance"
        isMenu={true}
      />
    </View>
  );
};

export default Monthattendence;
