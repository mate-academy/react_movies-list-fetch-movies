import React, {
  Dispatch, SetStateAction, useEffect, useState,
} from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface FindMovieProps {
  setIsTitle: Dispatch<SetStateAction<boolean>>
  setTitle: Dispatch<SetStateAction<string>>
  movie: Movie;
  isTitle: boolean;
  isLoading: boolean;
  handleAddMovie: (movie: Movie) => void
}

export const FindMovie: React.FC<FindMovieProps> = (
  {
    setIsTitle, setTitle, movie, isTitle, isLoading, handleAddMovie,
  },
) => {
  const [query, setQuerty] = useState<string>('');

  const handleFormSubmint = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    (setTitle(query));
  };

  useEffect(() => {
    setIsTitle(false);
  }, [query, setIsTitle]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => handleFormSubmint(event)}
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
              className="input"
              value={query}
              onChange={(event) => setQuerty(event.target.value)}
            />
          </div>

          {(isTitle) ? (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          ) : null}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button ${isLoading ? 'is-light' : 'is-loading'}`}
              {...(!query && { disabled: true })}
            >
              {movie.title ? 'Search again' : 'Find a movie' }
            </button>
          </div>

          {(movie.title) && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  handleAddMovie(movie);
                  setQuerty('');
                  setTimeout(() => setQuerty(''), 0);
                }}
              >
                Add to the list
              </button>
            </div>
          ) }
        </div>
      </form>
      {movie.title && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
