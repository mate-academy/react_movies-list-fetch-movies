/* eslint-disable no-console */
import React, { useState } from 'react';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

// import { MovieCard } from '../MovieCard';

interface Props {
  addMovieToList: (movie:Movie | undefined) => void
}

export const FindMovie: React.FC<Props> = ({ addMovieToList }) => {
  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const [inputValue, setInputValue] = useState<string>('');
  const [inputValidation, setInputValidation] = useState(false);

  async function getMovie() {
    await fetch(`https://www.omdbapi.com/?apikey=87973f3e&t=${inputValue}`)
      .then(mov => mov.json())
      .then(item => {
        if (!item.Error) {
          console.log(item);
          setMovie(item);
          setInputValidation(false);
        } else {
          setInputValidation(true);
        }
      });
  }

  function addToTheList() {
    addMovieToList(movie);
    setMovie(undefined);
    setInputValue('');
  }

  return (
    <>
      <form className="find-movie">

        <div className="field">
          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${inputValidation && 'is-danger'}`}
              value={inputValue}
              onChange={(event) => {
                setInputValue(event.target.value);
              }}
            />
          </div>
          {inputValidation && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          ) }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => {
                getMovie();
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addToTheList();
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie !== undefined ? <MovieCard movie={movie} /> : null}
      </div>
    </>
  );
};
