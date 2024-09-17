import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';

interface FindMovieProps {
  addMovieToList: (movie: Movie) => void;
}

export const FindMovie: React.FC<FindMovieProps> = ({ addMovieToList }) => {
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, setSearchTriggered] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!query) {
      return;
    }

    setSearchTriggered(true);
    setLoading(true);

    try {
      const findedMovie = await getMovie(query);

      if (findedMovie.Response === 'False') {
        setError(findedMovie.Error); // Set error message from API response
        setMovie(null);
      } else {
        // Ensure findedMovie conforms to the Movie interface
        const movieWithDefaultPoster: Movie = {
          ...findedMovie,
          Poster:
            findedMovie.Poster !== 'N/A'
              ? findedMovie.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${findedMovie.imdbID}/`, // Construct imdbUrl
        };

        setMovie(movieWithDefaultPoster);
        setError(null);
      }
    } catch {
      setError('An unexpected error occurred');
      setMovie(null);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError(null); // Clear error when query changes
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              onChange={handleQueryChange}
              value={query}
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
              className={classNames('button', 'is-light', {
                'is-loading': loading,
              })}
              disabled={query.length === 0}
            >
              {movie ? 'Search again' : 'Find movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  addMovieToList(movie);
                  setQuery('');
                  setMovie(null);
                }}
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
