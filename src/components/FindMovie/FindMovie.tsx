import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import classNames from 'classnames';

type Props = {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);

  const defaultPicture =
    'https://via.placeholder.com/360x270.png?text=no%20preview';

  function searchMovie(event: React.FormEvent) {
    event.preventDefault();

    setLoading(true);

    getMovie(query)
      .then(resMovieData => {
        if ('Error' in resMovieData) {
          setErrorMessage(true);

          return;
        } else {
          const { Poster, Title, Plot, imdbID } = resMovieData;

          const movieData: Movie = {
            title: Title,
            description: Plot,
            imgUrl: Poster !== 'N/A' ? Poster : defaultPicture,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          };

          setMovie(movieData);
        }
      })
      .finally(() => setLoading(false));
  }

  function addMovieToList() {
    let newMovies: Movie[] = [];

    let movieExists: boolean = false;

    movies.forEach(film => {
      if (film.imdbId === movie?.imdbId) {
        movieExists = true;
      }
    });

    if (movieExists) {
      setMovie(null);
      setQuery('');

      return;
    }

    if (movie) {
      newMovies = [...movies, movie];
    }

    setMovies(newMovies);
    setMovie(null);
    setQuery('');
  }

  return (
    <>
      <form className="find-movie" onSubmit={searchMovie}>
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
              className={classNames('input', { 'is-danger': errorMessage })}
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setErrorMessage(false);
              }}
            />
          </div>

          {errorMessage && (
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
                'is-loading': loading,
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
                onClick={addMovieToList}
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
