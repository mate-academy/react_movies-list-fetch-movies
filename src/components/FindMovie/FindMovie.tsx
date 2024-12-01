import React, { useState } from 'react';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { normalizeMovieData } from '../../utils/normalize';
import { MovieData } from '../../types/MovieData';
import classNames from 'classnames';

interface FindMovieProps {
  handleAddMovie: (movies: Movie) => void;
  movies: Movie[];
}

export const FindMovie: React.FC<FindMovieProps> = ({
  handleAddMovie,
  movies,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [noMovieFound, setNoMovieFound] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);

  const emptyInput = inputValue.trim() === '';

  const btnClass = classNames({
    button: true,
    'is-loading': isLoading,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setNoMovieFound(false);
  };

  const isMovieData = (data: unknown): data is MovieData => {
    return (data as MovieData).Poster !== undefined;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const movieData = await getMovie(inputValue);

      if (isMovieData(movieData)) {
        const normalizedMovie = normalizeMovieData(movieData);

        setFoundMovie(normalizedMovie);
        setNoMovieFound(false);
      } else {
        setNoMovieFound(true);
      }
    } catch (error) {
      setNoMovieFound(true);
    }

    setIsLoading(false);
  };

  const handleAddToTheList = (movie: Movie) => {
    if (!movies.find(el => el.imdbId === movie.imdbId)) {
      handleAddMovie(movie);
    }

    setInputValue('');
    setFoundMovie(null);
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
              className="input"
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>

          {noMovieFound && (
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
              className={btnClass}
              disabled={emptyInput && !foundMovie}
            >
              {foundMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {foundMovie !== null && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddToTheList(foundMovie)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {foundMovie !== null && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
