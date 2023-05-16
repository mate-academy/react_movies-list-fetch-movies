import React, { ChangeEvent, FC, useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { DEFAULT_PREVIEW } from '../../default_preview_url';

type Props = {
  movies: Movie[],
  onAddMovie: (movies: Movie[]) => void,
};

export const FindMovie: FC<Props> = ({ movies, onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim()) {
      setError('Please enter a movie title');

      return;
    }

    setLoading(true);

    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          setError(response.Error);

          return;
        }

        const poster = response.Poster === 'N/A'
          ? DEFAULT_PREVIEW : response.Poster;

        const searchedMovie = {
          title: response.Title,
          description: response.Plot,
          imgUrl: poster,
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          imdbId: response.imdbID,
        };

        setMovie(searchedMovie);
      })
      .finally(() => setLoading(false));
  };

  const handleAddMovie = () => {
    if (movie && !movies.find(({ imdbId }) => imdbId === movie.imdbId)) {
      const updatedMovies = [...movies, movie];

      onAddMovie(updatedMovies);
    }

    setMovie(null);
    setQuery('');
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
              className="input is-dander"
              value={query}
              onChange={handleSearch}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
            </p>
          )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light',
                { 'is-loading': loading })}
              disabled={!query}
            >
              {movie ? 'Search again' : 'Find a movie'}
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
