import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (value: string) => {
    setMovie(null);
    setErrorMessage('');
    setQuery(value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!query.trim()) {
      setErrorMessage('Field is empty!');
      setQuery('');

      return;
    }

    setLoading(true);

    getMovie(query)
      .then(data => {
        if (data.Response === 'True') {
          setMovie({
            title: data.Title,
            description: data.Plot,
            imgUrl:
              data.Poster !== 'N/A'
                ? data.Poster
                : `https://via.placeholder.com/360x270.png?text=no%20preview`,
            imdbId: data.imdbID,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          });
        } else {
          setErrorMessage(`Can't find a movie with such a title`);
        }
      })
      .finally(() => {
        setQuery('');
        setLoading(false);
      });
  };

  const handleAdd = () => {
    onAdd(movie as Movie);
    handleInputChange('');
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
              className={classNames('input', { 'is-danger': errorMessage })}
              value={query}
              onChange={e => handleInputChange(e.target.value)}
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
                'is-loading': loading,
              })}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
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
