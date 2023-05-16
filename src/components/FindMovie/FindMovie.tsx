import React, {
  ChangeEvent,
  FormEvent,
  useCallback,
  useState,
} from 'react';
import classNames from 'classnames';

import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

interface Props {
  onAddMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isloading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    if (!query.trim()) {
      setError('Please enter a movie title');
      setIsLoading(false);

      return;
    }

    try {
      const response = await getMovie(query.trim());

      if ('Error' in response) {
        setError('Can\'t find a movie with such title');

        return;
      }

      const poster = response.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : response.Poster;

      const foundedMovie = {
        title: response.Title,
        description: response.Plot,
        imgUrl: poster,
        imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        imdbId: response.imdbID,
      };

      setMovie(foundedMovie);
    } catch (fetchError) {
      setError('Something went wrong');
      throw fetchError;
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMovie = useCallback(() => {
    onAddMovie(movie as Movie);
    setMovie(null);
    setQuery('');
  }, [movie]);

  const handleQuery = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              onChange={handleQuery}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isloading,
              })}
              disabled={!query}
            >
              {movie
                ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
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
