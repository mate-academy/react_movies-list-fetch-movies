import React, {
  FC,
  useState,
  ChangeEvent,
  FormEvent,
} from 'react';

import { MovieCard } from '../MovieCard';
import { getData } from '../../api/api';

import './FindMovie.scss';


interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [isError, setError] = useState(false);

  const movieSearchHandler = async () => {
    const movieFromServer = await getData(inputValue);

    const {
      Title: title,
      Plot: description,
      Poster: imgUrl,
      imdbID: imdbId,
      Response,
    } = movieFromServer;

    if (Response === 'True') {
      const imdbUrl = `https://www.imdb.com/title/${imdbId}`;
      const newMovie = {
        title,
        description,
        imgUrl,
        imdbId,
        imdbUrl,
      };

      setMovie(newMovie);
      setError(false);
    } else {
      setError(true);
    }
  };

  const changeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputValue(value.replace(/^\s/, ''));
  };

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (movie) {
      addMovie(movie);
      setInputValue('');
      setError(false);
      setMovie(null);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={submitHandler}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
          Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={isError ? 'input is-danger' : 'input'}
              value={inputValue}
              onChange={changeHandler}
            />
          </div>

          {isError
          && (
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
              onClick={movieSearchHandler}
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
        { movie && <MovieCard {...movie} />}
      </div>
    </>
  );
};
