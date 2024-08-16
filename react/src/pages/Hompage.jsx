import React from 'react';
import RaidTable from '../components/RaidTable';
import MemberList from '../components/MemberList';

function HomePage({ user }) {
  return (
    <div>
      <h1>Welcome, {user}</h1>
      <RaidTable user={user} />
      <MemberList user={user} />
    </div>
  );
}

export default HomePage;
