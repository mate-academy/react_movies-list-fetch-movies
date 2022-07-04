/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MoviesList } from '../MoviesList';

type Props = {
  deleteMovie: (movie: Movie) => void,
  movies: Movie[],
  addMovie: (movie: Movie) => void,
  setLocalStorage: (movies: Movie[]) => void,
};

export const Favourites: React.FC<Props> = ({ deleteMovie, movies, addMovie, setLocalStorage }) => {
  const [preparedMovies, setPreparedMovies] = useState<Movie[]>([]);
  const [inputTitle, setInputTitle] = useState('');
  const [inputYear, setInputYear] = useState(0);
  const [params, setParams] = useSearchParams('');
  const [sortParams, setSortParams] = useState('');

  enum SortType {
    Clear = '',
    Year = 'Sort by Year',
    Title = 'Sort by Title',
  }

  const visibleMovies = () => {
    const title = params.get('title') || '';
    const year = params.get('year') || 0;
    console.log('title', title);

      const isTitleIncludes = (movieTitle: string) => movieTitle
          .toLowerCase()
          .includes(title.toLowerCase());

      const isCorrectYear = (movieYear: number) => movieYear === +year;

      console.log('filter', movies.filter((movie) => isTitleIncludes(movie.Title)))

      return  year
        ? movies.filter((movie) => (isTitleIncludes(movie.Title)
          || isCorrectYear(movie.Year)))
        : movies.filter((movie) => isTitleIncludes(movie.Title));
  };

  const sortedMovies = (ourMovies: Movie[]) => {
    const sortCallback = (movie1: Movie, movie2: Movie) => {
      switch (sortParams) {
        case SortType.Year:
          console.log(movie1.Title,'|', movie2.Title, movie1.Year, movie2.Year, movie1.Year - movie2.Year)
          return movie2.Year - movie1.Year;

        case SortType.Title:
          return movie1.Title.localeCompare(movie2.Title);

        default:
          return 0;
      }
    }
    const finalMovies = [...ourMovies].sort((movie1, movie2) => sortCallback(movie1, movie2));

    console.log(sortParams);
    console.log('Final', finalMovies);
    return finalMovies;
  }

  const handleInputTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputTitle(value);
  };

  const handleInputYear = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputYear(+value);
  };

  const handleSelectSortType = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;

    setSortParams(value);
  };

  const submitForm: React.FormEventHandler = (event) => {
    event.preventDefault();

    setParams({ year: inputYear.toString(), title: inputTitle });

    console.log(sortedMovies(visibleMovies()));

    setPreparedMovies(sortedMovies(visibleMovies()));

    setInputTitle('');
    setInputYear(0);
  };

  const resetFilter: React.FormEventHandler = (event) => {
    event.preventDefault();

    setSortParams('')
    setParams('');
    setPreparedMovies(movies);

    setInputTitle('');
    setInputYear(0);
  };

  useEffect(() => {
    return setPreparedMovies(sortedMovies(visibleMovies()));
  }, [movies, params, sortParams]);

  return (
    <div className="ml-6 mr-6">
      <div>
        <form onSubmit={submitForm}>
          <div className="field">
            <label className="label" htmlFor="movie-title">
              Key words to search
              <div className="control">
                <input
                  value={inputTitle}
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
                  value={inputYear}
                  onChange={handleInputYear}
                  type="number"
                  id="movie-year"
                  placeholder="Enter a year to search"
                  className="input"
                />
              </div>
            </label>
          </div>

          <div className="field columns">
            <div className="control column has-text-centered-mobile level-item">
              <button
                type="submit"
                className="button is-normal is-primary is-light ml-0 mt-3"
              >
                Filter movies
              </button>

              <button
                type="button"
                className="button is-normal is-warning is-light ml-3 mt-3"
                onClick={resetFilter}
              >
                Reset filter
              </button>
              <button
                type="button"
                className="button is-normal is-danger is-light ml-3 mt-3"
                onClick={() => setLocalStorage([])}
              >
                Reset all
              </button>
            </div>

            <div className="control mt-4 has-icons-left has-text-centered-mobile">
              <div className="select is-medium">
                <select onChange={handleSelectSortType}>
                  <option>Select sort type</option>
                  <option>Sort by Year</option>
                  <option>Sort by Title</option>
                </select>
              </div>
              <span className="icon is-medium is-left is-hidden-mobile">
                  <i className="fas fa-globe"></i>
                </span>
            </div>
          </div>
        </form>
      </div>
      <div className="mt-5 container">
        <MoviesList addMovie={addMovie} movies={preparedMovies} deleteMovie={deleteMovie} />
      </div>
    </div>
  );
};
