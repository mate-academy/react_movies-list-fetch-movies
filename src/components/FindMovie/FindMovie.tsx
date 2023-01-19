import React, { Dispatch, SetStateAction, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  setMovies: Dispatch<SetStateAction<Movie[]>>,
  movies: Movie[],
};

export const FindMovie: React.FC<Props> = ({ setMovies, movies }) => {
  const [input, setInput] = useState('');
  const [isMovieFound, setIsMovieFound] = useState<null | boolean>(null);
  const [isMovieLoading, setIsMovieLoading] = useState(false);

  const initialPreview = {
    title: '',
    description: '',
    imgUrl: '',
    imdbUrl: '',
    imdbId: '',
  };

  const [moviePreview, setMoviePreview] = useState(initialPreview);

  const visiblePreview = moviePreview.imdbId;
  const activeControls = isMovieFound && visiblePreview;

  const handleMovieSearch = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();

    setIsMovieLoading(true);
    setMoviePreview(initialPreview);

    getMovie(input)
      .then(newMovie => {
        if ('imdbID' in newMovie) {
          const {
            Title,
            Plot,
            imdbID,
            Poster,
          } = newMovie;

          let image;

          if (!Poster.includes('https://')) {
            image = (
              'https://via.placeholder.com/360x270.png?text=no%20preview'
            );
          } else {
            image = Poster;
          }

          setMoviePreview(
            {
              title: Title,
              description: Plot,
              imgUrl: image,
              imdbUrl: `https://www.imdb.com/title/${imdbID}`,
              imdbId: imdbID,
            },
          );
        } else {
          setIsMovieFound(false);
        }
      })
      .finally(() => setIsMovieLoading(false));
  };

  const handleAddToList = () => {
    const duplicateMovie = movies.find(movieOnFile => (
      movieOnFile.imdbId === visiblePreview
    ));

    if (duplicateMovie || !visiblePreview) {
      setMoviePreview(initialPreview);

      return;
    }

    setMovies([
      ...movies,
      moviePreview,
    ]);

    setMoviePreview(initialPreview);
    setInput('');
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.currentTarget.value);
    setIsMovieFound(true);
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
              className="input is-dander"
              value={input}
              onChange={handleInput}
            />
          </div>

          {isMovieFound === false && (
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
              className={isMovieLoading
                ? 'button is-light is-loading'
                : 'button is-light'}
              disabled={!input}
              onClick={handleMovieSearch}
            >
              Find a movie
            </button>
          </div>

          {activeControls && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddToList}
              >
                Add to the list
              </button>
            </div>
          ) }
        </div>
      </form>

      {activeControls && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {visiblePreview && <MovieCard movie={moviePreview} />}
        </div>
      )}
    </>
  );
};
