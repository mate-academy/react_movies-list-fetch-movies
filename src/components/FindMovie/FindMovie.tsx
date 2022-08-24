import React, { useCallback, useState } from 'react';
import { Loader } from '../Loader';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';

type Props = {
  onAdd: (_:Movie) => void;
  onClear: () => void;
  isDisabled: boolean;
};

export const FindMovie: React.FC<Props> = ({
  onAdd, onClear, isDisabled,
}) => {
  const [quary, setQuary] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);

  const movieFind = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(quary).then(response => {
      if ('Error' in response) {
        setHasError(true);
      } else {
        setFoundMovie({
          title: response.Title,
          description: response.Plot,
          imgUrl: response.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : response.Poster,
          imdbUrl: `https://imdb.com/title${response.imdbID}`,
          imdbId: response.imdbID,
        });
      }
    }).finally(() => setIsLoading(false));
  }, [quary, getMovie]);

  const handleQuary = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setHasError(false);
      setQuary(event.currentTarget.value);
    }, [quary],
  );

  const addToList = () => {
    if (foundMovie) {
      onAdd(foundMovie);
    }

    setFoundMovie(null);
    setQuary('');
    setHasError(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={movieFind}
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
              value={quary}
              onChange={handleQuary}
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
              className="button is-light"
              disabled={quary.length === 0}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {foundMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                disabled={(foundMovie === null)}
                onClick={addToList}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
        <form className="control">
          {!isDisabled && (
            <button
              data-cy="addButton"
              type="submit"
              className="button is-primary"
              onClick={onClear}
              disabled={isDisabled}
            >
              Clear list
            </button>
          )}
        </form>
      </form>

      <div className="container" data-cy="previewContainer">
        {foundMovie && (<h2 className="title">Preview</h2>)}
        {isLoading && <Loader />}
        {foundMovie && (!isLoading && <MovieCard movie={foundMovie} />)}
      </div>
    </>
  );
};
