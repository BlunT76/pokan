import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import pokanReducer from './store/Reducers';
import AppBar from './components/AppBar';
import AppContainer from './components/AppContainer';

const store = createStore(pokanReducer);

function App() {
  return (
    <Provider store={store}>
      <React.Fragment>
        <AppBar />
        <AppContainer />
      </React.Fragment>
    </Provider>
  );
}

export default App;
