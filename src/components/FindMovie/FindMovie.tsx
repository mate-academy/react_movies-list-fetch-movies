import React from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MoviesContext } from '../MoviesContext';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

export const FindMovie: React.FC = () => {
  const { movies, foundMovie, setFoundMovie, addMovie } =
    React.useContext(MoviesContext)!;
  const [query, setQuery] = React.useState('');
  const [hasQueryError, setHasQueryError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [resubmit, setResubmit] = React.useState(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasQueryError(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then(result => {
        if ('Response' in result && result.Response === 'False') {
          throw new Error(result.Error);
        }

        const defaultPoster =
          'https://via.placeholder.com/360x270.png?text=no%20preview';
        const movie: Movie = {
          title: result.Title,
          description: result.Plot,
          imgUrl:
            !result.Poster || result.Poster === 'N/A'
              ? defaultPoster
              : result.Poster,
          imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
          imdbId: result.imdbID,
        };

        setFoundMovie(movie);
        setHasQueryError(false);
        setResubmit(true);
      })
      .catch(() => {
        setHasQueryError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddMovie = (movie: Movie) => {
    if (!movies.some(m => m.imdbId === movie.imdbId)) {
      addMovie(movie);
    }

    setFoundMovie(null);
    setQuery('');
    setResubmit(false);
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
              className={`input ${hasQueryError ? 'is-danger' : ''}`}
              value={query}
              onChange={handleQueryChange}
            />
          </div>

          {hasQueryError && (
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
              className={`button is-light${query ? ' has-text-weight-semibold' : ''}${loading ? ' is-loading' : ''}`}
              disabled={!query}
            >
              {resubmit ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie(foundMovie)}
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
