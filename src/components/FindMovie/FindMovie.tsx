import React, { useCallback, useMemo, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  onMoviesChange: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onMoviesChange }) => {
  const [title, setTitle] = useState('');
  const [chosenMovie, setChosenMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  // eslint-disable-next-line no-console
  console.log(chosenMovie);

  const deafultImage = useMemo(() => {
    return 'https://via.placeholder.com/360x270.png?text=no%20preview';
  }, []);

  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setHasError(false);
      setTitle(event.target.value);
    },
    [],
  );

  const handleSubmitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const resultTitle = title.toLowerCase().trim();

    setIsLoading(true);

    getMovie(resultTitle)
      .then((data) => {
        if ('Error' in data) {
          throw new Error();
        }

        return data;
      })
      .then(({
        Poster, Title, Plot, imdbID,
      }: MovieData) => {
        setChosenMovie({
          title: Title,
          description: Plot,
          imgUrl: Poster === 'N/A' ? deafultImage : Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        });
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddMovie = () => {
    if (chosenMovie) {
      onMoviesChange(chosenMovie);
      setTitle('');
      setChosenMovie(null);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmitSearch}>
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
              className={classNames('input', {
                'is-danger': hasError,
              })}
              value={title}
              onChange={handleTitleChange}
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!title}
            >
              {chosenMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {chosenMovie && (
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

      {chosenMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={chosenMovie} />
        </div>
      )}
    </>
  );
};
