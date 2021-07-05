import React, { useEffect, useState } from 'react';
import movies from './api/movies.json';

import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

function App() {
  const [moviesList, setMovieList] = useState([]);

  useEffect(() => {
    setMovieList(() => [...movies]);
  }, []);

  function addMovieToList(AllInfoMovie) {
    const hasSimilarMovie = moviesList
      .find(movie => movie.title === AllInfoMovie.Title);

    if (hasSimilarMovie) {
      return;
    }

    setMovieList(() => ([
      {
        title: AllInfoMovie.Title,
        description: AllInfoMovie.Plot,
        imgUrl: AllInfoMovie.Poster,
        imdbId: AllInfoMovie.imdbID,
        imdbUrl: `https://www.imdb.com/title/${AllInfoMovie.imdbID}/`,
      },
      ...moviesList,
    ]));
  }

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList moviesList={moviesList} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovieToList={addMovieToList}
        />
      </div>
    </div>
  );
}

export default App;
