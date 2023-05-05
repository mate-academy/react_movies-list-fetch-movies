import classNames from 'classnames';
import React, { ChangeEventHandler, FormEventHandler, useState } from 'react';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

// eslint-disable-next-line max-len
const DEFAULT_PREVIEW = 'https://via.placeholder.com/360x270.png?text=no%20preview';

interface Props {
  onMovieAdd: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [movie, setMovie] = useState<Movie | null>(null);

  const [field, setField] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(field)
      .then((response: MovieData | ResponseError) => {
        if ('Error' in response) {
          setError(response.Error);
        } else {
          const poster = response.Poster === 'N/A'
            ? DEFAULT_PREVIEW : response.Poster;

          const formattedMovie = {
            title: response.Title,
            description: response.Plot,
            imgUrl: poster,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          };

          setMovie(formattedMovie);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setField(event.target.value);
    setError(null);
  };

  const handleMovieAdd = () => {
    if (!movie) {
      return;
    }

    onMovieAdd(movie);
    setField('');
    setMovie(null);
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
              value={field}
              onChange={handleInputChange}
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={field === ''}
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
                onClick={handleMovieAdd}
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
