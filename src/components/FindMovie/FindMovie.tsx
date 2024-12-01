import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const [query, setQuery] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const normalizedMovie = (movieFromApi: MovieData): Movie => {
    return {
      title: movieFromApi.Title,
      description: movieFromApi.Plot,
      imgUrl: movieFromApi.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : movieFromApi.Poster,
      imdbUrl: `https://www.imdb.com/title/${movieFromApi.imdbID}`,
      imdbId: movieFromApi.imdbID,
    };
  };

  const findMovie = (title: string) => {
    const trimmedTitle = title.trim();

    if (trimmedTitle === '') {
      return;
    }

    setLoading(true);
    setErrorMessage(false);

    getMovie(trimmedTitle)
      .then(result => {
        if ('Error' in result) {
          setLoading(false);
          setErrorMessage(true);
        } else {
          setErrorMessage(false);
          setLoading(false);

          setMovie(normalizedMovie(result));
        }
      });
  };

  const handleFindAMovie = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    findMovie(query);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(false);
    setQuery(e.target.value);
  };

  const handleOnAdd = () => {
    if (movie) {
      onAdd(movie);
    }

    setMovie(undefined);
    setQuery('');
  };

  return (
    <>
      <form className="find-movie">
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
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              onClick={handleFindAMovie}
              data-cy="searchButton"
              type="submit"
              disabled={!(query.trim())}
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': loading },
              )}
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
                onClick={() => handleOnAdd()}
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
          {movie && <MovieCard movie={movie} />}
        </div>
      )}
    </>
  );
};
