import React, { FC, useCallback, useState } from 'react';
import './FindMovie.scss';

import axios from 'axios';
import cN from 'classnames';
import { MovieCard } from '../MovieCard';
import API_URL from '../../api/api';

export const FindMovie: FC<FindMovieProps> = ({ addMovie, addingError }) => {
  const [searchInput, setSearchInput] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imgUrl, setImgUrl] = useState('');
  const [imdbUrl, setImdbUrl] = useState('');
  const [imdbId, setImdbId] = useState('');
  const [error, setError] = useState(false);
  const [errorTitle, setErrorTitle] = useState(false);
  const [isPreviewReady, setPreviewReady] = useState(false);
  const [isFilmAdded, setAddingStatus] = useState(false);

  const saveInputValue = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchInput(e.target.value);
      setError(false);
      setErrorTitle(false);
    }, [setSearchInput],
  );

  const handleSearch = (e: React.MouseEvent) => {
    e.preventDefault();

    axios.get(`${API_URL}&t=${searchInput.split(' ').join('+')}`)
      .then(res => {
        if (res.data.Error) {
          setError(true);

          return;
        }

        setTitle(res.data.Title);
        setDescription(res.data.Plot);
        setImgUrl(res.data.Poster);
        setImdbUrl(`https://www.imdb.com/title/${res.data.imdbID}`);
        setImdbId(res.data.imdbID);
        setPreviewReady(true);
        setAddingStatus(false);
      });
  };

  const onBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.id === 'movie-title') {
      if (searchInput.length === 0
        || searchInput.trim() === '') {
        setErrorTitle(true);
      } else {
        setErrorTitle(false);
      }
    }
  };

  const handleAddingToList = () => {
    if (!error && title.trim().length > 0) {
      addMovie({
        title, description, imgUrl, imdbUrl, imdbId,
      });
      setSearchInput('');
      setTitle('');
      setDescription('');
      setImgUrl('');
      setImdbUrl('');
      setImdbId('');
      setAddingStatus(true);
      setPreviewReady(false);
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
              value={searchInput}
              id="movie-title"
              placeholder="Enter a title to search"
              className={cN({
                input: true,
                'is-danger': error,
              })}
              onChange={saveInputValue}
              onBlur={onBlur}
            />
          </div>

          {errorTitle && (
            <p className="help is-danger">
              Please, write a title
            </p>
          )}
          {error && (
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
              onClick={handleSearch}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAddingToList}
              disabled={!isPreviewReady}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {addingError
      && (
        <div className="adding-error-container">
          <p className="adding-error">
            This film has been already added
          </p>
        </div>
      )}

      {isPreviewReady
      && !isFilmAdded
      && (
        <div className="container">
          <h2 className="title">Preview</h2>
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
