import { useState, ChangeEvent } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  addMovie: (newMovie: Movie) => void,
};

export const FindMovie: React.FC<Props> = (props) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError(false);
  };

  const searchMovie = async () => {
    const newMovie = await getMovie(title);

    if (!newMovie) {
      setError(true);
    } else {
      setMovie(newMovie);
      setError(false);
    }
  };

  const clearForm = () => {
    setTitle('');
    setError(false);
  };

  const addNewMovie = () => {
    if (movie) {
      props.addMovie(movie);
    }

    clearForm();
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (movie) {
      props.addMovie(movie);
    }

    clearForm();
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                value={title}
                onChange={handleChange}
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className="input is-danger"
              />
            </div>
          </label>

          {error && (
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
              type="button"
              className="button is-primary"
              onClick={addNewMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (<MovieCard movie={movie} />)}
      </div>
    </>
  );
};
