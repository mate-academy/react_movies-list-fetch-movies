import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovie] = useState<Movie[]>([]);

  const addMovie = (movie: Movie) => {
    const movieExist = movies.find((m) => (m.imdbId === movie.imdbId));

    if (!movieExist) {
      setMovie((prevMovie) => ([
        ...prevMovie,
        movie,
      ]));
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList
          movies={movies}
        />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={addMovie} />
      </div>
    </div>
  );
};
