import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  movies: Movie[];
  setMoviesList: (movie: Movie[]) => void;
}

export const FindMovie: React.FC<Props> = ({ movies, setMoviesList }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<boolean>(false);

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          setError(true);
        } else {
          const { Poster, Title, Plot, imdbID } = response;

          setMovie({
            title: Title,
            description: Plot,
            imgUrl: !Poster.includes('https://')
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : Poster,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          });
        }
      })
      .finally(() => setLoading(false));
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    setQuery(event.target.value);
    setError(false);
  };

  const onAddMovieButton = (): void => {
    setQuery('');
    setMovie(null);

    if (movie) {
      const condition = movies.some(
        existMovie => existMovie.imdbId === movie.imdbId,
      );

      if (condition) {
        return;
      }

      setMoviesList([...movies, movie]);
    }
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
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': error })}
              value={query}
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
              className={classNames('button', 'is-light', {
                'is-loading': loading,
              })}
              disabled={!query}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {!!movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAddMovieButton}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {!!movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
