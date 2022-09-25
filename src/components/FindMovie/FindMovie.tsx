import { useState } from 'react';
import './FindMovie.scss';
import className from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [film, setFilm] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');

  const handleTitleChange = (event:React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsError(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(query)
      .then(result => {
        if ('Error' in result) {
          setIsError(true);
          setFilm(null);

          return;
        }

        const {
          Poster, Title, Plot, imdbID,
        } = result;

        setFilm({
          title: Title,
          description: Plot,
          imgUrl: Poster
            || 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        });

        setIsError(false);
      })
      .catch(() => setIsError(true))
      .finally(
        () => setIsLoading(false),
      );
  };

  const handleClick = () => {
    if (film) {
      addMovie(film);
    }

    setQuery('');
    setFilm(null);
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
              onChange={handleTitleChange}
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
              className={className('button',
                { 'is-light': !isLoading }, { 'is-loading': isLoading })}
              disabled={!query.length}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {film && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleClick}
              >
                Add to the list
              </button>
            )}

          </div>
        </div>
      </form>

      {film && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={film} />
        </div>
      )}
    </>
  );
};
