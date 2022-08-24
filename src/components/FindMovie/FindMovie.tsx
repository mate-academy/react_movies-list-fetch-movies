import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  addMovie: (movie: Movie) => void,
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [input, setInput] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const validationInput = input.replace(/\s/g, '');

  const handlerFindMovie = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);
      getMovie(validationInput).then(response => {
        if ('Error' in response) {
          setIsError(true);
        } else {
          setMovie({
            title: response.Title,
            description: response.Plot,
            imgUrl: response.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : response.Poster,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          });
        }
      }).finally(() => setIsLoading(false));
    }, [movie, input],
  );

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handlerFindMovie}
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
              value={input}
              onChange={
                (event) => {
                  setInput(event.target.value);
                  setIsError(false);
                }
              }
            />
          </div>
          {isError && (
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
              className={classNames('button is-light',
                { 'is-loading': isLoading })}
              disabled={validationInput.length === 0}
            >
              Find a movie
            </button>
          </div>
          {movie && isError === false && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  addMovie(movie);
                  setMovie(null);
                  setIsError(false);
                  setInput('');
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {movie && isError === false && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
