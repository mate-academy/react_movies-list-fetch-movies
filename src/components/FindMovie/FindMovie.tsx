import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  searchText: string;
  setSearchText: (text: string) => void;
  reset: () => void;
  addMovie: (movie: Movie) => void;
};

const defaultPicture = (
  'https://via.placeholder.com/360x270.png?text=no%20preview'
);

export const FindMovie: React.FC<Props> = ({
  searchText,
  setSearchText,
  reset,
  addMovie,
}) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const eventChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    if (value.trim().length === 0) {
      setSearchText('');

      return;
    }

    value.trim();
    setSearchText(value);
    setIsError(false);
  };

  const handleClick = (foundMovie: Movie) => {
    reset();
    addMovie(foundMovie);
    setMovie(null);
  };

  const searchMovie = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const movieFromServer = await getMovie(searchText);

    if ('Error' in movieFromServer) {
      setIsError(true);
    } else {
      const {
        Title,
        Plot,
        Poster,
        imdbID,
      } = movieFromServer;

      const newMovie = {
        title: Title,
        description: Plot,
        imgUrl: Poster !== 'N/A'
          ? Poster
          : defaultPicture,
        imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        imdbId: imdbID,
      };

      setMovie(newMovie);
    }

    setIsLoading(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={searchMovie}
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
              value={searchText}
              onChange={eventChange}
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
              className={classNames(
                'button is-light',
                {
                  'is-loading': isLoading,
                },
              )}
              disabled={!searchText}
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
                  handleClick(movie);
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
