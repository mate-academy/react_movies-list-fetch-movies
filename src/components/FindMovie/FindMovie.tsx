import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  setMovies: (movie: Movie[]) => void;
  movies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [query, setQuery] = useState('');
  const [isAddBtn, setIsAddBtn] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addMovie = (film: Movie | null) => {
    if (film) {
      const newMovies = [...movies, film];

      setMovies(newMovies);
      setMovie(null);
      setIsError(false);
      setQuery('');
      setIsAddBtn(false);
    }
  };

  const searchMovieHandler = (
    e: React.MouseEvent<HTMLButtonElement>,
    term: string,
  ) => {
    e.preventDefault();

    setIsLoading(true);

    getMovie(term).then(data => {
      if ('Error' in data) {
        setIsError(true);
        setIsAddBtn(false);
      } else {
        setIsError(false);
        setIsAddBtn(true);

        const defaultImg = data.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : data.Poster;
          /* eslint-disable-next-line */
        const imdbUrl = 'https://mate-academy.github.io/react_movies-list-fetch-movies/images/imdb-logo.jpeg';

        const newMovie: Movie = {
          title: data.Title,
          description: data.Plot,
          imgUrl: data.Poster || defaultImg,
          imdbUrl,
          imdbId: data.imdbID,
        };

        setMovie(newMovie);
      }

      setIsLoading(false);
    });
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': isError,
              })}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
              onClick={(e) => searchMovieHandler(e, query)}
            >
              Find a movie
            </button>
          </div>

          {isAddBtn && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addMovie(movie)}
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
