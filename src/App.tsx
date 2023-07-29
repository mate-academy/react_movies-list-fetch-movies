import { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { MovieData } from './types/MovieData';

import { getMovie } from './api';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [formInput, setFormInput] = useState('');
  const [newMovie, setNewMovie] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<null | Movie>(null);

  const changeInput = (value: string) => {
    setFormInput(value);
  };

  const moviesQuery = () => {
    setLoading(true);
    getMovie(formInput).then(res => {
      if (!Object.hasOwnProperty.call(res, 'Error')) {
        setNewMovie(res as MovieData);
      } else {
        setNewMovie(null);
      }
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (newMovie) {
      setMovie({
        title: newMovie.Title,
        description: newMovie.Plot,
        imgUrl: newMovie.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : newMovie.Poster,
        imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
        imdbId: newMovie.imdbID,
      });
    }
  }, [newMovie]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          formInput={formInput}
          onChangeInput={changeInput}
          onMoviesQuery={moviesQuery}
          movie={movie}
          setMovie={setMovie}
          setAllMovies={setMovies}
          allMovies={movies}
          loading={loading}
        />
      </div>
    </div>
  );
};
