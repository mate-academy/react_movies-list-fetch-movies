import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { request } from '../../api/api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = React.memo(({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [previeData, setPrevieData] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);

  // const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   setTitle(event.target.value);
  //   setIsError(false);
  // };

  // const findMovie = () => {
  //   request(title).then((res) => {
  //     if (!res.Error) {
  //       setMovie(res);
  //     } else {
  //       setIsError(true);
  //       setMovie(null);
  //     }
  //   });
  // };
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

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': isError })}
              value={title}
              onChange={(event) => {
                setIsError(false);
                setTitle(event.target.value);
              }}
            />
          </div>

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
              onClick={() => {
                findMovie();
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
