"use client"; 

import React, { useEffect } from 'react';
import { testSupabaseConnection } from '../supabase/supaBaseTest';

const Home = () => {
  useEffect(() => {
    // Call the testSupabaseConnection function
    testSupabaseConnection();
  }, []);

  return (
    <div>
      <h1>Welcome to the Weather Forecast Website!</h1>
    </div>
  );
};

export default Home;
