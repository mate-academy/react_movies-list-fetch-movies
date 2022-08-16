import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard/MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  addMovieInList: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovieInList }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const createNewMove = (
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

  const addMovie = async () => {
    setLoading(true);
    const movieFromServer = await getMovie(query);

    if ('Error' in movieFromServer) {
      setError(true);
      setLoading(false);
    } else {
      const newMove = createNewMove(
        movieFromServer.Title,
        movieFromServer.Plot,
        movieFromServer.Poster,
        movieFromServer.imdbID,
      );

      setMovie(newMove);
      setLoading(false);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          addMovie();
          event.preventDefault();
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
              value={query}
              placeholder="Enter a title to search"
              className="input is-dander"
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
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!(query.length > 0)}
            >
              {movie ? 'Search again' : 'Find a movie'}
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
                  addMovieInList(movie);
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
