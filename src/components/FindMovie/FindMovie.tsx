import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  findMovie: (movie: Movie | null) => void;
  newMovie: Movie | null;
  onAddMovie: () => void;
  query: string;
  setQuery: (value: string) => void;
};

export const FindMovie: React.FC<Props> = ({
  findMovie,
  newMovie,
  onAddMovie,
  query,
  setQuery,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      const result = await getMovie(query);

      if ('Response' in result && result.Response === 'False') {
        findMovie(null);
        setErrorMessage(true);
      } else {
        const movieData = result as MovieData;

        const movie: Movie = {
          title: movieData.Title,
          description: movieData.Plot,
          imgUrl: movieData.Poster,
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}/`,
          imdbId: movieData.imdbID,
        };

        findMovie(movie);
      }
    } catch {
      setErrorMessage(true);
      findMovie(null);
    } finally {
      setIsLoading(false);
    }
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
              className={`input ${errorMessage ? 'is-danger' : ''} `}
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setErrorMessage(false);
              }}
            />
          </div>

          {errorMessage ? (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          ) : (
            ''
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              disabled={!query || isLoading}
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
            >
              Find a movie
            </button>
          </div>

          {newMovie ? (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAddMovie}
              >
                Add to the list
              </button>
            </div>
          ) : null}
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
