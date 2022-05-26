import React, { useState } from 'react';
import './FindMovie.scss';
import { request } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = React.memo(({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [previeData, setPrevieData] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const findMovie = async () => {
    if (!title) {
      return;
    }

    const film = await request(title);

    if (film.Response === 'False') {
      setIsError(true);

      return;
    }

    if (previeData?.imdbID === film.imdbID) {
      return;
    }

    setTitle('');
    setPrevieData({
      Poster: film.Poster,
      Title: film.Title,
      Plot: film.Plot,
      imdbID: film.imdbID,
    });
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          {isError && (
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
                if (previeData) {
                  addMovie(previeData);
                  setPrevieData(null);
                  setTitle('');
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
        {previeData && <MovieCard movie={previeData} />}
      </div>
    </>
  );
});
