import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [isMovieValid, setIsMovieValid] = useState(true);
  const [findedMovieTitle, setFindedMovieTitle] = useState('');
  const [findedMovie, setFindedMovie] = useState({
    Poster: '',
    Title: '1',
    Plot: '',
    imdbID: '',
  });

  const loadMovie = async (title: string) => {
    if (!(findedMovie.Title || '').toLowerCase().includes(title.toLowerCase())) {
      const movie = await getMovie(title);

      if (movie.Response === 'False') {
        setIsMovieValid(false);
      } else {
        setFindedMovie(movie);
      }
    }
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
                placeholder="Enter a title to search"
                className="input is-danger"
                value={findedMovieTitle}
                onChange={(event) => {
                  setIsMovieValid(true);
                  setFindedMovieTitle(event.target.value);
                }}
              />
            </div>
          </label>

          {!isMovieValid && <p className="help is-danger">Can&apos;t find a movie with such a title</p>}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => loadMovie(findedMovieTitle)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addMovie(findedMovie);
                setFindedMovieTitle('');
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {findedMovie.imdbID && <MovieCard movie={findedMovie} />}
      </div>
    </>
  );
};
