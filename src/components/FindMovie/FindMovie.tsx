import cn from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [count, setCount] = useState(0);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setQuery(event.target.value);
  };

  const handleFindMovie = (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setCount(prev => prev + 1);

    if (query) {
      setError(false);

      getMovie(query)
        .then(response => {
          if ('Error' in response) {
            setError(true);
          } else {
            const movie = response as MovieData;

            setNewMovie({
              title: movie.Title,
              description: movie.Plot,
              imgUrl: movie.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : movie.Poster,
              imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
              imdbId: movie.imdbID,
            });
          }
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  };

  const handleAddMovie = () => {
    if (newMovie) {
      addMovie(newMovie);
      setNewMovie(null);
      setQuery('');
      setCount(0);
      setError(false);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFindMovie}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              value={query}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': error,
              })}
              onChange={handleInputChange}
            />
          </div>

          {error && (
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
              className={cn('button is-light', {
                'is-loading': loading,
              })}
              disabled={!query}
            >
              {
                !count
                  ? 'Find a movie'
                  : 'Search again'
              }
            </button>
          </div>

          {newMovie && (
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

      {newMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={newMovie} />
        </div>
      )}
    </>
  );
};
