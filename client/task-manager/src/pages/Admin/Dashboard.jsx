import React from 'react';
import { useUserAuth } from '../../hooks/useUserAuth';

function Dashboard() {
  useUserAuth();
  return (
    <div className='text-3xl text-rose-600'>admin dachboard</div>
  );
}

export default Dashboard
