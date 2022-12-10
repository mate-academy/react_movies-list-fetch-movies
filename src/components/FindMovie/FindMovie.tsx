import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { ResponseError } from '../../types/ReponseError';

type Props = {
  movies: Movie[],
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [value, setValue] = useState<string>('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState(false);

  const normoliseData = ({
    Title,
    Plot,
    Poster,
    imdbID,
  }: MovieData) => ({
    title: Title,
    description: Plot,
    imgUrl: Poster,
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    imdbId: imdbID,
  });

  const handleResult = (response: MovieData | ResponseError) => {
    if ('Error' in response) {
      setHasError(true);
    } else {
      setFoundMovie(normoliseData(response));
    }
  };

  const reset = () => {
    setFoundMovie(null);
    setValue('');
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setValue(e.target.value);
  };

  const handleClickFind = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    e.preventDefault();

    setIsLoading(true);

    getMovie(value)
      .then((result) => handleResult(result))
      .finally(() => setIsLoading(false));
  };

  const handleClickAdd = () => {
    if (!foundMovie) {
      return;
    }

    const copy = movies.find((movie) => movie.imdbId === foundMovie.imdbId);

    if (copy) {
      reset();

      return;
    }

    setMovies((currentMovies: Movie[]) => [
      ...currentMovies,
      foundMovie,
    ]);
  };

  useMemo(() => reset(), [movies]);

  useMemo(() => setHasError(false), [value]);

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
              value={value}
              onChange={handleChange}
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
              className={classNames(
                'button is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!value}
              onClick={handleClickFind}
            >
              {foundMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleClickAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
