import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          newMovie={movie =>
            setMovies(prev => {
              const data = prev.filter(item => item.imdbId !== movie.imdbId);

              return [...data, movie];
            })
          }
        />
      </div>
    </div>
  );
};
