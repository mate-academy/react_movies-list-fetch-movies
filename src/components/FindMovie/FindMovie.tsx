import React, { useState, useEffect } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovies } from '../../api/Api';

interface Props {
  handleAddFoundMovie: any;
}

const movie = {
  title: '',
  description: '',
  imgUrl: '',
  imdbUrl: '',
  imdbId: '',
};

export const FindMovie: React.FC<Props> = ({ handleAddFoundMovie }) => {
  const [query, setQuery] = useState('');
  const [movieThatFound, setMovieThatFound] = useState(movie);
  const [showMessage, setShowMessage] = useState(false);

  const getTitle = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(target.value);
  };

  const sendAMovieSearchRequest = () => {
    getMovies(query)
      .then(({
        Title,
        Plot,
        Poster,
        imdbID,
      }) => {
        const newMovie = {
          title: Title,
          description: Plot,
          imgUrl: Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        };

        setMovieThatFound(newMovie);
        setShowMessage(!newMovie.title);
      });
  };

  useEffect(() => {
    setShowMessage(false);
  }, [query]);

  const addMovieThatFound = () => {
    handleAddFoundMovie(movieThatFound);
    setQuery('');
    setMovieThatFound(movie);
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
              className="input is-danger"
              value={query}
              onChange={getTitle}
            />
          </div>

          {showMessage && (
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
              onClick={sendAMovieSearchRequest}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovieThatFound}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movieThatFound.imdbId
          ? <MovieCard {...movieThatFound} />
          : <p>No information to display</p>}
      </div>
    </>
  );
};
