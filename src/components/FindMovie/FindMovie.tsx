import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

type Props = {
  movies: Movie[];
  setMovies: (value: Movie[]) => void;
};

const defaultMovie = {
  title: '',
  description: '',
  imgUrl: '',
  imdbUrl: '',
  imdbId: '',
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<Movie>(defaultMovie);
  const [errorMessage, setErrorMessage] = useState('');

  const findMovieSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await getMovie(query);

    setErrorMessage('');

    if (result.Response === 'True') {
      const foundMovie: Movie = {
        title: result.Title,
        description: result.Plot,
        imgUrl: result.Poster,
        imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
        imdbId: result.imdbID,
      };

      setSearchResult(foundMovie);

      return;
    }

    setErrorMessage("Can't find a movie with such a title");
  };

  const handleClickAddMovie = () => {
    if (!searchResult.title) {
      setErrorMessage('First you should find a movie');

      return;
    }

    if (movies.find(movie => movie.title === searchResult.title)) {
      setErrorMessage('This movie is already added');

      return;
    }

    setMovies([...movies, searchResult]);
    setSearchResult(defaultMovie);
    setQuery('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={findMovieSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': errorMessage,
              })}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setErrorMessage('');
              }}
            />
          </div>
          {
            errorMessage
            && (
              <p className="help is-danger">
                {errorMessage}
              </p>
            )
          }
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
              onClick={handleClickAddMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {searchResult.title && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...searchResult} />
        </div>
      )}
    </>
  );
};
