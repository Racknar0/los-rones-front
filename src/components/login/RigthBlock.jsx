import React from 'react';
import logo from '../../assets/logo-login.png';
import './RigthBlock.css';

const RigthBlock = () => {
  return (
    <div className='right_block_login_container'>
      <img src={logo} alt="Logo" className='logo_login'/>
    </div>
  );
};

export default RigthBlock;