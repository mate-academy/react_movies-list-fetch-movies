import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovieTotheList = (movieData: Movie) => {
    const includesMovie = movies.find(movie => movie.imdbId === movieData.imdbId);

    if (!includesMovie) {
      setMovies(prevMovies => [...prevMovies, movieData])
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovieTotheList={addMovieTotheList} />
      </div>
    </div>
  );
};
