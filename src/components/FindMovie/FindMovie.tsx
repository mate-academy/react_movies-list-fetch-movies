import cn from 'classnames';
import {
  FC,
  ChangeEventHandler,
  FormEventHandler,
  useState,
  memo,
} from 'react';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { MOVIE_DEFAULT_PREVIEW } from '../../constants/movies.constant';

interface Props {
  onMovieAdd: (movie: Movie) => void;
}

const NativeFindMovie: FC<Props> = ({ onMovieAdd }) => {
  const [movie, setMovie] = useState<Movie | null>(null);

  const [query, setQuery] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    setIsLoading(true);

    getMovie(query)
      .then((response: MovieData | ResponseError) => {
        if ('Error' in response) {
          setError(response.Error);
        } else {
          const poster = response.Poster === 'N/A'
            ? MOVIE_DEFAULT_PREVIEW
            : response.Poster;

          const formattedMovie = {
            title: response.Title,
            description: response.Plot,
            imgUrl: poster,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          };

          setMovie(formattedMovie);
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setQuery(event.target.value);
    setError(null);
  };

  const handleAddMovie = () => {
    if (!movie) {
      return;
    }

    onMovieAdd(movie);
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
              className="input is-dander"
              value={query}
              onChange={handleInputChange}
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
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
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
                onClick={handleAddMovie}
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

export const FindMovie = memo(NativeFindMovie);
