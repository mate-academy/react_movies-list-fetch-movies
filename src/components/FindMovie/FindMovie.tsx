import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';

interface Props {
  onAddMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setMovie(null);
    setIsLoading(true);

    getMovie(query)
      .then(foundedMovie => {
        if ('Error' in foundedMovie) {
          throw new Error(foundedMovie.Error);
        }

        setMovie({
          title: foundedMovie.Title,
          description: foundedMovie.Plot,
          imdbId: foundedMovie.imdbID,
          imdbUrl: `https://www.imdb.com/title/${foundedMovie.imdbID}`,
          imgUrl:
            foundedMovie.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : foundedMovie.Poster,
        });
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => setIsLoading(false));
  };

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setQuery(event.target.value);
  };

  const handleClearForm = () => {
    setMovie(null);
    setError('');
    setQuery('');
  };

  const handleAddMovie = (foundedMovie: Movie) => {
    onAddMovie(foundedMovie);
    handleClearForm();
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
              className="input is-danger"
              value={query}
              onChange={handleChangeQuery}
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={query === ''}
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
                onClick={() => handleAddMovie(movie)}
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
