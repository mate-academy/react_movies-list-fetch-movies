import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handelAddMovieToList = (movie: Movie) => {
    const isDublicate = movies.some(item => item.imdbId === movie.imdbId);

    if (!isDublicate) {
      setMovies(prevState => ([
        ...prevState,
        movie,
      ]));
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovie={(movie) => handelAddMovieToList(movie)} />
      </div>
    </div>
  );
};
