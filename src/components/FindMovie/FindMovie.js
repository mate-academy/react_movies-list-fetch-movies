import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie, movies }) => {
  const API_URL = `https://www.omdbapi.com/?apikey=dfe9f484&t=`;
  const [searchingTitle, setSearchingTitle] = useState('');
  const [newMovie, setNewMovie] = useState({
    title: '',
    description: '',
    imgUrl: '',
    imdbUrl: '',
    imdbId: '',
  });
  const [sameFilm, setSameFilm] = useState(false);
  const [errorLoad, setErrorLoad] = useState(false);
  const [emptyForm, setEmptyForm] = useState(false);

  const clearForm = () => {
    setNewMovie({
      title: '',
      description: '',
      imgUrl: '',
      imdbUrl: '',
      imdbId: '',
    });
    setSearchingTitle('');
  };

  const loadFilm = async() => {
    setEmptyForm(false);
    const url = `${API_URL}${searchingTitle}`;
    const film = await fetch(url).then(response => response.json());
    const { Title, Plot, imdbID } = film;
    let { Poster } = film;

    Poster = (Poster === 'N/A')
      ? `https://bytes.ua/wp-content/uploads/2017/08/no-image.png`
      : Poster;

    if (film.Response === 'False') {
      setErrorLoad(true);
      clearForm();
    } else {
      setErrorLoad(false);
      setNewMovie({
        title: Title,
        description: Plot,
        imgUrl: Poster,
        imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        imdbId: imdbID,
      });
    }
  };

  const onAddMovie = () => {
    setErrorLoad(false);
    if (searchingTitle === '') {
      setEmptyForm(true);
    } else if (movies.some(movie => movie.imdbId === newMovie.imdbId)) {
      setSameFilm(true);
    } else {
      addMovie(prev => (
        [...prev, newMovie]));
      clearForm();
      setSameFilm(false);
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
              className="input is-danger"
              value={searchingTitle}
              onChange={(e) => {
                setErrorLoad(false);
                setSameFilm(false);
                setSearchingTitle(e.target.value);
              }}
            />
          </div>

          {errorLoad && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
          {emptyForm && (
            <p className="help is-danger">
              Search film before adding
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={loadFilm}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={onAddMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {newMovie.imdbId !== '' && (
      <div className="container">
        <h2 className="title">
          Preview
          {sameFilm && (
          <span
            style={{
              color: 'red',
              fontSize: '16px',
            }}
          >
            <br />
            (Has already been added)
          </span>
          )}
        </h2>
        <MovieCard
          title={newMovie.title}
          description={newMovie.description}
          imgUrl={newMovie.imgUrl}
          imdbUrl={newMovie.imdbUrl}
          imdbId={newMovie.imdbId}
        />
      </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imgUrl: PropTypes.string.isRequired,
    imdbUrl: PropTypes.string.isRequired,
    imdbId: PropTypes.string.isRequired,
  })).isRequired,
  addMovie: PropTypes.func.isRequired,
};
