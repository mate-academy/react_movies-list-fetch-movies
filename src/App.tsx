import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addPost = ({ movie }: { movie: Movie | null }) => {
    if (movie) {
      setMovies(currentMovies => {
        const alreadyExists = currentMovies.some(
          m => m.imdbId === movie.imdbId,
        );

        if (alreadyExists) {
          return currentMovies;
        }

        return [...currentMovies, movie];
      });
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onSubmit={addPost} />
      </div>
    </div>
  );
};
