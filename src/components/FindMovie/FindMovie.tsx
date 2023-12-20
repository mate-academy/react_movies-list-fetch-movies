import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { useMovies } from '../../providers/MovieProvider';
import { MovieCard } from '../MovieCard';
import { ResponseError } from '../../types/ReponseError';

const DEFAULT_PICTURE
  = 'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC = () => {
  const { addMovie } = useMovies();
  const [movieFromServer, setMovieFromServer] = useState<Movie | null>(null);
  const [query, setQuery] = useState<string>('');
  const [error, setError] = useState<ResponseError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(null);
  };

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
          imgUrl: response.Poster === 'N/A' ? DEFAULT_PICTURE : response.Poster,
          imdbId: response.imdbID,
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        });
      })
      .finally(() => setIsLoading(false));
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
              value={query}
              onChange={handleInputChange}
              className={cn('input', { 'is-danger': 'error' })}
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
              className={cn('button is-light', { 'is-loading': isLoading })}
              onClick={handleFindMovieButton}
              disabled={query === ''}
            >
              Find a movie
            </button>
          </div>

          { movieFromServer && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onSubmit={() => addMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      { movieFromServer && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movieFromServer} />
        </div>
      )}
    </>
  );
};
