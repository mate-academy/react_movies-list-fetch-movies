import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  const loadMovieData = async () => {
    const loadedData = await getMovie(query) as MovieData;

    if (Object.hasOwn(loadedData, 'Error')) {
      setIsErrorMessage(true);
      setMovie(null);
    } else {
      const foundMovie = {
        title: loadedData.Title,
        description: loadedData.Plot,
        imgUrl: loadedData.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : loadedData.Poster,
        imdbUrl: `https://www.imdb.com/title/${loadedData.imdbID}`,
        imdbId: loadedData.imdbID,
      };

      setMovie(foundMovie);
    }

    setIsLoading(false);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setIsErrorMessage(false);
    loadMovieData();
  };

  const handleChangeInput = (value: string) => {
    setQuery(value);
    setIsErrorMessage(false);
  };

  const saveMovie = () => {
    if (movie) {
      addMovie(movie);
    }

    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSearch}
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
                'is-danger': isErrorMessage,
              })}
              value={query}
              onChange={(event) => handleChangeInput(event.target.value)}
            />
          </div>

          {isErrorMessage && (
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
              disabled={query.length === 0}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={saveMovie}
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
