import React from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import movies from '../../api/movies.json';
import { fetchData } from '../../Api';
import { movieType } from '../Interfaces/Interface';
import { URL } from '../Interfaces/Constants';

type findMovieType = {
  handleChange: (event: React.FormEvent<HTMLInputElement>) => void;
  title: string;
};

export const FindMovie: React.FC<findMovieType> = ({ handleChange, title }) => {
  const loadData = async () => {
    const dataFromServer = await fetchData<movieType>(`${URL}${title}`);

    if (dataFromServer.Response === 'False') {
      console.log('non found');
    } else {
      const newMovie = {
        title: dataFromServer.Title,
        description: dataFromServer.Plot,
        imgUrl: dataFromServer.Poster,
        imdbUrl: `https://www.imdb.com/title/${dataFromServer.imdbID}`,
        imdbId: dataFromServer.imdbID,
      };

      console.log(newMovie);
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
              className="input is-danger"
              onChange={handleChange}
            />
          </div>

          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
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
              disabled={true}
              type="button"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard {...movies[0]} />
      </div>
    </>
  );
};
