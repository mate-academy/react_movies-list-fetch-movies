import React from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';

// eslint-disable-next-line max-len
const defaultPicture = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  onAdd: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({
  onAdd,
}) => {
  const [newMovie, setNewMovie] = React.useState<Movie | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(false);
  const [query, setQuery] = React.useState('');

  const handleAddMovie = () => {
    if (newMovie) {
      onAdd(newMovie);
      setNewMovie(null);
      setQuery('');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(false);
  };

  const handleFindMovie = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(query)
      .then((movie) => {
        if (movie.Response === 'True') {
          setError(false);
          const pictureUrl = movie.Poster === 'N/A'
            ? defaultPicture
            : movie.Poster;

          setNewMovie({
            title: movie.Title,
            description: movie.Plot,
            imgUrl: pictureUrl,
            imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
            imdbId: movie.imdbID,
          });
        }

        if (movie.Response === 'False') {
          setError(true);
          setNewMovie(null);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFindMovie}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>
          <div className="control">
            <input
              type="text"
              data-cy="titleField"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
              value={query}
              onChange={handleChange}
            />
          </div>
          {error && (
            <p
              className="help is-danger"
              data-cy="errorMessage"
            >
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              data-cy="searchButton"
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>
          <div className="control">
            {newMovie && (
              <button
                type="button"
                data-cy="addButton"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>
      {newMovie && (
        <div
          className="container"
          data-cy="previewContainer"
        >
          <MovieCard movie={newMovie} />
        </div>
      )}
    </>
  );
};
