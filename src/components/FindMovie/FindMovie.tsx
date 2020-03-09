import React, {
  useState,
  ChangeEvent,
  FormEvent,
  FC,
} from 'react';
import './FindMovie.scss';
import cx from 'classnames';
import { getMovieData } from '../../utils/api';
import { Movie } from '../../constants/types';
import { MovieCard } from '../MovieCard';
import { URL_IMDB } from '../../constants/api';

interface Props {
  addNewMovie: (newMovie: Movie) => void;
}

export const FindMovie: FC<Props> = ({ addNewMovie }) => {
  const [titleMovie, setTitleMovie] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [addButtonStatus, setAddButtonStatus] = useState<boolean>(true);

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTitleMovie(value);
  };

  const handleSearch = async () => {
    try {
      const movieRequest = await getMovieData(titleMovie);

      setNewMovie(null);

      if (movieRequest.Response === 'True') {
        const imdbUrl = `${URL_IMDB}${movieRequest.imdbID}`;

        const movie: Movie = {
          title: movieRequest.Title,
          description: movieRequest.Plot,
          imgUrl: movieRequest.Poster,
          imdbUrl,
          imdbId: movieRequest.imdbID,
        };

        setNewMovie(movie);
        setError(false);
        setAddButtonStatus(false);
      } else {
        setError(true);
        setAddButtonStatus(true);
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newMovie) {
      addNewMovie(newMovie);
      setTitleMovie('');
      setNewMovie(null);
      setAddButtonStatus(true);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
          Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cx('input', { 'is-danger': error })}
              value={titleMovie}
              onChange={handleInput}
            />
          </div>
          {error && (
            <p
              className="help is-danger"
            >
          Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleSearch}
            >
            Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              disabled={addButtonStatus}
            >
            Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {newMovie && <MovieCard {...newMovie} /> }
      </div>
    </>
  );
};
