import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [confirmedQuery, setConfirmedQuery] = useState('');
  const [loadingMovie, setLoadingMovie] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleSetQuery = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (errorMessage) {
      setQuery(e.target.value);
      setErrorMessage(false);

      return;
    }

    setQuery(e.target.value);
  };

  const handleFindMovie = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();
    setConfirmedQuery(query.trim());
  };

  const handleAddMovieToList = () => {
    if (movie) {
      addMovie(movie);
      setQuery('');
      setMovie(null);
      setConfirmedQuery('');
    }
  };

  const convertToMovie = (
    data: MovieData | ResponseError,
  ): Movie => {
    if ('Title' in data) {
      const img = data.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : data.Poster;

      return {
        title: data.Title,
        description: data.Plot,
        imgUrl: img,
        imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
        imdbId: data.imdbID,
      };
    }

    throw new Error(`Response: ${data.Response}, Error: ${data.Error}`);
  };

  useEffect(() => {
    if (confirmedQuery) {
      setLoadingMovie(true);
      getMovie(confirmedQuery)
        .then(data => {
          setMovie(convertToMovie(data));
        })
        .catch(() => {
          setErrorMessage(false);
        })
        .finally(() => {
          setLoadingMovie(false);
        });
    }
  }, [confirmedQuery]);

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
              value={query}
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': errorMessage,
              })}
              onChange={handleSetQuery}
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
              data-cy="searchButton"
              type="submit"
              className={classNames('button', {
                'is-light': !loadingMovie,
                'is-loading': loadingMovie,
              })}
              onClick={handleFindMovie}
              disabled={!query.length}
            >
              {movie
                ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovieToList}
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
