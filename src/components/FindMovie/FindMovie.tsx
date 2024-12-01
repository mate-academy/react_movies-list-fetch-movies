import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

type Props = {
  setMovies: (movies: Movie[]) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [value, setValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [isFound, setIsFound] = useState(false);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setError(false);
  };

  const normalizeDataMovie = (r: MovieData) => {
    return {
      title: r.Title,
      description: r.Plot,
      imgUrl:
        r.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : r.Poster,
      imdbUrl: 'https://www.imdb.com/title/' + r.imdbID,
      imdbId: r.imdbID,
    };
  };

  const handleAddMovie = () => {
    const uniqueMovies = movies.every(
      itemMovie => itemMovie?.imdbId !== movie?.imdbId,
    );

    if (uniqueMovies && movie) {
      setMovies([...movies, movie]);
    }

    setValue('');
    setMovie(null);
    setIsFound(false);
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setIsFound(false);

    getMovie(value)
      .then(response => {
        if ('Error' in response) {
          setError(true);
          setMovie(null);

          return;
        }

        setMovie(normalizeDataMovie(response as MovieData));
        setIsFound(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
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
              onChange={handleChangeInput}
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': error })}
              value={value}
            />
          </div>

          {error && (
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
              disabled={!value.trim().length}
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
            >
              Find a movie
            </button>
          </div>
          {isFound && (
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
      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
