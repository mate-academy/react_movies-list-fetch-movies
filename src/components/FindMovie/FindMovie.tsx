import React from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  setMovies: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [query, setQuery] = React.useState('');
  const [movie, setMovie] = React.useState<Movie | null>(null);
  const [isLoading, setLoading] = React.useState(false);
  const [isError, setError] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    const movieFromApi = await getMovie(query);

    setLoading(false);

    if ('Error' in movieFromApi) {
      setError(true);

      return;
    }

    const {
      Title, Poster, imdbID, Plot,
    } = movieFromApi;

    setMovie({
      title: Title,
      description: Plot,
      imgUrl:
        Poster !== 'N/A'
          ? Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
      imdbId: imdbID,
    });
  };

  const handleAdd = () => {
    if (movie) {
      setMovies(movie);
    }

    setQuery('');
    setMovie(null);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setError(false);
              }}
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
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
              className={classNames(
                isLoading && 'is-loading',
                'button is-light',
              )}
              disabled={!query}
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
