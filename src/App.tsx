import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App:React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movieIsAdded, setMovieISAdded] = useState(false);

  const addMovie = (movie: Movie) => {
    if (movies.some(addedMovie => addedMovie.imdbID === movie.imdbID)) {
      setMovieISAdded(true);
    } else {
      setMovieISAdded(false);
      setMovies([...movies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          onAddMovie={addMovie}
          movieIsAdded={movieIsAdded}
          setMovieISAdded={setMovieISAdded}
        />
      </div>
    </div>
  );
};
