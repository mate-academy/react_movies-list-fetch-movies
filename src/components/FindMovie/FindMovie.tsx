import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import classNames from 'classnames';

export const FindMovie: React.FC = ({ onChangeMovies }) => {
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);

  function isMovieData(data): data is MovieData {
    return (
      typeof data === 'object' &&
      data !== null &&
      'Poster' in data &&
      'Title' in data &&
      'Plot' in data &&
      'imdbID' in data
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    getMovie(query)
      .then((movieData: MovieData | ResponseError) => {
        if (isMovieData(movieData)) {
          setMovie({
            title: movieData.Title,
            description: movieData.Plot,
            imgUrl:
              movieData.Poster.startsWith('http://') ||
                movieData.Poster.startsWith('https://')
                ? movieData.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
            imdbId: movieData.imdbID,
          });
        } else {
          setErrorMessage(movieData.Error);
        }
      })
      .catch()
      .finally(() => {
        setLoading(false);
      });
  };

  const handleAddToList = () => {
    if (!movie) {
      return;
    }

    onChangeMovies((oldMovies: Movie[]) => {
      if (oldMovies.find(m => m.imdbId === movie?.imdbId)) {
        return oldMovies;
      } else {
        return [...oldMovies, movie];
      }
    });
    setQuery('');
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
              className={classNames('input', {
                'is-danger': errorMessage,
              })}
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setErrorMessage('');
                setMovie(null);
              }}
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
              className={classNames('button', 'is-light', {
                'is-loading': loading,
              })}
              disabled={query.trim().length === 0}
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
                onClick={handleAddToList}
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
