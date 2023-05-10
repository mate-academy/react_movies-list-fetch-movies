import React, { useState, FormEvent, ChangeEvent } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);

  const handleQueryInput = (event: ChangeEvent<HTMLInputElement>) => {
    setHasLoadingError(false);
    setQuery(event.target.value);
  };

  const handleGetMovie = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsButtonLoading(true);

    const newMovieData = await getMovie(query);

    if ('Error' in newMovieData) {
      setHasLoadingError(true);
    } else {
      const {
        Poster,
        Title,
        Plot,
        imdbID,
      } = newMovieData;

      const newMovie = {
        title: Title,
        description: Plot,
        imgUrl: Poster !== 'N/A'
          ? Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        imdbId: imdbID,
      };

      setMovie(newMovie);
    }

    setIsButtonLoading(false);
  };

  const handleClearMovieSearch = () => {
    setQuery('');
    setMovie(null);
  };

  const handleAddMovie = () => {
    if (movie) {
      onAddMovie(movie);
    }

    handleClearMovieSearch();
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleGetMovie}
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
              className={classNames(
                'input',
                { 'is-danger': hasLoadingError },
              )}
              value={query}
              onChange={handleQueryInput}
            />
          </div>

          {hasLoadingError && (
            <p
              className="help is-danger"
              data-cy="errorMessage"
            >
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isButtonLoading },
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
