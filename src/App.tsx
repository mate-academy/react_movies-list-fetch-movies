import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovieToList = (movie: Movie | null) => {
    const isMovieAlreadyAdded = movie
      && movies.every(movieItem => movieItem.imdbID !== movie.imdbID);

    if (isMovieAlreadyAdded) {
      setMovies([...movies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovieToList={addMovieToList}
        />
      </div>
    </div>
  );
};
