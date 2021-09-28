import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getFilm } from '../../api/api';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovies: (newMovie: Movie) => void,
};
export const FindMovie: React.FC<Props> = (props) => {
  const { addMovies } = props;
  const [isDetected, setIsDetected] = useState(true);
  const [title, setTitle] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTitle(value);
    setIsDetected(true);
  };

  const loadFilm = async () => {
    const uploadFilm = await getFilm(title);

    if (uploadFilm.Response === 'False') {
      setNewMovie(null);
      setIsDetected(false);

      return;
    }

    setIsDetected(true);

    setNewMovie({
      title: uploadFilm.Title,
      description: uploadFilm.Plot,
      imgUrl: uploadFilm.Poster,
      imdbUrl: `https://www.imdb.com/title/${uploadFilm.imdbID}`,
      imdbId: uploadFilm.imdbID,
    });

    setTitle('');
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
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': !isDetected })}
              value={title}
              onChange={(event) => handleChange(event)}
            />
          </div>

          {!isDetected && (
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
              onClick={loadFilm}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (newMovie !== null) {
                  addMovies(newMovie);
                }

                setNewMovie(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {newMovie
          && <MovieCard movie={newMovie} />}
      </div>
    </>
  );
};
