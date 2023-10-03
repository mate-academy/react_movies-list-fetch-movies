import './App.scss';
import { MoviesProvider } from './Context/MovieContext';
import { MovieApp } from './components/TodoApp';

export const App = () => {
  return (
    <MoviesProvider>
      <MovieApp />
    </MoviesProvider>
  );
};
