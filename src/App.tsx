import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleMovie = (newMovie: Movie) => {
    if(movies.some(movie => newMovie.imdbId === movie.imdbId)) {
      return;
    }

     setMovies(prevState => [...prevState, newMovie])
  }

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie handleMovie={handleMovie}/>
      </div>
    </div>
  );
};
