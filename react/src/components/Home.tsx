// src\components\Home.tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { logout } from '../store/memberSlice';
import Login from './Login';
import CharacterCreate from './CharacterCreate';
import CharacterList from './CharacterList';

const Home: React.FC = () => {
  const { currentMember, isAuthenticated } = useSelector((state: RootState) => state.member);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div>
      <h1>Welcome to Raid Party Organizer</h1>
      <p>Logged in as: {currentMember?.username}</p>
      <button onClick={handleLogout}>Logout</button>
      <CharacterCreate />
      <CharacterList />
    </div>
  );
};

export default Home;