import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC<{}> = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const onAdd = (movie: Movie) => {
    if (movies.every(film => film.imdbID !== movie.imdbID)) {
      setMovies(prevState => {
        return [...prevState, movie];
      });
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAddMovie={onAdd} />
      </div>
    </div>
  );
};
