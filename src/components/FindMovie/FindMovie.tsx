import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import classnames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputTitle, setInputTitle] = useState('');

  const handleAdd = () => {
    if (movie) {
      onAddMovie(movie);
      setInputTitle('');
      setMovie(null);
    }
  };

  const handleSearchMovie = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    getMovie(inputTitle)
      .then((response) => {
        if ('Error' in response || !inputTitle.trim()) {
          throw new Error();
        }

        setMovie({
          title: response.Title,
          description: response.Plot,
          imgUrl: response.Poster === 'N/A'
            ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
            : response.Poster,
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          imdbId: response.imdbID,
        });
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {

  }, []);

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError(false);
    setInputTitle(event.target.value);
  };

  return (
    <>
      <form onSubmit={handleSearchMovie} className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              value={inputTitle}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classnames('input', { 'is-danger': error })}
              onChange={handleChangeTitle}
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
              className={classnames(
                'button',
                'is-light',
                { 'is-loading': loading },
              )}
              disabled={!inputTitle || loading}
            >
              {!movie ? 'Find a movie' : 'Search again'}
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
