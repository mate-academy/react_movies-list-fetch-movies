import React, { FC, useState } from 'react';
import cx from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

const URL = 'https://www.omdbapi.com/?apikey=bc4ea364&t=';
const URL_IMDB = 'https://www.imdb.com/title/';

interface Props {
  addNewMovie: any;
  movies: Movie[];
}

export const FindMovie: FC<Props> = (props) => {
  const { addNewMovie, movies } = props;

  const [text, setText] = useState('');
  const [newMovie, setNewMovie] = useState<Movie | null>(null);
  const [isEnter, setIsEnter] = useState(false);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setText(value);
    setIsEnter(false);
  };

  const findFilm = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch(`${URL}${text}`);
    const {
      Title: title,
      Plot: description,
      Poster: imgUrl,
      imdbID: imdbId,
      Response: isFound,
    } = await response.json();

    const movie: Movie = {
      title,
      description,
      imgUrl,
      imdbUrl: `${URL_IMDB}${imdbId}`,
      imdbId,
    };
    const isCheck = (isFound === 'True');

    if (movies.every(film => film.imdbId !== imdbId) && isCheck) {
      setNewMovie(movie);
    } else {
      setIsEnter(true);
      setNewMovie(null);
    }
  };

  const addToMovies = () => {
    if (newMovie === null) {
      return;
    }

    addNewMovie(newMovie);
    setNewMovie(null);
    setText('');
    setIsEnter(false);
  };

  return (
    <>
      <form onSubmit={findFilm} className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              onChange={handleInput}
              value={text}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cx('input', { 'is-danger': isEnter })}
            />
          </div>

          <p className={cx('help', { 'is-danger': isEnter })}>
            {isEnter ? "Can't find a movie with such a title" : (' ')}
          </p>
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
              onClick={addToMovies}
              type="button"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {!(newMovie)
          ? (<p>  </p>)
          : (<MovieCard {...newMovie} />)}
      </div>
    </>
  );
};
