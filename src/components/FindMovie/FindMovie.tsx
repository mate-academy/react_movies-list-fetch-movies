import React, { useState } from 'react';
import cn from 'classnames';

import './FindMovie.scss';
import { getMovie } from '../../helpers';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: MovieCard[];
  setMovies: (value: MovieCard[]) => void;
};

const defaultMovieCard = {
  title: '',
  description: '',
  imgUrl: '',
  imdbUrl: '',
  imdbId: '',
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<MovieCard>(defaultMovieCard);
  const [errorMessage, setErrorMessage] = useState('');

  const findMovie = async () => {
    const result = await getMovie(searchQuery);

    setErrorMessage('');

    if (result.Response === 'True') {
      const foundMovie: MovieCard = {
        title: result.Title,
        description: result.Plot,
        imgUrl: result.Poster,
        imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
        imdbId: result.imdbID,
      };

      setSearchResult(foundMovie);

      return;
    }

    setErrorMessage('Can&apos;t find a movie with such a title');
  };

  const checkMovie = () => {
    if (!searchResult.imdbId) {
      return;
    }

    if (movies.find(movie => movie.imdbId === searchResult.imdbId)) {
      setErrorMessage('This movie is already on the list');

      return;
    }

    setMovies([...movies, searchResult]);
    setSearchResult(defaultMovieCard);
    setSearchQuery('');
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    findMovie();
  };

  const handleClickSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    checkMovie();
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFormSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': errorMessage })}
              value={searchQuery}
              autoComplete="off"
              onChange={e => {
                setSearchQuery(e.target.value);
                setErrorMessage('');
              }}
            />
          </div>

          {errorMessage && <p className="help is-danger">{errorMessage}</p>}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleClickSubmit}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {searchResult.imdbId && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...searchResult} />
        </div>
      )}
    </>
  );
};
