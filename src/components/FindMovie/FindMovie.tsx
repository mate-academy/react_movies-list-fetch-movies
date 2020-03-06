import React, { ChangeEvent, useState } from 'react';
import './FindMovie.scss';
import { getNewMovie } from '../../api/getNewMovie';

import { MovieCard } from '../MovieCard';

interface Props {
  addNewMovie: any;
  movies: Movie[];
}

export const FindMovie = ({ addNewMovie, movies }: Props) => {
  const [filedValue, setFiledValue] = useState('');
  const [isLoad, setIsLoad] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErorMessage] = useState('');
  const [newMovie, setNewMovie] = useState<Movie>({});

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFiledValue(event.target.value);
  };

  const getMovie = () => {
    getNewMovie(filedValue)
      .then(movie => {
        setNewMovie({
          title: movie.Title,
          description: movie.Plot,
          imgUrl: movie.Poster,
          imdbUrl: movie.Year,
          imdbId: movie.imdbID,
        });

        setIsError(false);
        setIsLoad(true);
        setErorMessage('');
      })
      .catch(() => {
        setIsError(true);
        setIsLoad(false);
        setErorMessage('we dont find any movie');
      });
  };

  const addMovie = () => {
    const id = movies.map(movie => movie.imdbId);

    setFiledValue('');

    if (isLoad) {
      if (!id.includes(newMovie.imdbId)) {
        addNewMovie(newMovie);
        setNewMovie({});
        setIsLoad(false);
      } else {
        setErorMessage('Movie has been add already');
      }
    } else {
      setErorMessage('There are not movie for adding');
    }
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
              className={`input ${isError ? 'is-danger' : ''}`}
              onChange={handleChange}
              value={filedValue}
            />
          </div>

          <p className="help is-danger" style={{ display: errorMessage ? 'inline' : 'none' }}>
            {errorMessage}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={getMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {isLoad ? <MovieCard {...newMovie} /> : null}
      </div>
    </>
  );
};
