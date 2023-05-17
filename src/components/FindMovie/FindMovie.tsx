import {
  ChangeEvent,
  FC,
  FormEvent,
  useState,
} from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

interface Props {
  onAdd: (movie: Movie) => void;
}

export const FindMovie: FC<Props> = ({ onAdd }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const addNewMovie = (data: MovieData | ResponseError) => {
    if ('Error' in data) {
      throw new Error(data.Error);
    }

    const dataPoster = data.Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : data.Poster;

    setMovie({
      title: data.Title,
      description: data.Plot,
      imdbId: data.imdbID,
      imgUrl: dataPoster,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    });
  };

  const isQueryInvalid = !query || query.trim().length === 0;

  const handleOnSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isQueryInvalid) {
      setIsLoading(false);

      throw new Error('Movie title is invalid');
    }

    setIsLoading(true);

    try {
      const newMovie = await getMovie(query);

      addNewMovie(newMovie);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsError(false);
  };

  const handleOnClick = () => {
    if (movie) {
      onAdd(movie);
      setQuery('');
      setMovie(null);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleOnSubmit}
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
              onChange={handleOnChange}
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
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={query.length === 0}
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
                onClick={handleOnClick}
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
