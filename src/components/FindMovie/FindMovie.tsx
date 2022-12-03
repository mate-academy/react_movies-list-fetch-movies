import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMoviesList: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMoviesList }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const createNewMovie = (
    title: string,
    plot: string,
    poster: string,
    imdbId: string,
  ) => {
    const newMovie = {
      title,
      description: plot,
      imgUrl: poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : poster,
      imdbUrl: `https://www.imdb.com/title/${imdbId}`,
      imdbId,
    };

    return newMovie;
  };

  const addMovies = async () => {
    const movieFromServer = await getMovie(query);

    setIsLoading(false);

    if ('Error' in movieFromServer) {
      setError(true);
      setIsLoading(false);
    } else {
      const newMovie = createNewMovie(
        movieFromServer.Title,
        movieFromServer.Plot,
        movieFromServer.Poster,
        movieFromServer.imdbID,
      );

      setMovie(newMovie);
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          addMovies();
        }}
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
              className="input is-dander"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError(false);
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
              className={classNames(
                'button is-success',
                { 'is-loading': isLoading },
              )}
              disabled={!query.length}
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
                  setQuery('');
                  addMoviesList(movie);
                  setMovie(null);
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
