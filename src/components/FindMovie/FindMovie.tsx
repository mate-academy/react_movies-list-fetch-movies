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
  const [seachingFieldValue, setSeachingFildValue] = useState('');
  const [isMovieFound, setIsMovieFound] = useState(true);


  const getNewMovieFromServer = () => {
    return fetch(`http://www.omdbapi.com/?apikey=967a07c6&t=${seachingFieldValue}`)
      .then(responce => responce.json());
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
      });
  };

  const handleSeachingFieldChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setSeachingFildValue(value);
    setIsMovieFound(true);
  };

  const handleAddButtonClick = () => {
    if (!foundMovie.title) {
      return;
    }

    if (movies.find((movie: Movie) => movie.imdbId === foundMovie.imdbId)) {
      setSeachingFildValue('You already have one on your list.');

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
    setSeachingFildValue('');
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
            className={`help ${isMovieFound ? 'unvisible' : ''} is-danger`}
          >
            Can&apos;t find a movie with such a title
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
