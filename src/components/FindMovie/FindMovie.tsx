import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  addMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie>();
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  function isResponseError(
    response: MovieData | ResponseError,
  ): response is ResponseError {
    return (response as ResponseError).Response === 'False';
  }

  function normalizeMovie(movieData: MovieData): Movie {
    let poster = 'https://via.placeholder.com/360x270.png?text=no%20preview';

    if (movieData.Poster !== 'N/A') {
      poster = movieData.Poster;
    }

    return {
      title: movieData.Title,
      description: movieData.Plot,
      imgUrl: poster,
      imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
      imdbId: movieData.imdbID,
    };
  }

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setError(false);
    setInput(event.target.value);
    setMovie(undefined);
  };

  const handleAddMovie = () => {
    if (movie) {
      setInput('');
      addMovie(movie);
      setMovie(undefined);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    getMovie(input)
      .then(response => {
        if (isResponseError(response)) {
          setError(true);
        } else {
          setMovie(normalizeMovie(response));
          setError(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <form className="find-movie" onSubmit={event => handleSubmit(event)}>
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
              className={classNames('input', error ? 'is-danger' : '')}
              value={input}
              onChange={e => handleQueryChange(e)}
            />
          </div>
          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button',
                'is-light',
                loading ? 'is-loading' : '',
              )}
              disabled={input === ''}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie()}
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
