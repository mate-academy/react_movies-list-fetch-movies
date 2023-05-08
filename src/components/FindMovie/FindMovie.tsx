import React, { ChangeEvent, FormEvent, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

interface Props {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
}

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          setError(true);

          return;
        }

        setMovie({
          title: response.Title,
          description: response.Plot,
          imgUrl: response.Poster !== 'N/A'
            ? response.Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          imdbId: response.imdbID,
        });
      })
      .finally(() => setLoading(false));
  };

  const handleClick = () => {
    if (movie === null) {
      return;
    }

    if (!movies.some(film => film.imdbId === movie.imdbId)) {
      setMovies([...movies, movie]);
    }

    setMovie(null);
    setQuery('');
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className="input is-dander"
              value={query}
              onChange={handleChange}
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
                'is-loading': loading,
              })}
              disabled={!query}
            >
              {(!movie)
                ? 'Find a movie'
                : 'Search again'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleClick}
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
