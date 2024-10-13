import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
}

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [titleQuery, setTitleQuery] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddButtonVisible, setIsAddButtonVisible] = useState(false);
  const [searchingFirstTime, setSearchingFirstTime] = useState(true);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasError(false);
    setTitleQuery(event.target.value);
  };

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(titleQuery)
      .then(responce => {
        if ('Error' in responce) {
          return setHasError(true);
        }

        const newMovie: Movie = {
          title: responce.Title,
          description: responce.Plot,
          imgUrl: responce.Poster,
          imdbUrl: 'https://www.imdb.com/title/' + responce.imdbID,
          imdbId: responce.imdbID,
        };

        setIsAddButtonVisible(true);
        setMovie(newMovie);
        setSearchingFirstTime(false);
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddMovie = () => {
    if (movie) {
      setMovies(currentMovies => {
        if (currentMovies.find(({ imdbId }) => imdbId === movie.imdbId)) {
          return currentMovies;
        }

        return [...currentMovies, movie];
      });
    }

    setTitleQuery('');
    setMovie(null);
    setIsAddButtonVisible(false);
    setSearchingFirstTime(true);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmitForm}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>
          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              value={titleQuery}
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': hasError,
              })}
              onChange={handleInputChange}
            />
          </div>

          {hasError && (
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
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!titleQuery}
            >
              {searchingFirstTime ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {isAddButtonVisible && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && !hasError && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
