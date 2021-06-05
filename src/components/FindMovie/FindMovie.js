import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getFilm } from '../../api/requests';

const imdbUrl = 'https://www.imdb.com/title/';

export const FindMovie = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [errorVisibility, seterrorVisibility] = useState(false);
  const [filmsInList, setFilmInList] = useState([
    'tt1375666', 'tt0314331', 'tt0319262', 'tt3748528', 'tt0457939',
  ]);
  const [film, setFilm] = useState({
    title: null,
    description: null,
    imgUrl: null,
    imdbUrl: null,
    imdbId: null,
    response: false,
  });

  useEffect(() => {
    if (errorVisibility) {
      seterrorVisibility(false);
    }

    document.querySelector('.input').classList.remove('is-danger');
  }, [query]);

  const hadleClickAddToList = () => {
    setQuery('');

    if (!film.response) {
      return;
    }

    if (filmsInList.includes(film.imdbId)) {
      return;
    }

    setFilmInList([...filmsInList, film.imdbId]);
    addMovie(film);
  };

  const handleClickFindMovie = async() => {
    if (query === '') {
      return;
    }

    const movie = await getFilm(query);
    const { Title, Plot, Poster, imdbID, Response } = movie;

    if (Response === 'True') {
      setFilm({
        title: Title,
        description: Plot,
        imgUrl: Poster,
        imdbId: imdbID,
        imdbUrl: imdbUrl + imdbID,
        response: Response === 'True',
      });
    } else {
      setFilm({});
      seterrorVisibility(true);
      document.querySelector('input').classList.add('is-danger');
    }
  };

  return (
    <>
      <form className="find-movie" onChange={event => event.preventDefault()}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input"
              value={query}
              onChange={event => setQuery(event.target.value)}
            />
          </div>

          {errorVisibility && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title.
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleClickFindMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={hadleClickAddToList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {film.response && (
      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard {...film} />
      </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
