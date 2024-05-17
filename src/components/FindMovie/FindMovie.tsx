import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ReponseError';

const DEFAULT_POSTER =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

interface FindMovieProps {
  onAddMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<FindMovieProps> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setMovie(null);

    getMovie(query)
      .then((response: ResponseError | MovieData) => {
        if ('Error' in response) {
          setErrorMessage(response.Error);
          setMovie(null);
        } else {
          const normalizedMovie: Movie = {
            title: response.Title,
            description: response.Plot,
            imgUrl:
              response.Poster !== 'N/A' ? response.Poster : DEFAULT_POSTER,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}/`,
            imdbId: response.imdbID,
          };

          setMovie(normalizedMovie);
          setErrorMessage('');
        }
      })
      .catch(() => {
        setErrorMessage('Can&apos;t find a movie with such a title');
        setMovie(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    setIsButtonDisabled(value.trim() === '');
    setErrorMessage('');
  };

  const handleAddMovie = () => {
    if (movie) {
      onAddMovie(movie);
      setMovie(null);
      setQuery('');
      setIsButtonDisabled(true);
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
              value={query}
              onChange={handleInputChange}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': errorMessage })}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', { 'is-loading': isLoading })}
              disabled={isButtonDisabled || isLoading}
            >
              {movie ? 'Search Again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movie && (
        <>
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </div>
        </>
      )}
    </>
  );
};
