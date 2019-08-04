import React, {useState} from 'react';
import './App.css';
import { Menu, Icon } from 'semantic-ui-react'
import ExcelReader from './components/ExcelReader';

function App() {

  return (
    <div className="App">
      <Menu inverted>
      <Menu.Item header>Ansible</Menu.Item>
      <Menu.Menu position='right'>
        <Menu.Item onClick={() => window.location.reload()}>
          <Icon name='refresh'></Icon>
        </Menu.Item>
      </Menu.Menu>
        </Menu>

      <ExcelReader  />


    </div>
  );
}


export default App;
