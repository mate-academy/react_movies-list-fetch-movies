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
          onAdd={(newMovie: Movie) =>
            setMovies(prev => {
              if (
                prev.filter(item => item.imdbId === newMovie.imdbId).length ===
                0
              ) {
                return [...prev, newMovie];
              }

              return prev;
            })
          }
        />
      </div>
    </div>
  );
};
