import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [searchValue, setSearchValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(searchValue)
      .then(response => {
        if (response.Response === 'True') {
          setMovie({
            title: response.Title,
            description: response.Plot,
            imgUrl:
              response.Poster !== 'N/A'
                ? response.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: 'https://www.imdb.com/title/' + response.imdbID,
            imdbId: response.imdbID,
          });
        } else {
          setShowError(true);
        }
      })
      .finally(() => setIsLoading(false));
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
              value={searchValue}
              onChange={event => {
                setSearchValue(event.target.value);
                setShowError(false);
              }}
            />
          </div>

          {showError && (
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
                'is-loading': isLoading,
              })}
              disabled={!searchValue}
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
                onClick={() => {
                  if (movie) {
                    onAddMovie(movie);
                    setSearchValue('');
                    setMovie(null);
                  }
                }}
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
