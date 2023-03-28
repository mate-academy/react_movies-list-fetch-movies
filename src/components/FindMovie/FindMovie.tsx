import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
// import { MovieData } from '../../types/MovieData';

const initialForm = {
  title: '',
  description: '',
  imgUrl: '',
  imdbUrl: '',
  imdbId: '',
};

export const FindMovie: React.FC<{
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>
}> = ({ setMovies }) => {
  const [findedFilm, setFindedFilm] = useState<Movie>(initialForm);
  const [inputValue, setInputValue] = useState('');

  const searchNewfFilm = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    event.preventDefault();
    const button = event.currentTarget;

    button.classList.add('is-loading');
    try {
      getMovie(inputValue)
        .then(
          (items) => {
            const {
              Poster, Title, Plot, imdbID,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            }: any = items;

            setFindedFilm((prevState) => {
              const image = Poster !== 'N/A' ? Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview';

              return {
                ...prevState,
                title: Title,
                description: Plot,
                imgUrl: image,
                imdbUrl: `http://www.imdb.com/title/${imdbID}`,
                imdbId: imdbID,
              };
            });

            button.classList.remove('is-loading');
          },
        );
    } catch (error) {
      button.classList.remove('is-loading');
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const isRendering = findedFilm.title !== '' && findedFilm.title !== undefined;

  const handleAddFilm = () => {
    if (isRendering) {
      setMovies((prevMovie) => {
        if (prevMovie.some((elem) => elem.imdbId === findedFilm.imdbId)) {
          return prevMovie;
        }

        return [
          ...prevMovie,
          findedFilm,
        ];
      });
    }

    setInputValue('');
    setFindedFilm(initialForm);
  };

  const isFirstError = findedFilm.title === undefined;

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
              className="input is-dander"
              value={inputValue}
              onChange={(event) => setInputValue(event.currentTarget.value)}
            />
          </div>

          {isFirstError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className="button is-light"
              onClick={searchNewfFilm}
              disabled={inputValue === ''}
            >
              Find a movie
            </button>
          </div>

          { inputValue !== '' && isRendering && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddFilm}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {isRendering
        && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={findedFilm} />
          </div>
        )}
    </>
  );
};
