import React, { useState } from 'react';
import { getMovies } from '../../api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = (props) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [findMovieCard, setFindMovieCard] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!movieTitle.trim()) {
      setFormSubmitted(true);
    } else {
      getMovies(movieTitle)
        .then(resp => {
          if (!resp.imdbID) {
            setFormSubmitted(true);
            setMovieTitle('');
            setMovie(null);

            return;
          }

          props.onAdd(resp);
          setMovieTitle('');
          setFormSubmitted(false);
          setMovie(null);
        });
    }
  };

  const findMovie = () => {
    if (!movieTitle.trim()) {
      setFormSubmitted(true);
    } else {
      getMovies(movieTitle)
        .then(resp => {
          if (!resp.imdbID) {
            setFormSubmitted(true);
            setMovieTitle('');
            setMovie(null);

            return;
          }

          setMovie(resp);
          setFindMovieCard(true);
        });
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="find-movie"
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              value={movieTitle}
              onChange={(event) => setMovieTitle(event.target.value)}
              placeholder="Enter a title to search"
              className="input is-danger"
            />
          </div>

          {!movieTitle && formSubmitted && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findMovie}
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
        {movie && findMovieCard && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
