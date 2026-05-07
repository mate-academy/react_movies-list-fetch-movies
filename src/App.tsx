import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { normalizeMovieData } from './utils/normalize';
import { Toast } from './components/Toast/Toast';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [searchInput, setSearchInput] = useState<string>('');
  const [findMovieError, setFindMovieError] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);

  const onChangeInput = (input: string) => {
    setSearchInput(input);
    setFindMovieError(false);
  };

  const [onLoading, setOnLoading] = useState(false);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setOnLoading(true);
    getMovie(searchInput)
      .then(data => {
        setFindMovieError(false);
        if ('Title' in data) {
          setSearchInput('');
          const newMovie = normalizeMovieData(data);

          setMovie(newMovie);
        } else {
          setFindMovieError(true);
          setErrorText("Can't find a movie with such a title");
        }
      })
      .finally(() => setOnLoading(false));
  };

  const onAddMovie = (findedMovie: Movie) => {
    if (movies.some(m => m.imdbId === findedMovie.imdbId)) {
      setErrorText('This movie is already in the list');
      setMovie(null);

      return;
    } else {
      setMovies(prev => [...prev, findedMovie]);
      setMovie(null);
    }
  };

  return (
    <div className="page">
      {errorText && (
        <Toast text={errorText} onSetText={setErrorText} errorType="warning" />
      )}
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          searchInput={searchInput}
          onSearch={onChangeInput}
          onLoading={onLoading}
          findMovieError={findMovieError}
          errorText={errorText}
          onSubmit={onSubmit}
          movie={movie}
          onAddMovie={onAddMovie}
        />
      </div>
    </div>
  );
};
