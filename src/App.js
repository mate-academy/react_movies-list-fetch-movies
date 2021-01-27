import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';
import { getMovie } from './api';

export class App extends Component {
  state = {
    movies: data,
    searchedMovie: null,
    found: true,
  };

  findMovie = async(query) => {
    const searchedMovie = await getMovie(query);

    if (searchedMovie.Response === 'True') {
      this.setState({
        searchedMovie: {
          ...searchedMovie,
          title: searchedMovie.Title,
          imdbId: searchedMovie.imdbID,
          description: searchedMovie.Plot,
          imgUrl: searchedMovie.Poster,
        },
        found: true,
      });
    } else {
      this.setState({ found: false });
    }
  }

  addMovie = () => {
    const { searchedMovie } = this.state;

    if (searchedMovie) {
      this.setState(prevState => ({
        movies: [
          ...prevState.movies,
          searchedMovie],
        searchedMovie: null,
        found: true,
      }));
    }
  }

  clearInput = () => {
    this.setState({
      searchedMovie: null, found: true,
    });
  }

  render() {
    const { movies, searchedMovie, found } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie
            found={found}
            clearInput={this.clearInput}
            searchedMovie={searchedMovie}
            findMovie={this.findMovie}
            addMovie={this.addMovie}
          />
        </div>
      </div>
    );
  }
}
