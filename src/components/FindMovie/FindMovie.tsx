import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  onAddMovie: (movie: Movie) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({
  onAddMovie = () => {},
  movies,
}) => {
  const [isLoadingMovie, setIsLoadingMovie] = useState(false);
  const [title, setTitle] = useState('');
  const [response, setResponse] = useState<MovieData | ResponseError | {}>({});
  const [errorMessage, setErrorMessage] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const [isFirstSearch, setIsFirstSearch] = useState(true);

  useEffect(() => {
    if ('Title' in response) {
      const newMovie: Movie = {
        title: response.Title,
        description: response.Plot,
        imgUrl: response.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : response.Poster,
        imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        imdbId: response.imdbID,
      };

      setMovie(newMovie);
      setIsFirstSearch(false);
    }

    if ('Error' in response) {
      setErrorMessage('Can\'t find a movie with such a title');
    }
  }, [response]);

  const handleFindMovie = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setErrorMessage('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoadingMovie(true);

    getMovie(`[${title}]`)
      .then(setResponse)
      .finally(() => setIsLoadingMovie(false));
  };

  const reset = () => {
    setTitle('');
    setResponse({});
    setMovie(null);
  };

  const handleAddMovie = () => {
    if (movie !== null) {
      if (movies.some(({ imdbId }) => imdbId === movie.imdbId)) {
        reset();
      } else {
        onAddMovie(movie);
        reset();
      }
    }

    setIsFirstSearch(true);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': errorMessage })}
              value={title}
              onChange={handleFindMovie}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isLoadingMovie,
              })}
              onClick={() => setIsLoadingMovie(true)}
              disabled={!title}
            >
              {isFirstSearch ? ('Find a movie') : ('Search again')}

            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
