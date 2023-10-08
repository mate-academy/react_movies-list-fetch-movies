import React, { useState } from 'react';
import classNames from 'classnames';
import { Movie } from './types/Movie';
import './FindMovie.scss';
import { MovieCard } from './components/MovieCard';
import { getMovie } from './api';
import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ResponseError';


type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({
  addMovie,
}) => {
  const [title, setTitle] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState<ResponseError | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setIsError(null);
  };

  const handleSearchMovie = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    getMovie(title.trim())
      .then((response) => {
        if ('Response' in response && response.Response === 'False') {
          setIsError(response);
          setMovie(null);
        } else {
          const res = response as MovieData;

          const newMovie: Movie = {
            title: res.Title,
            description: res.Plot || '',
            imgUrl: res.Poster !== 'N/A'
              ? res.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
            imdbId: res.imdbID || '',
          };

          setMovie(newMovie);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddMovie = () => {
    if (movie) {
      addMovie(movie);
    }

    setTitle('');
    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSearchMovie}
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
              className={classNames('input', {
                'is-danger': isError,
              })}
              value={movie?.title}
              onChange={handleTitleChange}
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
              className={classNames('button', {
                'is-light': !loading,
                'is-loading': loading,
              })}
              disabled={!title}
              onClick={handleAddMovie}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                // onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
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
