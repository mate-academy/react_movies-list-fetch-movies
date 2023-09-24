import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAddMovie = () => {
    if (movie) {
      addMovie(movie);
    }

    setMovie(null);
  };

  const handelQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsError(false);
  };

  const handleSumbit = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setQuery('');

    if (query) {
      setIsLoading(true);
      getMovie(query)
        .then(response => {
          if ('Error' in response) {
            throw new Error();
          }

          setMovie({
            title: response.Title,
            description: response.Plot,
            imgUrl: response.Poster !== 'N/A'
              ? response.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          });
        })

        .catch(() => setIsError(true))
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <>
      <form
        className="find-movie"
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
              className="input is-blue"
              value={query}
              onChange={handelQueryChange}
            />
          </div>

          <p className="help is-danger" data-cy="errorMessage">
            {isError && (
              'Can\'t find a movie with such a title'
            )}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button', {
                'is-light': query,
                'is-loading': isLoading,
              })}
              onClick={handleSumbit}
              disabled={!query}
            >
              {movie ? (
                'Search again'
              ) : (
                'Find a movie'
              )}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
      </div>
    </>
  );
};
