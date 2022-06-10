import React, { useState, Dispatch, SetStateAction } from 'react';
import './FindMovie.scss';
import { request } from '../../api/api';
import { MovieCard } from '../MovieCard';

type InputValue = {
  inputValue: string,
  setInputValue?: Dispatch<SetStateAction<string>>,
};

type SelectedMovie = {
  selectedMovie: Movie,
  setSelectedMovie?: Dispatch<SetStateAction<Movie>>,
};

type Props = {
  currentMovieList: Movie[],
  addFindMovie: any,
};

type InputValid = {
  inputValid: boolean,
  setInputValid?: Dispatch<SetStateAction<boolean>>,
};

export const FindMovie: React.FC<Props> = ({ addFindMovie, currentMovieList }) => {
  const [inputValue, setInputValue] = useState<InputValue>({ inputValue: '' });
  const [inputValid, setInputValid] = useState<InputValid>({ inputValid: true });
  const [selectedMovie, setSelectedMovie] = useState<SelectedMovie>();

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                value={inputValue.inputValue}
                placeholder="Enter a title to search"
                className="input is-danger"
                onChange={(e) => {
                  setInputValid({ inputValid: true });
                  setInputValue({ inputValue: `${e.target.value}` });
                }}
              />
            </div>
          </label>

          {!inputValid.inputValid && (
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
              onClick={() => {
                request(inputValue.inputValue)
                  .then(result => {
                    if (result.Response === 'True') {
                      setSelectedMovie({ selectedMovie: result });
                      setInputValue({ inputValue: '' });
                    } else {
                      setInputValid({ inputValid: false });
                    }
                  });
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
                if (selectedMovie) {
                  if (!currentMovieList.some(el => {
                    return el.imdbID === selectedMovie.selectedMovie.imdbID;
                  })) {
                    addFindMovie(selectedMovie.selectedMovie);
                  }
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {selectedMovie && <MovieCard movie={selectedMovie.selectedMovie} />}
      </div>
    </>
  );
};
