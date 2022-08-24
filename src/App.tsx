import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { useLocalStorage } from './components/hooks/useLocalStorage';
import { Movie } from './types/Movie';

export const App = () => {
  const { allMovies, setAllMovies } = useLocalStorage('movies', []);

  const onAdd = (movie: Movie) => {
    if (!(allMovies.some(movieItem => movieItem.title === movie.title))) {
      setAllMovies(movie);
    }
  };

  const onClear = () => {
    localStorage.clear();
  };

  const isDisabled = allMovies.length === 0;

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={allMovies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onAdd={onAdd}
          onClear={onClear}
          isDisabled={isDisabled}
        />
      </div>
    </div>
  );
};
