import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

type Props = {
  setMovie: React.Dispatch<React.SetStateAction<Movie[]>>;
};

function mapMovieDataToMovie(data: MovieData): Movie {
  return {
    title: data.Title,
    description: data.Plot,
    imgUrl:
      data.Poster !== 'N/A'
        ? data.Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview',
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  };
}

function isMovieData(data: MovieData | ResponseError): data is MovieData {
  return (data as ResponseError).Response !== 'False';
}

const FindMovieComponent: React.FC<Props> = ({ setMovie }) => {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query) {
      return;
    }

    setLoading(true);

    setError('');

    setCurrentMovie(null);

    getMovie(query)
      .then(data => {
        if (!isMovieData(data)) {
          setError(data.Error);

          return;
        } else {
          setCurrentMovie(mapMovieDataToMovie(data));
        }
      })
      .catch(() => setError('Unexpected error'))
      .finally(() => setLoading(false));
  };

  const handleAdd = () => {
    if (currentMovie) {
      setMovie(list =>
        list.find(m => m.imdbId === currentMovie.imdbId)
          ? list
          : [...list, currentMovie],
      );
      setCurrentMovie(null);
      setQuery('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={event => handleSubmit(event)}>
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
              className={classNames('input', { 'is-danger': error })}
              onChange={event => {
                setQuery(event.target.value);
                setError('');
              }}
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
              disabled={!query}
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
            >
              Find a movie
            </button>
          </div>

          {currentMovie && (
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
      </form>

      {currentMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={currentMovie} />
        </div>
      )}
    </>
  );
};

export const FindMovie = React.memo(FindMovieComponent);
