import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { MoviesList } from '../MoviesList';

export const FindMovie: React.FC = () => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie>();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const loadData = () => {
    setIsLoading(true);

    return getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setErrorMessage(true);
        }

        return data;
      })
      .catch(error => {
        setErrorMessage(true);

        return error;
      })
      .finally(() => setIsLoading(false));
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = await loadData();

    const {
      Title: title,
      imdbID: imdbId,
      Poster,
      Plot: description,
    } = data;

    setMovie({
      title,
      description,
      imgUrl: `${
        Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : Poster
      }`,
      imdbUrl: `https://www.imdb.com/title/${imdbId}`,
      imdbId,
    });
  };

  const addToList = (newMovie: Movie) => {
    setMovies([
      ...movies.filter(oldMovie => oldMovie.imdbId !== newMovie.imdbId),
      newMovie,
    ]);
    setMovie(undefined);
    setQuery('');
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
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              value={query}
              onChange={(e) => {
                setQuery(e.currentTarget.value);
                setErrorMessage(false);
              }}
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={query === ''}
            >
              Find a movie
            </button>
          </div>

          {movie && !errorMessage && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addToList(movie)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && !errorMessage && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
      {movies.length > 0 && <MoviesList movies={movies} />}
    </>
  );
};
