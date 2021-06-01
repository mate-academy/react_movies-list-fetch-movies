import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie, movies }) => {
  const API_URL = `https://www.omdbapi.com/?apikey=dfe9f484&t=`;
  const [searchingTitle, setSearchingTitle] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [imdbUrl, setImdbUrl] = useState('');
  const [imdbId, setImdbId] = useState('');
  const [sameFilm, setSameFilm] = useState(false);
  const [errorLoad, setErrorLoad] = useState(false);

  const clearForm = () => {
    setTitle('');
    setDescription('');
    setImgUrl('');
    setImdbId('');
    setImdbUrl('');
    setSearchingTitle('');
  };

  const loadFilm = async() => {
    const url = `${API_URL}${searchingTitle}`;
    const film = await fetch(url).then(response => response.json());

    if (film.Response === 'False') {
      setErrorLoad(true);
      clearForm();
    } else {
      setErrorLoad(false);
      setTitle(film.Title);
      setDescription(film.Plot);
      if (film.Poster !== 'N/A') {
        setImgUrl(film.Poster);
      } else {
        setImgUrl(`https://bytes.ua/wp-content/uploads/2017/08/no-image.png`);
      }

      setImdbId(film.imdbID);
      setImdbUrl(`https://www.imdb.com/title/${film.imdbID}`);
    }
  };

  const onAddMovie = () => {
    if (movies.some(movie => movie.imdbId === imdbId)) {
      setSameFilm(true);
    } else {
      addMovie((prev) => {
        const arr = [...prev];

        arr.push({
          title,
          description,
          imgUrl,
          imdbUrl,
          imdbId,
        });

        return arr;
      });
      clearForm();
      setErrorLoad(false);
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
      {imdbId !== '' && (
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
          title={title}
          description={description}
          imgUrl={imgUrl}
          imdbUrl={imdbUrl}
          imdbId={imdbId}
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
