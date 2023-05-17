import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovieCard } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  handleAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ handleAddMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFound, setIsFound] = useState(true);

  const isFindMovieDisabled = !query;

  const handleFindMovieButtonClick = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    try {
      setIsLoading(true);
      const normalizedQuery = query.trim();

      if (!normalizedQuery) {
        return;
      }

      const film = await getMovieCard(normalizedQuery);

      if (!film) {
        setIsFound(false);
      } else {
        setIsFound(true);
        setMovie(film);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetMovie = () => {
    setMovie(null);
    setQuery('');
    setIsFound(true);
  };

  const onAddClick = () => {
    if (movie) {
      handleAddMovie(movie);
      resetMovie();
    }
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
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': !isFound })}
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </div>

          {!isFound && (
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
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={isFindMovieDisabled}
              onClick={handleFindMovieButtonClick}
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
                onClick={onAddClick}
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
