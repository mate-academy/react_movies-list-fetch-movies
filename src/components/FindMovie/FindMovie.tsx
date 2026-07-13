import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';
import { ResponseError } from '../../types/ReponseError';

const normalizeMovie = (data: MovieData): Movie => ({
  title: data.Title,
  description: data.Plot,
  imgUrl:
    data.Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : data.Poster,
  imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
  imdbId: data.imdbID,
});

const isResponseError = (
  data: MovieData | ResponseError,
): data is ResponseError => {
  return 'Response' in data && data.Response === 'False';
};

interface Props {
  movies: Movie[];
  onAdd: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAdd, movies }) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [findedMovie, setFindedMovie] = useState<Movie | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    setLoading(true);
    setError('');

    getMovie(title)
      .then(result => {
        if (isResponseError(result)) {
          setError(result.Error || 'Movie not found');
          setFindedMovie(null);
        } else {
          setFindedMovie(normalizeMovie(result));
        }
      })
      .catch(() => {
        setError('Unexpected error');
        setFindedMovie(null);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAdd = () => {
    if (!findedMovie) {
      return;
    }

    const isMovieExist = movies.some(
      movie => movie.imdbId === findedMovie.imdbId,
    );

    if (!isMovieExist) {
      onAdd(findedMovie);
    }

    setTitle('');
    setFindedMovie(null);
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
              className={classNames('input', {
                'is-danger': error,
              })}
              value={title}
              onChange={eventInput => {
                setTitle(eventInput.target.value);
                setError('');
              }}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title{' '}
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
              Find a movie
            </button>
          </div>

          {findedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
        {findedMovie && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={findedMovie} />
          </div>
        )}
      </form>
    </>
  );
};
