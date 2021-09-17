import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovies } from '../../api/api';

import { MovieCard } from '../MovieCard';

interface Props {
  movies: Movie[]
  onUpdateMovies: (selectedMovie: Movie) => void;
}

export const FindMovie: React.FC<Props> = (props) => {
  const { movies, onUpdateMovies } = props;

  const [querty, setQuerty] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [showError, setError] = useState(false);
  const [loader, setLoader] = useState(false);

  const moviesFromServer = async () => {
    setLoader(true);
    const findMovie = await getMovies(querty);

    if (findMovie.Response !== 'False') {
      setMovie({
        title: findMovie.Title,
        description: findMovie.Plot,
        imgUrl: findMovie.Poster,
        imdbUrl: `https://www.imdb.com/title/${findMovie.imdbID}/`,
        imdbId: findMovie.imdbID,
      });
    } else {
      setError(true);
      setMovie(null);
    }

    setLoader(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (movie !== null && !movies.find(m => m.imdbId === movie.imdbId)) {
      onUpdateMovies(movie);
    }

    setQuerty('');
    setMovie(null);
    setError(false);
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuerty(event.target.value);
    setError(false);
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
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': showError })}
              value={querty}
              onChange={handleInput}
            />
          </div>

          {showError && (
            <p className={classNames('help', { 'is-danger': showError })}>
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className={classNames('button is-light', loader && 'is-loading')}
              onClick={moviesFromServer}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie ? <MovieCard {...movie} /> : <div>no selected</div>}
      </div>
    </>
  );
};
