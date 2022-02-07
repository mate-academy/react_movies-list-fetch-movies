import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { getMovie } from './api';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [newMovie, setMovie] = useState<Movie | null>(null);
  const [movieFound, setFoundMovie] = useState(true);

  const addMovieToList = (movie: Movie) => {
    if (movie !== null && movies.every(movieItem => movieItem.imdbID !== movie.imdbID)) {
      setMovies([...movies, movie]);
      setMovie(null);
    }
  };

  const addNewMovie = async (title: string) => {
    const movie = await getMovie(title);

    if (movie.Response === 'True') {
      setMovie(movie);
      setFoundMovie(true);
    } else {
      setFoundMovie(false);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          movie={newMovie}
          addMovie={addNewMovie}
          addMovieToList={addMovieToList}
          movieFound={movieFound}
        />
      </div>
    </div>
  );
};
