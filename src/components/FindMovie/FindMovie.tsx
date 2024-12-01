import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { Movie } from '../../types/Movie';

type Props = {
  movies: Movie[],
  setMovies: (arg: Movie[]) => void,
};

export const FindMovie: React.FC<Props> = ({
  movies,
  setMovies,
}) => {
  const [search, setSearch] = useState('');
  const [response, setResponse]
  = useState<MovieData | ResponseError | {}>({});
  const [previewMovie, setPreviewMovie] = useState<Movie | {}>({});
  const [error, setError] = useState(false);
  const [searchBtn, setSearchBtn] = useState('Find a movie');
  const [loading, setloading] = useState(false);

  const handleSetSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setSearch(event.target.value);
  };

  const handleSubmitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setloading(true);
    getMovie(`[${search}]`)
      .then(setResponse)
      .finally(() => setloading(false));
  };

  useEffect(() => {
    if ('Title' in response) {
      const newFilm = {
        title: response.Title,
        description: response.Plot,
        imgUrl: response.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : response.Poster,
        imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        imdbId: response.imdbID,
      };

      setPreviewMovie(newFilm);
      setSearchBtn('Search again');
    }

    if ('Error' in response) {
      setError(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response]);

  const resetForm = () => {
    setSearch('');
    setResponse({});
    setPreviewMovie({});
  };

  const handleAddMovie = () => {
    if ('imdbId' in previewMovie) {
      if (movies.find(film => film.imdbId === previewMovie.imdbId)) {
        resetForm();
      } else {
        setMovies([...movies, previewMovie]);
        resetForm();
      }
    }

    setSearchBtn('Find a movie');
  };

  return (
    <>
      <form
        onSubmit={handleSubmitForm}
        className="find-movie"
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={search}
              onChange={handleSetSearch}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames(
                'input', {
                  'is-danger': error,
                },
              )}
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
              className={classNames(
                'button', 'is-light', {
                  'is-loading': loading,
                },
              )}
              disabled={!search}
            >
              {searchBtn}
            </button>
          </div>

          {'title' in previewMovie && (
            <div className="control">
              <button
                onClick={handleAddMovie}
                data-cy="addButton"
                type="button"
                className="button is-primary"
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {'title' in previewMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={previewMovie} />
        </div>
      )}
    </>
  );
};
