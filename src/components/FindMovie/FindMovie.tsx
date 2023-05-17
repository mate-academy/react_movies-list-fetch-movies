import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

interface Props {
  onAdd: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
  };

  const handleMovieAdd = () => {
    if (movie) {
      onAdd(movie);
      setMovie(null);
      setQuery('');
    }
  };

  const loadMovie = async () => {
    if (!query.trim()) {
      setErrorMessage('Invalid movie title');

      return;
    }

    setLoading(true);

    try {
      const result = await getMovie(query);

      if ('Error' in result) {
        setErrorMessage('Cant find movie with such a title');
      } else {
        const dontHavePoster = result.Poster === 'N/A';
        // eslint-disable-next-line max-len
        const noPosterImage = 'https://via.placeholder.com/360x270.png?text=no%20preview';

        setMovie({
          title: result.Title,
          description: result.Plot,
          imgUrl: dontHavePoster
            ? noPosterImage
            : result.Poster,
          imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
          imdbId: result.imdbID,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    loadMovie();
  };

  useEffect(() => {
    setErrorMessage('');
  }, [query]);

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
              className="input"
              value={query}
              onChange={handleChange}
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
              className={cn('button', {
                'is-light': !isLoading,
                'is-loading': isLoading,
              })}
              disabled={!query}
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
                onClick={handleMovieAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container is-loading" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
