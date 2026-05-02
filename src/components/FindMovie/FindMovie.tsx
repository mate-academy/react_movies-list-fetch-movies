import React, { useCallback, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';

type Props = {
  setMovies: (movies: Movie[]) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [value, setValue] = useState('');
  const [loading, isLoading] = useState(false);
  const [showError, setShowError] = useState<ResponseError | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);

  const findMovie = useCallback((newValue: string) => {
    getMovie(newValue)
      .then((response: MovieData | ResponseError) => {
        if (response && 'imdbID' in response) {
          const validMovie: Movie = {
            title: response.Title,
            description: response.Plot,
            imgUrl:
              response.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : response.Poster,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          };

          setMovie(validMovie);
        } else {
          setShowError(response);
        }
      })
      .finally(() => {
        isLoading(false);
      });
  }, []);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={e => {
          e.preventDefault();
          isLoading(true);
          findMovie(value);
        }}
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
                'is-danger': showError,
              })}
              value={value}
              onChange={e => {
                setValue(e.target.value);
                setShowError(null);
              }}
            />
          </div>

          {showError && (
            <p className="help is-danger" data-cy="errorMessage">
              {showError.Error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              disabled={value ? false : true}
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
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
                onClick={() => {
                  const audit: Movie | undefined = movies.find(
                    oldMovie => oldMovie.imdbId === movie.imdbId,
                  );

                  if (!audit) {
                    const newMovies = [...movies, movie];

                    setMovies(newMovies);
                  }

                  setValue('');
                  setMovie(null);
                }}
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
