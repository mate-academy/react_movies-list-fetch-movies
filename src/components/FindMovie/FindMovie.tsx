import React, { useState } from 'react';
import { getMovie } from '../../utils/api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { normalizedMovieData } from '../../utils/normalizedMovieData';
import './FindMovie.scss';
import cn from 'classnames';

type Props = {
  existingMovies: Movie[];
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ existingMovies, onAdd }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (errorMessage) {
      setErrorMessage('');
    }

    setSearchTerm(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const prepearedValue = searchTerm.toLowerCase().trim();

    if (!prepearedValue) {
      return;
    }

    try {
      setIsLoading(true);

      const data = await getMovie(prepearedValue);

      if ('Error' in data) {
        setErrorMessage(data.Error);
        setFoundMovie(null);

        return;
      } else {
        setFoundMovie(() => normalizedMovieData(data));
      }
    } catch (error) {
      setErrorMessage(`Something wrong: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMovie = () => {
    if (
      foundMovie &&
      !existingMovies.some(m => m.imdbId === foundMovie.imdbId)
    ) {
      onAdd(foundMovie);
    }

    setSearchTerm('');
    setFoundMovie(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="find-movie">
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
              className={cn('input', { 'is-danger': errorMessage })}
              value={searchTerm}
              onChange={handleInput}
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
              className={cn('button', 'is-light', { 'is-loading': isLoading })}
              disabled={!searchTerm}
            >
              {foundMovie ? `Search again` : `Find a movie`}
            </button>
          </div>

          {foundMovie && (
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

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
