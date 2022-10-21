import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  onAdd: (movie:Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [movieFound, setMovieFound] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getData = async () => {
    const movie = await getMovie(query);

    if ('Error' in movie) {
      setError(true);
      setMovieFound(null);
    } else {
      setMovieFound({
        title: movie.Title,
        description: movie.Plot,
        imgUrl: movie.Poster !== 'N/A'
          ? movie.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
        imdbId: movie.imdbID,
      });
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    getData()
      .finally(() => setIsLoading(false));
  };

  const handleClick = (movie:Movie) => {
    onAdd(movie);
    setMovieFound(null);
    setQuery('');
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
              onChange={(event) => {
                setQuery(event.target.value);
                setError(false);
              }}
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
              disabled={query.trim().length === 0}
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light',
                { 'is-loading': isLoading })}
              onClick={onSubmit}
            >
              Find a movie
            </button>
          </div>

          {movieFound && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  handleClick(movieFound);
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movieFound && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movieFound} />
        </div>
      )}
    </>
  );
};
