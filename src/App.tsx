import './App.scss';
import { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie) => {
    const compareMovie = movies.find(m => m.imdbID === movie.imdbID);

    if (compareMovie) {
      return;
    }

    setMovies(films => [movie, ...films]);
  };

  return (
    <div className="page">
      <div className="page-content">
        {movies.length > 0 && <MoviesList movies={movies} />}
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
