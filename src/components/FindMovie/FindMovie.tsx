/* eslint-disable */
import React, {useEffect, useState} from 'react';
import classNames from 'classnames';

import { getMovies } from '../../api/movies';
import { MoviesList } from "../MoviesList";

type Props = {
  addMovie: (movie: Movie) => void,
  deleteMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie, deleteMovie }) => {
  const [error, setError] = useState(false);
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(0);
  const [page, setPage] = useState(1);

  const searchMovie = () => {
    getMovies(title, year, page)
      .then(newMovie => {
        if (newMovie.Response === 'False') {
          setMovies([]);
          setError(true);
          console.log('error');
        } else if (newMovie) {
          console.log('Page', page);
          setMovies(newMovie);
          setError(false);
        }
      });

    console.log(movies);
  };

  const updatePagination = (value: number) => {
    setPage(value);
    searchMovie();
  }

  console.log(movies);

  const handleInputTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setError(false);
    setTitle(value);
  };

  const handleInputYear = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setError(false);
    setYear(+value);
  };


  const submitForm: React.FormEventHandler = (event) => {
    event.preventDefault();

    window.alert('Random movie added');

    if (movies) {
      addMovie(movies[0]);
      // setTitle('');
      // setMovies([]);
      setError(false);
    }
  };

  useEffect(() => searchMovie(), [page, title, year]);

  return (
    <>
      <form onSubmit={submitForm}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title

            <div className="control">
              <input
                value={title}
                onChange={handleInputTitle}
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input',
                  { 'input is-danger': error })}
              />
            </div>
          </label>

          <label className="label" htmlFor="movie-year">
            Movie year

            <div className="control">
              <input
                value={year}
                onChange={handleInputYear}
                type="number"
                id="movie-year"
                placeholder="Enter a title to search"
                className={classNames('input',
                  { 'input is-danger': error })}
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
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title mt-3">Preview</h2>
        <nav className="pagination" role="navigation" aria-label="pagination">
          <a onClick={() => updatePagination(page - 1)} className={classNames('pagination-previous', { 'is-hidden': page === 1 })} title="This is the first page">Previous</a>
          <a onClick={() => updatePagination(page + 1)} className={classNames('pagination-next', { 'is-hidden': page === 3 })}>Next page</a>
          <ul id="test" className="pagination-list">
            <li>
              <a onClick={() => updatePagination(1)} className={classNames('pagination-link', { 'is-current': page === 1 })} aria-label="Page 1" aria-current="page">1</a>
            </li>
            <li>
              <a onClick={() => updatePagination(2)} className={classNames('pagination-link', { 'is-current': page === 2 })} aria-label="Goto page 2">2</a>
            </li>
            <li>
              <a onClick={() => updatePagination(3)} className={classNames('pagination-link', { 'is-current': page === 3 })} aria-label="Goto page 3">3</a>
            </li>
          </ul>
        </nav>
          <MoviesList addMovie={addMovie} movies={movies} deleteMovie={deleteMovie} />
      </div>
    </>

  );
};
