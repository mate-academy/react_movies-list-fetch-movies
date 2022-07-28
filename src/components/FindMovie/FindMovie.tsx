import React, { FormEvent, useEffect, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  setQuery: (value: string) => void,
  query: string,
  addMovie: (newMovie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ setQuery, query, addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [showMovie, setShowMovie] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const buttonText = showMovie ? 'Search again' : 'Find a movie';

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(query).then((movieFromServer: MovieData | ResponseError) => {
      if ('Response' in movieFromServer) {
        setError(true);
        setIsLoading(false);
      }

      if ('Title' in movieFromServer) {
        setMovie({
          title: movieFromServer.Title,
          description: movieFromServer.Plot,
          imgUrl: movieFromServer.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : movieFromServer.Poster,
          imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
          imdbId: movieFromServer.imdbID,
        });

        setShowMovie(true);
        setError(false);
        setIsLoading(false);
      }
    });
  };

  const reset = () => {
    setError(false);
    setShowMovie(false);
    setQuery('');
  };

  const onMovie = () => {
    if (movie) {
      addMovie(movie);
      reset();
    }
  };

  useEffect(() => {
    setError(false);
  }, [query]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onSubmit}
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
              onChange={(event) => setQuery(event.target.value)}
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={!query}
            >
              {buttonText}
            </button>
          </div>

          {showMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {showMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
