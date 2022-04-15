import { FC, useState } from 'react';
import classNames from 'classnames';
import { fetchMovie } from '../../movieData';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  onAddMovie: (newMovie: Movie) => void;
};

export const FindMovie: FC<Props> = ({ onAddMovie }) => {
  const [movie, setMovie] = useState<Movie>(Object);
  const [searchedMovie, setSearchedMovie] = useState('');
  const [isMovieFinded] = useState(false);

  const fetchSearchMovie = async () => {
    const fullMovie = await fetchMovie(searchedMovie);

    setMovie(fullMovie);
  };

  const onFormSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    fetchSearchMovie();
  };

  const onSearchMovie = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchedMovie(event.target.value);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onFormSubmit}
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
              className={classNames(
                'input',
                { 'is-danger': isMovieFinded },
              )}
              value={searchedMovie}
              onChange={onSearchMovie}
            />
          </div>

          {isMovieFinded && (
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
              onClick={fetchSearchMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => onAddMovie(movie)}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {Object.keys(movie).length > 0 && (
          <MovieCard
            movie={movie}
          />
        )}
      </div>
    </>
  );
};
