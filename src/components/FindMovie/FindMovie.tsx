import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[]
  onAdd:(movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [movieLoading, isMovieloading] = useState(false);
  const [isError, setIsError] = useState(false);

  const clearSearch = () => {
    setMovie(null);
    setQuery('');
    isMovieloading(false);
  };

  const handleUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsError(false);
  };

  const handleMovieAddition = (newMovie: Movie) => {
    if (movies.some(addedMovie => addedMovie.imdbId === newMovie.imdbId)) {
      clearSearch();
    } else {
      onAdd(newMovie);
      clearSearch();
    }
  };

  const handleUsersearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    isMovieloading(true);

    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          setIsError(true);
        } else {
          setMovie({
            title: response.Title,
            description: response.Plot,
            imgUrl: !response.Poster
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : response.Poster,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          });
        }
      })
      .finally(() => isMovieloading(false));
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleUsersearch}>
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
              className="input is-dander"
              onChange={handleUserInput}
              value={query}
            />
          </div>
          {isError && (
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
              className={classNames(
                'button is-light',
                { 'is-loading': movieLoading },
              )}
              disabled={query.trim() === ''}
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
                onClick={() => handleMovieAddition(movie)}
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
