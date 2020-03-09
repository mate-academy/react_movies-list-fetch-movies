import React, {
  FC,
  useState,
  ChangeEvent,
  FormEvent,
} from 'react';
import './FindMovie.scss';
import * as cx from 'classnames';
import { MovieCard } from '../MovieCard';
import { getData, API_URL } from '../../utils/api';
import { Movie } from '../../utils/interfaces';


interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: FC<Props> = ({ addMovie }) => {
  const [inputValue, setInputValue] = useState('');
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);
  const [isError, setError] = useState(false);

  const searchMovie = async () => {
    const getNewMovie = () => {
      return getData(`${API_URL}${inputValue}`);
    };

    const newMovieFromServer = await getNewMovie();

    const {
      Title: title,
      Plot: description,
      Poster: imgUrl,
      imdbID: imdbId,
      Response,
    } = newMovieFromServer;

    if (Response === 'True') {
      const imdbUrl = API_URL + imdbId;
      const newMovie = {
        title,
        description,
        imgUrl,
        imdbId,
        imdbUrl,
      };

      setPreviewMovie(newMovie);
      setError(false);
    } else {
      setError(true);
    }
  };

  const inputHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputValue(value.replace(/^\s/, ''));
  };

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (previewMovie) {
      addMovie(previewMovie);
      setInputValue('');
      setError(false);
      setPreviewMovie(null);
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
              className={cx.default({
                input: true,
                'is-danger': isError,
              })}
              value={inputValue}
              onChange={inputHandler}
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
              onClick={searchMovie}
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
        { previewMovie && <MovieCard {...previewMovie} />}
      </div>
    </>
  );
};
