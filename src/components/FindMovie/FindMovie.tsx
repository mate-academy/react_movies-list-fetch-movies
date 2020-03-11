import React, {
  FC,
  useState,
  ChangeEvent,
  FormEvent,
} from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { hollowFilm } from '../../api/movies';
import { getFilm } from '../../api/Api';

interface Props {
  addMovie: (newMovie: Movie) => void;
  movies: Movie[];
}

export const FindMovie: FC<Props> = (props) => {
  const [movie, setMovie] = useState<Movie>(hollowFilm);
  const [input, setInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
    setErrorMessage('');
  };

  const findFilm = (event: FormEvent) => {
    event.preventDefault();
    const response = getFilm(input);

    response
      .then(result => setMovie(result))
      .catch(() => setErrorMessage('Can\'t find a movie with such a title'));
  };

  const handleAddFilm = () => {
    const isFilmInList = props.movies.find(item => item.imdbID === movie.imdbID) !== undefined;

    if (movie !== hollowFilm && !isFilmInList) {
      props.addMovie(movie);
      setMovie(hollowFilm);
      setInput('');
    } else if (isFilmInList) {
      setErrorMessage('This film is already in list');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={findFilm}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={errorMessage ? 'input is-danger' : 'input'}
              onChange={handleInputChange}
              value={input}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAddFilm}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard {...movie} />
      </div>
    </>
  );
};
