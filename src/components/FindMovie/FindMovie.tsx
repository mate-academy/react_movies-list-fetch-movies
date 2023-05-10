/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

const BASE_IMDB_LINK = 'https://www.imdb.com/title/';
// eslint-disable-next-line max-len
const DEFAULT_IMAGE_LINK = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  onAdd: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = React.memo(({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [isMovieError, setIsMovieError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const findMovie = async () => {
    const preparedQuery = query.toLowerCase().trim();
    const movieData = await getMovie(preparedQuery);

    if ('Error' in movieData) {
      setIsMovieError(true);
      setFoundMovie(null);
      setIsLoading(false);
    } else {
      const imgUrl = movieData.Poster !== 'N/A'
        ? movieData.Poster
        : DEFAULT_IMAGE_LINK;

      const movie: Movie = {
        title: movieData.Title,
        description: movieData.Plot,
        imgUrl,
        imdbUrl: `${BASE_IMDB_LINK}${movieData.imdbID}`,
        imdbId: movieData.imdbID,
      };

      if (foundMovie?.imdbId !== movie.imdbId) {
        setFoundMovie(movie);
      }

      setIsLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    findMovie();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsMovieError(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {isMovieError && (
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
              disabled={isMovieError || query.length === 0}
            >
              Find a movie
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  onAdd(foundMovie);
                  setFoundMovie(null);
                  setQuery('');
                }}
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
});
