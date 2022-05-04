/* eslint-disable */
import React, {useEffect, useState} from 'react';
import { useSearchParams } from 'react-router-dom';
import { MoviesList } from '../MoviesList';

type Props = {
  deleteMovie: (movie: Movie) => void,
  movies: Movie[],
};

export const Favourites: React.FC<Props> = ({ deleteMovie, movies }) => {
  const [preparedMovies, setPreparedMovies] = useState<Movie[]>([]);
  const [inputTitle, setInputTitle] = useState('');
  const [inputYear, setInputYear] = useState(0);
  const [params, setParams] = useSearchParams('');
  const [sortParams, setSortParams] = useState('');

  enum SortType {
    Clear = '',
    Year = 'byYear',
    Title = 'byTitle',
  }

  const visibleMovies = () => {
    const title = params.get('title') || '';
    const year = params.get('year') || 0;

      const isTitleIncludes = (movieTitle: string) => movieTitle
          .toLowerCase()
          .includes(title.toLowerCase());

      const isCorrectYear = (movieYear: number) => movieYear === +year;

      return  year
        ? movies.filter((movie) => (isTitleIncludes(movie.Title)
          || isCorrectYear(movie.Year)))
        : movies.filter((movie) => isTitleIncludes(movie.Title));
  };

  const sortedMovies = (movies: Movie[]) => {
    return [...movies].sort((movie1, movie2) => {
      switch (sortParams) {
        case SortType.Year:
          return movie1.Year - movie2.Year;

        case SortType.Title:
          return movie1.Title.localeCompare(movie2.Title);

        default:
          return 0;
      }
    });
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

    console.log('12345');
    console.log(sortedMovies(visibleMovies()));

    setPreparedMovies(sortedMovies(visibleMovies()));

    setInputTitle('');
    setInputYear(0);
  };

  const resetFilter: React.FormEventHandler = (event) => {
    event.preventDefault();

    setPreparedMovies(movies);

    setInputTitle('');
    setInputYear(0);
  };

  useEffect(() => setPreparedMovies(movies), [movies]);

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

          <div className="field is-grouped is-grouped-centered">
            <div className="control level-item">
              <button
                type="submit"
                className="button is-primary is-light"
              >
                Filter movies
              </button>
              <div className="control has-icons-left ml-6">
                <div className="select is-medium">
                  <select onChange={handleSelectSortType}>
                    <option>Select sort type</option>
                    <option>Sort by Year</option>
                    <option>Sort by Title</option>
                  </select>
                </div>
                <span className="icon is-medium is-left">
                  <i className="fas fa-globe"></i>
                </span>
              </div>
              <button
                type="button"
                className="button is-warning is-light ml-6"
                onClick={resetFilter}
              >
                Reset filter
              </button>
              <button
                type="button"
                className="button is-danger is-light ml-6"
                onClick={resetFilter}
              >
                Reset all
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
