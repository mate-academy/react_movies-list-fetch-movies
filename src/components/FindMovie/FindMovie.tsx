import React from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = React.useState('');
  const [hasError, setHasError] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [movie, setMovie] = React.useState<Movie | null>(null);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasError(false);
  };
  // console.log(query);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    getMovie(query)
      .then((data: MovieData | ResponseError) => {
        if (data && 'Error' in data) {
          setHasError(true);
          setMovie(null);
        } else {
          setHasError(false);

          const DEFAULT_POSTER =
            'https://via.placeholder.com/360x270.png?text=no%20preview';
          const newMovie: Movie = {
            title: data.Title,
            description: data.Plot,
            imgUrl: data.Poster === 'N/A' ? DEFAULT_POSTER : data.Poster,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          };

          setMovie(newMovie);
        }
      })
      .finally(() => setLoading(false));
  };

  const addMovieToList = () => {
    addMovie(movie as Movie);
    setQuery('');
    setMovie(null);
    setHasError(false);
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
              value={query}
              onChange={handleInput}
              className={classNames('input', { 'is-danger': hasError })}
            />
          </div>

          {hasError && (
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
                'is-loading': loading,
              })}
              disabled={!query}
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
                onClick={addMovieToList}
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
