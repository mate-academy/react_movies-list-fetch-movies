import React, { useState } from 'react';
import { request } from '../api/request';
import { MovieCard } from '../MovieCard/MovieCard';
import './FindMovie.scss';

interface Props {
  callbackForMovies: (arg0 : Movie[]) => void;
  moviesPrev: Movie[];
}

export const FindMovie: React.FC<Props> = (
  { callbackForMovies, moviesPrev },
) => {
  const [movieForFind, setMovieForFind] = useState('');
  const [preview, setPreview] = useState<Movie>();

  async function finder() {
    const result = await request(movieForFind.toLowerCase());

    setPreview(result);
  }

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              onChange={(event) => {
                setMovieForFind(event.target.value);
              }}
            />
          </div>

          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => {
                finder();
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (preview) {
                  if (!moviesPrev.find(el => el.imdbID === preview.imdbID)) {
                    callbackForMovies([...moviesPrev, preview]);
                    setPreview(undefined);
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
        { preview
        && <MovieCard movie={preview} />}
      </div>
    </>
  );
};
