import classNames from 'classnames';
import React, { FormEvent, useEffect, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  addMovies: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, addMovies }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<ResponseError | null>(null);

  const defaultPicture =
    'https://via.placeholder.com/360x270.png?text=no%20preview';
  const titleEmpty = title.trim().length === 0;

  useEffect(() => {
    setIsError(null);
  }, [title]);

  const findMovie = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (titleEmpty) {
      return;
    }

    setIsLoading(true);

    getMovie(title)
      .then(data => {
        if ('Error' in data) {
          setIsError(data);
          setMovie(null);
        } else {
          const newMovie = {
            title: data.Title,
            description: data.Plot,
            imgUrl: data.Poster !== 'N/A' ? data.Poster : defaultPicture,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          };

          setMovie(newMovie);
        }
      })
      .catch(error => setIsError(error))
      .finally(() => setIsLoading(false));
  };

  const resetForm = () => {
    setTitle('');
    setMovie(null);
    setIsError(null);
  };

  const addToListMovie = (addMovie: Movie) => {
    const duplicate = movies.find(
      currentMovie => currentMovie.imdbId === addMovie.imdbId,
    );

    if (duplicate) {
      resetForm();
    } else {
      addMovies(addMovie);
      resetForm();
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={findMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={title}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': titleEmpty,
              })}
              onChange={event => setTitle(event.target.value)}
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={titleEmpty}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addToListMovie(movie)}
              >
                Add to the list
              </button>
            </div>
          )}
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
