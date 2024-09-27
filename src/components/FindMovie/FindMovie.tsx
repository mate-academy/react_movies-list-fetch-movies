import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import classNames from 'classnames';

type Props = {
  onMovies: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onMovies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const changeMovie = (movieFromServer: MovieData): Movie | void => {
    const newMovie: Movie = {
      title: movieFromServer.Title,
      description: movieFromServer.Plot,
      imgUrl:
        movieFromServer.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : movieFromServer.Poster,
      imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
      imdbId: movieFromServer.imdbID,
    };

    if (!newMovie) {
      return;
    }

    setMovie(newMovie);
  };

  const handlerSearchMovie = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(query)
      .then(result => {
        if ('Response' in result && result.Response === 'False') {
          setError(true);
        } else {
          changeMovie(result as MovieData);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError(false);
  };

  const handleAdd = () => {
    if (movie) {
      onMovies(movie);
      setMovie(null);
      setQuery('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handlerSearchMovie}>
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
              className="input"
              value={query}
              onChange={handleQuery}
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
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie && (
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
      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
