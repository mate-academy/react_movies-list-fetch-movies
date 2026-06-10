import React, { useCallback, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import classNames from 'classnames';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

interface Props {
  handleAddMovie: (newMovie: Movie) => void;
}

function isMovieData(data: MovieData | ResponseError): data is MovieData {
  return data && 'imdbID' in data;
}

export const FindMovie: React.FC<Props> = ({ handleAddMovie }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEmptyError, setIsEmptyError] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);

  const changeQuery = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsEmptyError(false);
  }, []);

  const normalizeMovie = useCallback(
    (movieData: MovieData): Movie | null => ({
      imdbId: movieData.imdbID,
      title: movieData.Title,
      description:
        movieData.Plot !== 'N/A' ? movieData.Plot : 'No description available.',
      imgUrl:
        movieData.Poster !== 'N/A'
          ? movieData.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
      imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
    }),
    [],
  );

  const searchMovie = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      setIsLoading(true);
      setIsEmptyError(false);

      getMovie(query)
        .then((data: MovieData | ResponseError) => {
          if (isMovieData(data)) {
            setCurrentMovie(normalizeMovie(data));
          } else {
            setCurrentMovie(null);
            setIsEmptyError(true);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [query, normalizeMovie],
  );

  const addMovieButton = useCallback(() => {
    if (currentMovie !== null) {
      handleAddMovie(currentMovie);
    }

    setCurrentMovie(null);
    setIsEmptyError(false);
  }, [handleAddMovie, currentMovie]);

  return (
    <>
      <form className="find-movie" onSubmit={searchMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              value={query}
              placeholder="Enter a title to search"
              className="input is-danger"
              onChange={changeQuery}
            />
          </div>

          {isEmptyError && (
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
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={query === ''}
            >
              Find a movie
            </button>
          </div>

          {currentMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieButton}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {currentMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={currentMovie} />
        </div>
      )}
    </>
  );
};
