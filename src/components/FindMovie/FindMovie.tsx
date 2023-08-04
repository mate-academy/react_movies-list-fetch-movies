/* eslint-disable padding-line-between-statements */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

const IMDB_URL = 'https://www.imdb.com/title/';

type Props = {
  movies: Movie[];
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState<ResponseError | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleQueryChange = (
    e:React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(e.target.value);
    setError(null);
  };

  const handleAddMovie = () => {
    if (
      movie !== null
      && !movies.find(item => item.imdbId === movie.imdbId)
    ) {
      setMovies(currentMovies => [...currentMovies, movie]);
    }
    setQuery('');
    setMovie(null);
  };

  const findMovie = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setIsLoading(true);
    getMovie(query).then(res => {
      if ('Error' in res) {
        setError(res);
      } else {
        const poster = res.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : res.Poster;

        setMovie({
          title: res.Title,
          description: res.Plot,
          imgUrl: poster,
          imdbUrl: IMDB_URL + res.imdbID,
          imdbId: res.imdbID,
        });
      }
    }).finally(() => setIsLoading(false));
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
              value={query}
              id="movie-title"
              onChange={handleQueryChange}
              placeholder="Enter a title to search"
              className="input is-danger"
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
              onClick={findMovie}
              className={classNames(
                'button is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!query}
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
