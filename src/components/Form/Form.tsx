import classNames from 'classnames';
import { useState } from 'react';
import { getMoviesFromServer } from '../../api/api';

type Props = {
  setFilm: (film: Movie | null) => void;
  film: Movie | null;
  addFilm: (film: Movie) => void;
};

export const Form: React.FC<Props> = ({ setFilm, addFilm, film }) => {
  const [title, setTitle] = useState('');
  const [hasFilm, setHasFilm] = useState(false);

  const searchFilm = () => {
    getMoviesFromServer(title)
      .then(movie => {
        if (!movie.Error) {
          setFilm(movie);
        } else {
          setHasFilm(true);
        }
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (film) {
      addFilm(film);
      setTitle('');
      setFilm(null);
    }
  };

  return (
    <form className="find-movie" onSubmit={handleSubmit}>
      <div className="field">
        <label className="label" htmlFor="movie-title">
          Movie title
        </label>

        <div className="control">
          <input
            type="text"
            id="movie-title"
            placeholder="Enter a title to search"
            value={title}
            className={classNames({ 'is-danger': hasFilm }, 'input')}
            onChange={(event) => {
              setHasFilm(false);
              setTitle(event.target.value);
            }}
          />
        </div>
        {hasFilm && (
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
            onClick={searchFilm}
            data-cy="find"
          >
            Find a movie
          </button>
        </div>

        <div className="control">
          <button
            type="submit"
            className="button is-primary"
            data-cy="add"
          >
            Add to the list
          </button>
        </div>
      </div>
    </form>
  );
};
