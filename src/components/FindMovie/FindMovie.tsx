import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  onMovieAdd: (m: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [input, setInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(input)
      .then(val => {
        if ('imdbID' in val
          && 'Title' in val
          && 'Plot' in val
          && 'Poster' in val) {
          const newMovie: Movie = {
            imdbId: val.imdbID,
            title: val.Title,
            description: val.Plot,
            imgUrl: val.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : val.Poster,
            imdbUrl: `https://www.imdb.com/title/${val.imdbID}`,
          };

          setMovie(newMovie);
        }

        if ('Error' in val) {
          setErrorMessage(val.Error);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleMovieAdd = () => {
    if (movie) {
      onMovieAdd(movie);
    }

    setMovie(null);
    setInput('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              value={input}
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': errorMessage,
              })}
              onChange={event => {
                setInput(event.target.value);
                setErrorMessage('');
              }}
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
                'is-loading': isLoading,
              })}
              disabled={!input}
            >
              {movie
                ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleMovieAdd}
              >
                Add to the list
              </button>
            )}
          </div>
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
