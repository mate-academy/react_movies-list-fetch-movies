import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { ResponseError } from './types/ReponseError';
import { MovieData } from './types/MovieData';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  // prettier-ignore
  // eslint-disable-next-line
  const [findedMovie, setFindetMovie] = useState<MovieData | ResponseError | null>(null);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          movies={movies}
          currentMovie={findedMovie}
          setCurrentMovie={newMovie => setFindetMovie(newMovie)}
          addMovies={(addedMovie: Movie) => setMovies([...movies, addedMovie])}
        />
      </div>
    </div>
  );
};
