import './App.scss';
import { MovieProvider } from './context/MovieContext';
import { MoviesApp } from './components/MoviesApp';

export const App = () => {
  return (
    <MovieProvider>
      <MoviesApp />
    </MovieProvider>
  );
};
