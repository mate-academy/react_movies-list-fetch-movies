import React from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  movies: Movie[];
  query: string;
  loading: boolean;
  currentMovie: Movie | undefined;
  error: boolean;
  setCurrentMovie: (value: Movie | undefined) => void;
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  setQuery: (value: string) => void;
  setLoading: (value: boolean) => void;
  setError: (value: boolean) => void;
}

export const FindMovie: React.FC<Props> = ({
  movies,
  query,
  loading,
  currentMovie,
  error,
  setMovies,
  setQuery,
  setCurrentMovie,
  setLoading,
  setError,
}) => {
  const clear = () => {
    setError(false);
    setQuery('');
    setCurrentMovie(undefined);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then(movie => {
        return movie;
      })
      .then(movie => {
        if ('Error' in movie) {
          setError(true);

          return;
        }

        setCurrentMovie({
          title: movie.Title,
          description: movie.Plot,
          imgUrl:
            movie.Poster && movie.Poster !== 'N/A'
              ? movie.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
          imdbId: movie.imdbID,
        });
      })
      .catch(() => 'no movies found')
      .finally(() => setLoading(false));
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
              className={`input ${error ? 'is-danger' : ''}`}
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setError(false);
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
              className={`button is-light ${loading ? 'is-loading' : ''}`}
              disabled={loading || (query ? false : true)}
            >
              Find a movie
            </button>
          </div>

          {currentMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={e => {
                  e.preventDefault();
                  if (
                    movies.find(movie => movie.imdbId === currentMovie.imdbId)
                  ) {
                    clear();

                    return;
                  }

                  setMovies(prev => [...prev, currentMovie]);
                  clear();
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {currentMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={currentMovie} />
        </div>
      )}
    </>
  );
};
