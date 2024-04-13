import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import cn from 'classnames';

type Props = {
  updateList: (movie: Movie) => void;
  listMovies: Movie[];
};

export const FindMovie: React.FC<Props> = ({ updateList, listMovies }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [response, setResponse] = useState(false);
  const [spiner, setSpiner] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title) {
      return;
    } else if (!movie) {
      setSpiner(true);
    }

    getMovie(title).then(data => {
      const keys = Object.keys(data);

      if (keys[0] === 'Response') {
        setSpiner(false);

        return setResponse(true);
      } else {
        setSpiner(false);
      }

      setResponse(false);

      const { Poster, Title, Plot, imdbID } = data as MovieData;

      const image = Poster.split('');
      const isImage = image.slice(image.length - 3).join('');

      return setMovie({
        title: Title,
        description: Plot,
        imgUrl:
          isImage === 'jpg'
            ? Poster
            : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        imdbId: imdbID,
      });
    });
  };

  const addMovieToList = () => {
    const checkOnDublicates = listMovies.some(
      item => item.imdbId === movie?.imdbId,
    );

    if (movie && !checkOnDublicates) {
      updateList({ ...movie });

      setMovie(null);
    }

    setMovie(null);
  };

  return (
    <>
      <form className="find-movie" onSubmit={onSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={title}
              onChange={e => {
                setTitle(e.target.value);
                setResponse(false);
              }}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': response })}
            />
          </div>
          {response && (
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
              className={cn('button is-light', { 'is-loading': spiner })}
              disabled={!title}
            >
              Find a movie
            </button>
          </div>
          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovieToList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
