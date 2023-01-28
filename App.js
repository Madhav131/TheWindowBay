import React from 'react';
import Navigation from './Utils/navigation';
import {Loginprovider} from './Src/screens/context/login_context';
import {MenuProvider} from 'react-native-popup-menu';

const App = () => {
  return (
    <Loginprovider>
      <MenuProvider>
        <Navigation />
      </MenuProvider>
      {/* </GetuserProvider> */}
    </Loginprovider>
  );
};

export default App;
