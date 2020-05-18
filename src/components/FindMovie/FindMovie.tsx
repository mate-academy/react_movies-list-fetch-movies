import React, { useState, FormEvent } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { FindMoviePropsType } from '../../interfaces';


export const FindMovie = (props: FindMoviePropsType) => {
  const { movies, setMovies } = props;
  const [foundMovie, setFoundMovie] = useState({
    title: '',
    description: '',
    imgUrl: '',
    imdbUrl: '',
    imdbId: '',
  });
  const [seachingFieldValue, setSeachingFieldValue] = useState('');
  const [isMovieFound, setIsMovieFound] = useState(true);
  const [isAlreadyAtList, setIsAlreadyAtList] = useState(false);
  const API_URL = 'https://www.omdbapi.com/';


  const getNewMovieFromServer = () => {
    return fetch(`${API_URL}?apikey=967a07c6&t=${seachingFieldValue}`)
      .then(response => response.json());
  };

  const handleSeachingFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    getNewMovieFromServer()
      .then(movie => {
        if (movie.Response === 'False') {
          setIsMovieFound(false);
        }

        const {
          Title, Plot, Poster, imdbID,
        } = movie;

        setFoundMovie({
          title: Title,
          description: Plot,
          imgUrl: Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
        });
        setIsAlreadyAtList(false);
      });
  };

  const handleSeachingFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setSeachingFieldValue(value);
    setIsMovieFound(true);
  };

  const handleAddButtonClick = () => {
    if (!foundMovie.title) {
      return;
    }

    if (movies.find((movie: Movie) => movie.imdbId === foundMovie.imdbId)) {
      setIsAlreadyAtList(true);

      return;
    }

    setMovies([...movies, foundMovie]);
    setFoundMovie({
      title: '',
      description: '',
      imgUrl: '',
      imdbUrl: '',
      imdbId: '',
    });
    setSeachingFieldValue('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSeachingFormSubmit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${isMovieFound ? '' : 'is-danger'}`}
              value={seachingFieldValue}
              onChange={handleSeachingFieldChange}
            />
          </div>

          <p
            className={`help ${isMovieFound ? 'invisible' : ''} is-danger`}
          >
            Can&apos;t find a movie with such a title
          </p>
          <p
            className="is-danger"
          >
            {isAlreadyAtList
              ? 'You already have one on your list.'
              : ''}
          </p>

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"

            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAddButtonClick}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {foundMovie.title && <MovieCard {...foundMovie} />}

      </div>
    </>
  );
};
