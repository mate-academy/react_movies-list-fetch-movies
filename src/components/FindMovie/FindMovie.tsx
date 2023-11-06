import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (mov: Movie) => void;
};

export const FindMovie: React.FC<Props> = React.memo(({ addMovie }) => {
  const [value, setValue] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [messageError, setMessageError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchAgain, setSearchAgain] = useState<boolean>(false);
  const handleMovie = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      getMovie(value)
        .then((response) => {
          if ('Error' in response) {
            setMessageError(true);

            return;
          }

          const data = response as MovieData;
          const findMovie: Movie = {
            title: data.Title,
            description: data.Plot,
            imgUrl: data.Poster,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          };

          setMovie(findMovie);
        })
        .finally(() => setIsLoading(false));
    }, 500);
    setSearchAgain(true);
  };

  const handleAddMovie = () => {
    if (movie) {
      addMovie(movie);
      setValue('');
      setMovie(null);
      setSearchAgain(false);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleMovie}>
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
              className={cn('input', {
                'is-danger': messageError,
              })}
              value={value}
              onChange={event => {
                setValue(event.currentTarget.value);
                setMessageError(false);
              }}
            />
          </div>
          {messageError && (
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
              disabled={!value}
            >
              {searchAgain ? 'Search again' : 'Find a movie'}
            </button>
          </div>
          {movie && !messageError && (
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
      {movie && !messageError && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
});
