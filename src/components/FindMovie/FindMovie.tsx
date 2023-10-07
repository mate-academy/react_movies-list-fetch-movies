import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  handleAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ handleAddMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setErrorMessage(false);
  };

  const handleOnAdd = () => {
    if (movie) {
      handleAddMovie(movie);
      setMovie(null);
      setQuery('');
    } else {
      throw new Error();
    }
  };

  const handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          throw new Error();
        }

        setMovie({
          title: response.Title,
          description: response.Plot,
          imgUrl: response.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : response.Poster,
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          imdbId: response.imdbID,
        });
      })

      .catch(() => {
        setErrorMessage(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => handleOnSubmit(event)}
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
              value={query}
              onChange={(event) => handleQueryChange(event.target.value)}
              className={cn(
                'input',
                {
                  'is-danger': errorMessage,
                },
              )}
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
              disabled={!query.trim()}
              className={cn(
                'button',
                'is-light',
                {
                  'is-loading': loading,
                },
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
                onClick={handleOnAdd}
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
