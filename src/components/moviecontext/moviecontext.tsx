import React from 'react';
import { MovieContextType } from '../../types/Movie';

export const MovieContext = React.createContext<MovieContextType | undefined>(
  undefined,
);
