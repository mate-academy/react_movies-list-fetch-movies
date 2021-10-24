import React, { useState } from 'react';
import './FindMovie.scss';
import { request } from '../../api';
import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: any
  movies: Movie[]
}

export const FindMovie: React.FC<Props> = ({ addMovie, movies }) => {
  const [value, changeValue] = useState('');
  const [movie, changeMovie] = useState<Movie | null>(null);
  const [movieIsFound, changeMovieIsFound] = useState('');

  const findMovie = () => {
    const getMovie = () => request(`t=${value}`);

    getMovie()
      .then((result: Movie) => {
        changeMovieIsFound(result.Error);
        changeMovie(result);
      });
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">

            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                value={value}
                placeholder="Enter a title to search"
                className="input is-danger"
                onChange={event => changeValue(event.target.value)}
              />
            </div>
          </label>

          {movieIsFound && (
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
              type="button"
              className="button is-primary"
              onClick={() => {
                if (!movieIsFound && movie) {
                  const imdbs = [...movies].map(item => item.imdbID);

                  if (!imdbs.includes(movie.imdbID)) {
                    addMovie([...movies, movie]);
                    changeValue('');
                    changeMovie(null);
                  }
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {!movieIsFound && movie && (
          <MovieCard movie={movie} />
        )}
      </div>
    </>
  );
};
