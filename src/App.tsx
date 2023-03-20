import React from 'react';
import './App.scss';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  return (
    <div className="sidebar">
      <FindMovie />
    </div>
  );
};
