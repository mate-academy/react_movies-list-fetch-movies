import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movieList, setMovieList] = useState<Movie[]>([]);

  const addMovie = (movie: Movie) => {
    if (!movieList.some(movieItem => movieItem.imdbID === movie.imdbID)) {
      setMovieList([...movieList, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movieList} />
      </div>
      <div className="sidebar">
        <FindMovie onAddMovie={addMovie} />
      </div>
    </div>
  );
};
