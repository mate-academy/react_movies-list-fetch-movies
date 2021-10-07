import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (anotherMovie: Movie) => void;
  isMovieOnTheList: boolean;
  setIsMovieOnTheList: (value: boolean) => void;
};

export const FindMovie: React.FC<Props> = (props) => {
  const { addMovie, isMovieOnTheList, setIsMovieOnTheList } = props;

  const [title, setTitle] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isMovieFound, setMovieFound] = useState<boolean>(true);

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
              value={title}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTitle(event.target.value);
                setIsMovieOnTheList(false);
                setMovieFound(true);
              }}
            />
          </div>

          {isMovieFound ? null : (
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
              onClick={() => (
                (async (titleTwo) => {
                  const movieFromAPI: Movie = await getMovie(titleTwo);

                  if (movieFromAPI.Title) {
                    setMovie(movieFromAPI);
                    setMovieFound(true);
                    setTitle('');
                  } else {
                    setMovie(null);
                    setMovieFound(false);
                  }
                })(title)
              )}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (movie) {
                  addMovie(movie);
                }
              }}
            >
              Add to the list
            </button>
            {isMovieOnTheList && (
              <p className="help is-danger">
                The movie is already on the list
              </p>
            )}
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard currentMovie={movie} />}
      </div>
    </>
  );
};
