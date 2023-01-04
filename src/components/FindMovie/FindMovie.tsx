import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

const defaultMovie: Movie = {
  title: '',
  description: '',
  imgUrl: '',
  imdbUrl: '',
  imdbId: '',
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [inputValue, setInputValue] = useState('');
  const [isResponseError, setIsResponseError] = useState(false);
  const [movie, setMovie] = useState<Movie>(defaultMovie);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setIsResponseError(false);
  };

  const onFindClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setIsLoading(true);

    try {
      const response: MovieData | ResponseError = await getMovie(inputValue);

      if ('Error' in response) {
        setIsResponseError(true);
        setIsLoading(false);

        return;
      }

      const movieImdbUrl = `https://www.imdb.com/title/${response.imdbID}`;

      const movieFromServer = {
        title: response.Title,
        description: response.Plot,
        imgUrl: response.Poster !== 'N/A'
          ? response.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: movieImdbUrl,
        imdbId: response.imdbID,
      };

      setMovie(movieFromServer);
      setIsInitialized(true);
    } catch (error) {
      setIsLoading(false);
      setMovie(defaultMovie);
      setIsInitialized(false);
    } finally {
      setIsLoading(false);
    }
  };

  const onAddClick = () => {
    setInputValue('');
    setIsInitialized(false);
    onAddMovie(movie);
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
              className="input is-dander"
              value={inputValue}
              onChange={onInputChange}
            />
          </div>

          {isResponseError && (
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
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              onClick={onFindClick}
              disabled={!inputValue}
            >
              Find a movie
            </button>
          </div>

          {isInitialized && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAddClick}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {isInitialized && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
