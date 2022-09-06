import React, { FormEvent, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  addNew: (newMovie:Movie) => void,
}

export const FindMovie: React.FC<Props> = (props) => {
  const { addNew } = props;
  const [queryTitle, setQueryTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const clearForm = () => {
    setMovie(null);
    setQueryTitle('');
    setHasError(false);
  };

  const handlerSubmit = (event:FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(queryTitle)
      .then((response) => {
        if ('Error' in response) {
          setHasError(true);
        } else {
          const {
            Poster,
            Title,
            Plot,
            imdbID,
          } = response;

          const newMovie = {
            title: Title,
            description: Plot,
            imgUrl: Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : Poster,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          };

          setMovie(newMovie);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const addButtonHandler = () => {
    if (movie !== null) {
      addNew(movie);
      clearForm();
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handlerSubmit}
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
              value={queryTitle}
              onChange={event => {
                setQueryTitle(event.target.value);
                setHasError(false);
              }}
            />
          </div>
          {hasError
            && (
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
                'button is-light',
                { 'is-loading': isLoading },
              )}
              disabled={queryTitle === ''}
            >
              { hasError
                ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addButtonHandler}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
