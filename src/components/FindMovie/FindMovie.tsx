import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[] | [];
  setMovies: (newArr: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setError(data.Error);
        } else {
          if (data.Poster === 'N/A') {
            setMovie({
              title: data.Title,
              description: data.Plot,
              imgUrl: `https://via.placeholder.com/360x270.png?text=no%20preview`,
              imdbId: data.imdbID,
              imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            });
          } else {
            setMovie({
              title: data.Title,
              description: data.Plot,
              imgUrl: data.Poster,
              imdbId: data.imdbID,
              imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            });
          }

          setError(null);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddMovie = (movieToAdd: Movie) => {
    const isMovieInList = movies.find(m => m.imdbId === movieToAdd.imdbId);

    if (isMovieInList) {
      setQuery('');
      setMovie(null);
    } else {
      setMovies([...movies, movieToAdd]);
      setMovie(null);
      setQuery('');
      setError(null);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSearch}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': error })}
              onChange={event => {
                setError('');
                setQuery((event.target as HTMLInputElement).value);
              }}
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              {movie ? `Search again` : `Find a movie`}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie(movie)}
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
