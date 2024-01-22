import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovieToList = (movie: Movie) => {
    const movieIdList = movies.map(item => item.imdbId);

    if (!movieIdList.includes(movie.imdbId)) {
      setMovies((prevMovieList) => [...prevMovieList, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          addMovie={handleAddMovieToList}
        />
      </div>
    </div>
  );
};
