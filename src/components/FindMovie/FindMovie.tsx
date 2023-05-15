import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { BASE_IMDB_LINK, DEFAULT_IMAGE_LINK } from '../../App.constants';

type Props = {
  onAdd: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = React.memo(({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    const preparedQuery = query.toLowerCase().trim();

    if (preparedQuery.length === 0) {
      setErrorMessage('Movie name can\'t be empty or consist only of spaces');
      setIsLoading(false);

      return;
    }

    const movieData = await getMovie(preparedQuery);

    if ('Error' in movieData) {
      setErrorMessage('Can\'t find a movie with such a title');
      setMovie(null);
      setIsLoading(false);

      return;
    }

    const imgUrl = movieData.Poster !== 'N/A'
      ? movieData.Poster
      : DEFAULT_IMAGE_LINK;

    const tempMovie: Movie = {
      title: movieData.Title,
      description: movieData.Plot,
      imgUrl,
      imdbUrl: `${BASE_IMDB_LINK}${movieData.imdbID}`,
      imdbId: movieData.imdbID,
    };

    if (movie?.imdbId !== tempMovie.imdbId) {
      setMovie(tempMovie);
    }

    setIsLoading(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setErrorMessage('');
  };

  const handleAdd = (movieToAdd: Movie) => {
    onAdd(movieToAdd);
    setMovie(null);
    setQuery('');
  };

  const isAddButtonDisabled = !query.length || !!errorMessage.length;

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

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
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
              disabled={isAddButtonDisabled}
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
                onClick={() => handleAdd(movie)}
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
});
