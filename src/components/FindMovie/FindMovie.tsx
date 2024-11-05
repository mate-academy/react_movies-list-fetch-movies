import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
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

  function searchMovie(event: React.FormEvent) {
    event.preventDefault();

    setLoading(true);

    getMovie(query)
      .then(({ Poster, Title, Plot, imdbID }: MovieData) => {
        const movieData: Movie = {
          title: Title,
          description: Plot,
          imgUrl: Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}/`,
          imdbId: imdbID,
        };

        setMovie(movieData);
      })
      .finally(() => setLoading(false));
  }

  function addMovieToList() {
    let newMovies: Movie[] = [];

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
              className="input is-danger"
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </div>

          <p className="help is-danger" data-cy="errorMessage">
            Can&apos;t find a movie with such a title
          </p>
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

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
