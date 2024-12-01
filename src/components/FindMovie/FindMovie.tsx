import cn from 'classnames';
import React, { useState } from 'react';

import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';

// eslint-disable-next-line max-len
const DEFAULT_PICTURE = 'https://via.placeholder.com/360x270.png?text=no%20preview';

interface Props {
  setMovies: (value: Movie[] | ((prevVar: Movie[]) => Movie[])) => void;
}

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [movieFromServer, setMovieFromServer] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ResponseError | null>(null);
  const [query, setQuery] = useState('');

  const handleFindMovieButton = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    setIsLoading(true);
    getMovie(query)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then((response: any) => {
        if (response.Response === 'False') {
          setError(response);

          return;
        }

        setMovieFromServer({
          title: response.Title,
          description: response.Plot,
          imgUrl: response.Poster === 'N/A'
            ? DEFAULT_PICTURE
            : response.Poster,
          imdbId: response.imdbID,
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        });
      })
      .finally(() => setIsLoading(false));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(null);
  };

  const handleAddMovieToList = () => {
    if (movieFromServer) {
      setMovies(
        (currentMovies: Movie[]) => {
          if (currentMovies.find(
            movie => movie.imdbId === movieFromServer.imdbId,
          )) {
            return currentMovies;
          }

          return [...currentMovies, movieFromServer];
        },
      );

      setMovieFromServer(null);
      setQuery('');
    }
  };

  return (
    <>
      <form className="find-movie">
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
              className={cn(
                'input',
                { 'is-danger': error },
              )}
              value={query}
              onChange={handleInputChange}
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
              className={cn(
                'button is-light',
                { 'is-loading': isLoading },
              )}
              onClick={handleFindMovieButton}
              disabled={query === ''}
            >
              Find a movie
            </button>
          </div>
          {movieFromServer && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovieToList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movieFromServer && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={movieFromServer} />
        </div>
      )}
    </>
  );
};
