import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
    //errorVisible: false,
  };


    getDataFromChild = (newMovie) => {
     const isSameMovie = this.state.movies.some(movie => movie.imdbID === newMovie.imdbID)
     if(!isSameMovie) {
      this.setState(currentState => ({
        movies: [
          ...currentState.movies,
          newMovie
        ]
      }));
     }
      
    }


  render() {
    const { movies } = this.state;
    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie 
          onDataRequest={this.getDataFromChild} /*получаю данные от дочернего*/ 
          errorVisible={this.state.errorVisible}
          /> 
        </div>
      </div>
    );
  }
}
