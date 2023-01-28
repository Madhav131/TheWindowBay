import React, {Component, useEffect, useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Drewercom from '../Src/components/drewercom';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import Login from '../Src/screens/loginscreen';
import Home from '../Src/screens/homescreen';
import Userscreen from '../Src/screens/userscreen';
import Lead from '../Src/screens/leadscreen';
import Attendance from '../Src/screens/attendance';
import Leavescreen from '../Src/screens/leavescreen';
import Vehiclescreen from '../Src/screens/vehiclescreen';
import Vehiclehistory from '../Src/screens/vehiclehistory';
import Holidayscreen from '../Src/screens/holidayscreen';
import Monthattendence from '../Src/screens/monthattendence';
import Employee from '../Src/screens/Employeescreen';
import Addlead from '../Src/screens/addlead';
import Leaveadd from '../Src/screens/leaveadd';
import Addholiday from '../Src/screens/addholiday';
import Addvehicle from '../Src/screens/addvehicle';
import Adduser from '../Src/screens/adduser';
import Overtime from '../Src/screens/overtime';
import Addovertime from '../Src/screens/addovertime';
import Employeeview from '../Src/screens/employeeview';

/////
import Chosevehicle from '../Src/screens/role3/vehiclechose';
import Vehiclecomplete from '../Src/screens/role3/vehiclecomplete';
import Viewleave from '../Src/screens/viewleave';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerComponent = props => {
  return (
    <Drawer.Navigator
      drawerContent={props => <Drewercom {...props} />}
      screenOptions={{
        headerShown: false,
      }}
      openByDefault={false}
      initialRouteName="Home"
      drawerStyle={{width: '70%'}}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Userscreen" component={Userscreen} />
      <Drawer.Screen name="Lead" component={Lead} />
      <Drawer.Screen name="Attendance" component={Attendance} />
      <Drawer.Screen name="Leavescreen" component={Leavescreen} />
      <Drawer.Screen name="Vehiclescreen" component={Vehiclescreen} />
      <Drawer.Screen name="Vehiclehistory" component={Vehiclehistory} />
      <Drawer.Screen name="Holidayscreen" component={Holidayscreen} />
      <Drawer.Screen name="Monthattendence" component={Monthattendence} />
      <Drawer.Screen name="Employee" component={Employee} />
      <Drawer.Screen name="Overtime" component={Overtime} />
      <Drawer.Screen name="Chosevehicle" component={Chosevehicle} />
      <Drawer.Screen name="Vehiclecomplete" component={Vehiclecomplete} />
      <Drawer.Screen name="Viewleave" component={Viewleave} />
    </Drawer.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Home" component={DrawerComponent} />
        <Stack.Screen name="Userscreen" component={Userscreen} />
        <Stack.Screen name="Lead" component={Lead} />
        <Stack.Screen name="Attendance" component={Attendance} />
        <Stack.Screen name="Leavescreen" component={Leavescreen} />
        <Stack.Screen name="Vehiclescreen" component={Vehiclescreen} />
        <Stack.Screen name="Vehiclehistory" component={Vehiclehistory} />
        <Stack.Screen name="Holidayscreen" component={Holidayscreen} />
        <Stack.Screen name="Monthattendence" component={Monthattendence} />
        <Stack.Screen name="Employee" component={Employee} />
        <Stack.Screen name="Addlead" component={Addlead} />
        <Stack.Screen name="Leaveadd" component={Leaveadd} />
        <Stack.Screen name="Addholiday" component={Addholiday} />
        <Stack.Screen name="Addvehicle" component={Addvehicle} />
        <Stack.Screen name="Adduser" component={Adduser} />
        <Stack.Screen name="Overtime" component={Overtime} />
        <Stack.Screen name="Addovertime" component={Addovertime} />
        <Stack.Screen name="Chosevehicle" component={Chosevehicle} />
        <Stack.Screen name="Vehiclecomplete" component={Vehiclecomplete} />
        <Stack.Screen name="Employeeview" component={Employeeview} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
