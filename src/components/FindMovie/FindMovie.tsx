import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api/api';

import { MovieCard } from '../MovieCard';

interface Props {
  newMovie: (movie: Movie) => void
}

export const FindMovie: React.FC<Props> = (props) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState({
    Poster: '',
    Title: '',
    Plot: '',
    imdbID: '',
  });
  const [titleError, setTitleError] = useState(false);

  async function searchMovie() {
    const newMovie = await getMovie(title);

    if (newMovie.imdbID) {
      setMovie(newMovie);
    } else {
      setTitleError(true);
    }
  }

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          setMovie({
            Poster: '',
            Title: '',
            Plot: '',
            imdbID: '',
          });
          setTitle('');
          props.newMovie(movie);
        }}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={`input ${titleError && 'is-danger'}`}
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setTitleError(false);
                }}
              />
            </div>
          </label>
          {titleError && (
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
              onClick={() => searchMovie()}
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
        {movie.imdbID && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
