import classNames from 'classnames';
import React, { memo, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAddMovie: (movies: Movie[]) => void,
  visibleMovies: Movie[];
};

export const FindMovie: React.FC<Props> = memo(({
  onAddMovie,
  visibleMovies,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const getMovieFromServer = async () => {
    setLoading(true);

    const movieFromServer = await getMovie(query);

    try {
      if ('Title' in movieFromServer) {
        setLoading(true);

        setMovie({
          title: movieFromServer.Title,
          description: movieFromServer.Plot,
          imgUrl: movieFromServer.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : movieFromServer.Poster,
          imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
          imdbId: movieFromServer.imdbID,
        });
      } else {
        setIsError(true);
        setLoading(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    getMovieFromServer();
  };

  const handleAddToTheTodo = () => {
    if (movie && !visibleMovies.some(
      addedMovie => addedMovie.imdbId === movie.imdbId,
    )) {
      const allMovies = [
        ...visibleMovies,
        movie,
      ];

      onAddMovie(allMovies);
    }

    setMovie(null);
    setQuery('');
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
              className="input is-dander"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setIsError(false);
              }}
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
                onClick={handleAddToTheTodo}
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
});
