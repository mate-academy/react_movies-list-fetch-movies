import { useContext } from 'react';
import { MoviesContext } from '../contexts/MoviesContext';

export const useMoviesContext = () => useContext(MoviesContext);
