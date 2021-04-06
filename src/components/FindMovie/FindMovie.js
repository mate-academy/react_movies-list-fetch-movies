import React, {useState, useEffect} from 'react';
import classNames from 'classnames'
import {getMovies} from '../../api/api'
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
//import movies from '../../api/movies.json';

export const FindMovie = ({onDataRequest}) => {
  const [errorVisible, setError] = useState(false);
  const [query, setValue] = useState('');
  const [newMovie, setNewMovie] = useState();
  console.log(newMovie)

  const sendRequest = async (movieQuery) => {
    const movie = await getMovies(movieQuery);
    const baseUrl = 'https://www.imdb.com/title/'
    const foundMovie = {
      title: movie.Title,
      description: movie.Plot,
      imgUrl: movie.Poster,
      imdbUrl: `${baseUrl}${movie.imdbID}`,
      imdbId: movie.imdbID,
    }
    console.log('foundMovie:', foundMovie); 
    setNewMovie(foundMovie)
    
  }
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
            value={query}
            onChange={(e)=>{setValue(e.target.value)}}
            className={classNames('input', {'is-danger': errorVisible === true})}
          />
        </div>
        {errorVisible && 
        <p className="help is-danger">
          Can&apos;t find a movie with such a title
        </p>}
        
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="button"
            className="button is-light"
            onClick={()=> sendRequest(query)}
          >
            Find a movie
          </button>
        </div>

        <div className="control">
          <button
            type="button"
            className="button is-primary"
            onClick={() => onDataRequest(newMovie)} //Переброс мувика в родительский
          >
            Add to the list
          </button>
        </div>
      </div>
    </form>

    <div className="container">
      <h2 className="title">Preview</h2>
      {newMovie && <MovieCard {...newMovie} /*undefined до запроса*/ />} 
    </div>
  </>
  )
};

