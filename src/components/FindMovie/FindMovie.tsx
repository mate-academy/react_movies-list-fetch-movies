import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovieDataFromServer } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  setNewMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ setNewMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [confirmedQuery, setConfirmedQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasInputError, setHasInputError] = useState<null | boolean>(null);

  const handleSetQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (hasInputError) {
      setQuery(event.target.value);
      setHasInputError(false);

      return;
    }

    setQuery(event.target.value);
  };

  const handleFindMovie = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    setConfirmedQuery(query.trim());
  };

  const handleAddMovieToList = () => {
    if (movie) {
      setNewMovie(movie);
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
      setIsLoading(true);
      getMovieDataFromServer(confirmedQuery)
        .then(data => {
          setMovie(convertToMovie(data));
        })
        .catch(() => {
          setHasInputError(true);
        })
        .finally(() => {
          setIsLoading(false);
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
              id="movie-title"
              placeholder="Enter a title to search"
              value={query}
              className={classNames('input', {
                'is-danger': hasInputError,
              })}
              onChange={handleSetQuery}
            />
          </div>

          {hasInputError && (
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
                'is-light': !isLoading,
                'is-loading': isLoading,
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
                onClick={() => handleAddMovieToList()}
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
