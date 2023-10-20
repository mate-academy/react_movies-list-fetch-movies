import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  return (
    <div className="page">
      <div className="page-content">
        <MoviesList />
      </div>

      <div className="sidebar">
        <FindMovie />
      </div>
    </div>
  );
};
