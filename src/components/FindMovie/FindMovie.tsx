import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

const PREVIEW_IMG = 'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  movies: Movie[];
  setMovies: (prevMovies: (prevMovies: Movie[]) => Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({
  movies,
  setMovies,
}) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  function resetForm() {
    setMovie(null);
    setTitle('');
    setIsError(false);
  }

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setIsError(false);
  };

  const handleAddClick = () => {
    if (movie && !movies.some(m => m.imdbId === movie.imdbId)) {
      setMovies(prevMovies => ([...prevMovies, movie]));
    }

    resetForm();
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);

    getMovie(title)
      .then((response) => {
        if ('Title' in response) {
          const {
            Title, Plot, Poster, imdbID,
          } = response;

          const newMovie: Movie = {
            title: Title,
            description: Plot,
            imgUrl: Poster !== 'N/A' ? Poster
              : PREVIEW_IMG,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          };

          setMovie(newMovie);
        } else {
          setIsError(true);
        }
      })
      .catch(() => setIsError(true))
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFormSubmit}
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
                'is-danger': isError,
              })}
              value={title}
              onChange={handleQueryChange}
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
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              disabled={!title}
            >
              {movie ? 'Search again' : 'Find movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddClick}
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
