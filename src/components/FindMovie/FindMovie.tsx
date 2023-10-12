import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleAddMovie = () => {
    if (!movies.some(item => item.imdbId === movie?.imdbId) && movie) {
      setMovies([...movies, movie]);
    }

    setMovie(null);
    setQuery('');
    setErrorMessage(false);
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);

    getMovie(query)
      .then((data) => {
        if ('Title' in data) {
          const movieData: Movie = {
            title: data.Title,
            description: data.Plot,
            imgUrl: data.Poster,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          };

          setMovie(movieData);
        } else {
          setErrorMessage(true);
        }
      })
      .finally(() => setLoading(false));
  };

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(false);
    setQuery(event.target.value);
  };

  return (
    <>
      <form className="find-movie" onSubmit={onSubmit}>
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
              className={cn('input', { 'is-danger': errorMessage })}
              onChange={handleQueryChange}
            />
          </div>

          {errorMessage && (
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
              className={cn('button is-light', { 'is-loading': loading })}
              disabled={!query}
              onClick={onSubmit}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {!loading && movie && (
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
      {!loading && movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
