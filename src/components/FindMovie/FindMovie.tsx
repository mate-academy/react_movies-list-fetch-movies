import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  // eslint-disable-next-line
  const DEFAULT_IMG = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setErrorMessage(false);
  };

  const handleFindMovie = (newQuery: string) => {
    setLoading(true);
    getMovie(newQuery.trim())
      .then((response: MovieData | ResponseError) => {
        if ('Title' in response) {
          const {
            Poster,
            Title,
            Plot,
            imdbID,
          } = response;

          setMovie({
            title: Title,
            description: Plot,
            imgUrl: Poster === 'N/A' ? DEFAULT_IMG : Poster,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          });
        } else {
          setErrorMessage(true);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleFindMovie(query);
  };

  const handleAddMovie = () => {
    if (movie) {
      addMovie(movie);
      setQuery('');
      setMovie(null);
    }
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
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': errorMessage,
              })}
              value={query}
              onChange={handleQueryChange}
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
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              disabled={!query}
              onClick={() => handleFindMovie(query)}
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
