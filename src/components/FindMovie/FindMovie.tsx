import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [inputAlert, setInputAlert] = useState(false);
  const [inputValue, setInpuValue] = useState('');

  const requestFilm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    getMovie(inputValue).then(res => {
      if ('Title' in res) {
        const poster = res.Poster === 'N/A'
          ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
          : res.Poster;

        setMovie({
          title: res.Title,
          description: res.Plot,
          imgUrl: poster,
          imdbUrl: 'images/imdb-logo.jpeg',
          imdbId: res.imdbID,
        });
      } else {
        setInputAlert(true);
      }
    });
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${inputAlert && 'is-danger'}`}
              value={inputValue}
              onChange={e => {
                setInpuValue(e.target.value);
                if (!e.target.value) {
                  setInputAlert(false);
                }
              }}
            />
          </div>

          <p className="help is-danger" data-cy="errorMessage">
            {inputAlert && `Can ${inputValue} find a movie with such a title`}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className="button is-light"
              disabled={!inputValue}
              onClick={e => requestFilm(e)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
              disabled={!movie}
              onClick={() => {
                if (movie) {
                  setMovies(prev => [...prev, movie]);
                  setMovie(null);
                  setInpuValue('');
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {movie
        && (
          <MovieCard
            movie={movie}
          />
        )}
      </div>
    </>
  );
};
