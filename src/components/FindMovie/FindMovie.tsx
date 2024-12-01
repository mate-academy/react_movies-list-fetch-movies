import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getPreparedData } from '../../services/preparedData';

type Props = {
  moviesList: Movie[],
  onAdd: (m: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({
  moviesList,
  onAdd = () => { },
}) => {
  const [searchTitle, setSearchTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsloading] = useState(false);

  const handleFindMovie = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsloading(true);

    getMovie(searchTitle.toLowerCase().trim())
      .then((data) => {
        if ('Error' in data) {
          setErrorMessage('Can\'t find a movie with such a title');
        } else {
          setMovie(getPreparedData(data));
          setErrorMessage('');
        }
      })
      .finally(() => setIsloading(false));
  };

  const handleAddMovie = () => {
    if (movie) {
      if (moviesList.find(m => m.imdbId === movie.imdbId)) {
        setSearchTitle('');
        setMovie(null);

        return;
      }

      onAdd(movie);
      setSearchTitle('');
      setMovie(null);
    }
  };

  const handleSearchValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTitle(event.target.value);
    setErrorMessage('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFindMovie}
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
              className={classNames(
                'input',
                { 'is-danger': errorMessage },
              )}
              value={searchTitle}
              onChange={handleSearchValue}
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
              disabled={!searchTitle}
              className={classNames(
                'button is-light',
                { 'is-loading': isLoading },
              )}
            >
              Find a movie
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

      {!!movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
