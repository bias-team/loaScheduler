import React from 'react';
import RaidTable from '../components/RaidTable';
import MemberList from '../components/MemberList';

function Home() {
  return (
    <div className="home-container">
      <h1>Raid and Character Management</h1>
      <div className="main-content">
        <RaidTable />
        <MemberList />
      </div>
    </div>
  );
}

export default Home;
