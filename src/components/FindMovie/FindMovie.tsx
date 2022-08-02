import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import './FindMovie.scss';

type Props = {
  onAdd: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasMovie, setHasMovie] = useState(true);
  const [loading, setLoading] = useState(false);

  const convertType = (
    movieFromServer: MovieData | ResponseError,
  ): Movie | null => {
    if ('Title' in movieFromServer) {
      const imdbUrl = `http://www.imdb.com/title/${movieFromServer.imdbID}`;
      const imgUr = 'https://via.placeholder.com/360x270.png?text=no%20preview';
      const newMovie: Movie = {
        title: movieFromServer.Title,
        description: movieFromServer.Plot,
        imgUrl: movieFromServer.Poster || imgUr,
        imdbUrl,
        imdbId: movieFromServer.imdbID,
      };

      return newMovie;
    }

    setHasMovie(false);
    setLoading(false);

    return null;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    getMovie(query).then(newMovie => setMovie(convertType(newMovie)));
  };

  const handleAdd = (movieNew: Movie) => {
    onAdd(movieNew);
    setMovie(null);
    setQuery('');
    setLoading(false);
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
              className="input is-dander"
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setHasMovie(true);
              }}
            />
          </div>

          {!hasMovie && (
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
                'button is-light',
                { 'is-loading': !movie && loading },
              )}
              disabled={!query}
            >
              {movie
                ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  handleAdd(movie);
                }}
              >
                Add to the list
              </button>
            )}
          </div>
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
