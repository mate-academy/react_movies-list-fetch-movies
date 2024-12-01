import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

interface Props {
  setMovies: (value: Movie[]) => void;
  movies: Movie[];
}

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [inputSearch, setInputSearch] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [loader, setLoader] = useState(false);
  const prevInputSearch = useRef(inputSearch);

  const handleInputSearch = (item: React.ChangeEvent<HTMLInputElement>) => {
    setInputSearch(item.target.value);
  };

  const handleSubmitSearch = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setLoader(true);

    try {
      const result: MovieData | ResponseError = await getMovie(inputSearch);

      if ('Response' in result && result.Response === 'False') {
        setErrorMessage("Can't find a movie with such a title");
      } else {
        const movieData = result as MovieData;

        const { Title, Poster, Plot, imdbID } = movieData;

        const movieFromApi: Movie = {
          title: Title,
          description: Plot,
          imgUrl:
            Poster !== 'N/A'
              ? Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        };

        setFoundMovie(movieFromApi);
        setErrorMessage('');
      }
    } finally {
      setLoader(false);
    }
  };

  const reset = () => {
    setInputSearch('');
    setFoundMovie(null);
    setErrorMessage('');
  };

  const addMovies = () => {
    if (foundMovie?.imdbId) {
      let includesMovie = false;

      movies.forEach(movie => {
        if (movie.imdbId === foundMovie.imdbId) {
          includesMovie = true;

          return;
        }
      });

      if (!includesMovie) {
        setMovies([...movies, foundMovie]);
      }

      reset();
    }
  };

  useEffect(() => {
    if (prevInputSearch.current !== inputSearch) {
      prevInputSearch.current = inputSearch;
    }
  }, [inputSearch]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => handleSubmitSearch(event)}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input"
              value={inputSearch}
              onChange={input => handleInputSearch(input)}
            />
          </div>
          {!foundMovie?.imdbId && prevInputSearch.current === inputSearch && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!inputSearch}
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': loader,
              })}
            >
              Find a movie
            </button>
          </div>

          {foundMovie?.imdbId && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovies}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {foundMovie?.imdbId && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
