import { ChangeEvent, FC, FormEvent, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

interface Props {
  onAddMovie: (movie: Movie) => void;
}

export const FindMovie: FC<Props> = ({ onAddMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const message = "Can't find a movie with such a title";
  const trimmedQuery = query.trim();

  const findMovie = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!trimmedQuery) {
      return;
    }

    getMovie(trimmedQuery)
      .then(data => {
        if (data.Response === 'False') {
          setErrorMessage(message);
          setMovie(null);

          return;
        }

        const {
          Title: title,
          Plot: description,
          Poster,
          imdbID: imdbId,
        } = data as MovieData;

        const imgUrl =
          !Poster || Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : Poster;

        const newMovie: Movie = {
          title,
          description,
          imgUrl,
          imdbUrl: `https://www.imdb.com/title/${imdbId}`,
          imdbId,
        };

        setErrorMessage('');
        setMovie(newMovie);
      })
      .catch(() => {
        setErrorMessage(message);
        setMovie(null);
      })
      .finally(() => setIsLoading(false));
  };

  const handleAddMovie = () => {
    if (movie) {
      onAddMovie(movie);
      setQuery('');
      setErrorMessage('');
      setMovie(null);
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setQuery(event.target.value);
  };

  return (
    <>
      <form className="find-movie" onSubmit={findMovie}>
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
              className="input"
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button', 'is-light', { 'is-loading': isLoading })}
              disabled={!trimmedQuery}
            >
              {movie ? 'Search again' : 'Find a movie'}
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
