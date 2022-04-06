import React, { useState } from 'react';
import { MoviesList } from '../MoviesList';

type Props = {
  deleteMovie: (movie: Movie) => void,
  movies: Movie[],
};

export const Favourites: React.FC<Props> = ({ deleteMovie, movies }) => {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState(0);
  const [preparedMovies, setPreparedMovies] = useState(movies);

  const visibleMovies = () => {
    const isTitleIncludes = (movieTitle: string) => movieTitle
      .toLowerCase()
      .includes(title.toLowerCase());

    const isBodyIncludes = (movieBody: string) => movieBody
      .toLowerCase()
      .includes(title.toLowerCase());

    const isCorrectYear = (movieYear: number) => movieYear === year;

    const filterCallback = year
      ? movies.filter((movie) => (isTitleIncludes(movie.Title)
        || isBodyIncludes(movie.Plot)) && isCorrectYear(movie.Year))
      : movies.filter((movie) => isTitleIncludes(movie.Title)
        || isBodyIncludes(movie.Plot));

    return filterCallback;
  };

  const handleInputTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setTitle(value);
  };

  const handleInputYear = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setYear(+value);
  };

  const submitForm: React.FormEventHandler = (event) => {
    event.preventDefault();

    setPreparedMovies(visibleMovies());

    setTitle('');
  };

  const resetFilter: React.FormEventHandler = (event) => {
    event.preventDefault();

    setPreparedMovies(movies);

    setTitle('');
  };

  return (
    <div className="ml-6 mr-6">
      <div>
        <form onSubmit={submitForm}>
          <div className="field">
            <label className="label" htmlFor="movie-title">
              Key words to search
              <div className="control">
                <input
                  value={title}
                  onChange={handleInputTitle}
                  type="text"
                  id="movie-title"
                  placeholder="Enter a key word to search"
                  className="input"
                  required
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
                  placeholder="Enter a year to search"
                  className="input"
                />
              </div>
            </label>
          </div>

          <div className="field is-grouped">
            <div className="control">
              <button
                type="submit"
                className="button is-primary is-light"
              >
                Filter movies
              </button>
              <button
                type="button"
                className="button is-warning is-light ml-6"
                onClick={resetFilter}
              >
                Reset filter
              </button>
            </div>
          </div>
        </form>
      </div>
      <div className="mt-3">
        <MoviesList movies={preparedMovies} deleteMovie={deleteMovie} />
      </div>
    </div>
  );
};
