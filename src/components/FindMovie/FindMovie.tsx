import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

type Props = {
  addMovie: (movie: Movie) => void;
};

type NormalizeData = (movieDate: MovieData) => void;

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (error) {
      setError('');
    }
  }, [query]);

  const checkImage = (poster: string) => {
    return poster !== 'N/A'
      ? poster
      : 'https://via.placeholder.com/360x270.png?text=no%20preview';
  };

  const normalizeData: NormalizeData = ({
    Title,
    Plot,
    Poster,
    imdbID,
  }) => {
    setMovie({
      title: Title,
      description: Plot,
      imgUrl: checkImage(Poster),
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbId: imdbID,
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    return getMovie(query)
      .then((res) => {
        if ('imdbID' in res) {
          normalizeData(res);
        } else {
          throw new Error('Can\'t find a movie with such a title');
        }
      })
      .catch((newError: Error) => setError(newError.message))
      .finally(() => setIsLoading(false));
  };

  const handleAddFilm = () => {
    if (movie !== null) {
      addMovie(movie);
      setQuery('');
      setMovie(null);
    }
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
              className={classNames('input', { 'is-danger': error })}
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query.trim()}
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
                onClick={handleAddFilm}
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
