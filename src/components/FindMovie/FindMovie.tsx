import { FormEvent, useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard/MovieCard';
import { MovieData } from '../../types/MovieData';

type Props = {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
};

const DEFAULT_IMAGE =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMovieNotFound, setIsMovieNotFound] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(query)
      .then(mov => {
        if ('Response' in mov && mov.Response === 'False') {
          setMovie(null);
          setIsMovieNotFound(true);
        } else {
          const movieData = mov as MovieData;

          const {
            Title: title,
            Plot: description,
            Poster: imgUrl,
            imdbID: imdbId,
          } = movieData;

          const image = imgUrl !== 'N/A' ? imgUrl : DEFAULT_IMAGE;

          setMovie({
            title,
            description,
            imgUrl: image,
            imdbUrl: `https://www.imdb.com/title/${imdbId}`,
            imdbId,
          });
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleAdd = (newMovie: Movie) => {
    const isAdded = movies.filter(
      singleMovie => singleMovie.imdbId === newMovie.imdbId,
    );

    if (newMovie && isAdded.length === 0) {
      setMovies([...movies, newMovie]);
      setMovie(null);
      setQuery('');
    } else {
      setMovie(null);
      setQuery('');
    }
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
              className={cn('input', {
                'is-danger': isMovieNotFound,
              })}
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setIsMovieNotFound(false);
              }}
            />
          </div>

          {isMovieNotFound && (
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
              disabled={query === ''}
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
                onClick={() => handleAdd(movie)}
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
          {<MovieCard movie={movie} />}
        </div>
      )}
    </>
  );
};
