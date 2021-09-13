import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api/api';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: React.Dispatch<React.SetStateAction<Movie[]>>;
  movies: Movie[];
}

export const FindMovie: React.FC<Props> = (props) => {
  const [query, setQuery] = useState('');
  const [title, setTitle] = useState('');
  const [plot, setPlot] = useState('');
  const [poster, setPoster] = useState('');
  const [id, setId] = useState('');
  const newMovie = {
    title,
    description: plot,
    imgUrl: poster,
    imdbUrl: `https://www.imdb.com/title/${id}/`,
    imdbId: id,
  };
  const { addMovie, movies } = props;
  const isMovieInTheList = movies
    .find(movie => movie.imdbId === newMovie.imdbId);

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
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': !title && query,
              })}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                if (!id) {
                  setTitle(event.target.value);
                }
              }}
            />
          </div>

          {query && !title && (
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
              onClick={async () => {
                if (query) {
                  const searchedMovie = getMovie(query);

                  setTitle(await searchedMovie
                    .then(movie => movie.Title));

                  setPlot(await searchedMovie
                    .then(movie => movie.Plot));

                  setPoster(await searchedMovie
                    .then(movie => movie.Poster));

                  setId(await searchedMovie
                    .then(movie => movie.imdbID));
                }
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!id || !!isMovieInTheList}
              onClick={() => {
                addMovie([newMovie, ...movies]);
                setQuery('');
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {id && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...newMovie} />
        </div>
      )}
    </>
  );
};
