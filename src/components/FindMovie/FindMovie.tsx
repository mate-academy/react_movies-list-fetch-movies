import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { fetchData } from '../../Api';
import { movieType, oneMovieType } from '../Interfaces/Interface';
import { URL } from '../Interfaces/Constants';

type findMovieType = {
  addMovie: (movie: oneMovieType) => void;
};

export const FindMovie: React.FC<findMovieType> = ({ addMovie }) => {
  const [isFetched, setIsFetched] = useState(false);
  const [preview, setPreview] = useState<oneMovieType>();
  const [isDisabled, setDisabled] = useState(true);
  const [isError, setError] = useState(false);
  const [title, setTitle] = useState('');

  const handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    setError(false);
    setTitle(value);
  };

  const loadData = async () => {
    setIsFetched(true);
    const dataFromServer = await fetchData<movieType>(`${URL}${title}`);

    if (dataFromServer.Response === 'False') {
      setPreview(undefined);
      setDisabled(true);
      setError(true);
    } else {
      const newMovie = {
        title: dataFromServer.Title,
        description: dataFromServer.Plot,
        imgUrl: dataFromServer.Poster,
        imdbUrl: `https://www.imdb.com/title/${dataFromServer.imdbID}`,
        imdbId: dataFromServer.imdbID,
      };

      setPreview(newMovie);
      setDisabled(false);
    }

    setIsFetched(false);
  };

  const keyDownHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { keyCode } = event;

    if (keyCode === 13) {
      event.preventDefault();
      loadData();
    }
  };

  const handleAddingMovie = () => {
    if (preview) {
      addMovie(preview);
      setTitle('');
      setPreview(undefined);
      setDisabled(true);
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
              value={title}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={isError ? 'input error' : 'input correct'}
              onChange={handleInputChange}
              onKeyDown={keyDownHandler}
            />
            {
              isError
                ? <p className="error-text">Movie was not found, please try again!</p>
                : <></>
            }
          </div>
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={loadData}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              disabled={isDisabled}
              type="button"
              className="button is-primary"
              onClick={handleAddingMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {
          isFetched
            ? <p>Loading.....</p>
            : <></>
        }
        {
          preview
            ? <MovieCard movie={preview} />
            : <></>
        }
      </div>
    </>
  );
};
