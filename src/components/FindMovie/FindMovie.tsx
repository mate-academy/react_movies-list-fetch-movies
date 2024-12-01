import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setQuery(event.target.value.trimStart());
  };

  const handleSubmit = () => {
    setLoading(true);
    getMovie(query)
      .then((data) => {
        if ('Response' in data && data.Response === 'False') {
          // eslint-disable-next-line no-console
          console.log(data.Error);
          setMovie(null);
          setIsError(true);
        } else {
          const movieData = data as MovieData;

          setIsError(false);
          setMovie({
            title: movieData.Title,
            description: movieData.Plot,
            imgUrl: movieData.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : movieData.Poster,
            imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
            imdbId: movieData.imdbID,
          });
        }
      })
      .finally(() => setLoading(false));
  };

  const handleQuerySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSubmit();
  };

  const handleAddingMovieClick = () => {
    if (movie) {
      onAddMovie(movie);
      setQuery('');
      setMovie(null);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleQuerySubmit}
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
              value={query}
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
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {!isError && !!movie && !loading && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddingMovieClick}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {!isError && !!movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
