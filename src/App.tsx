/* eslint-disable no-console */
import React, { Component } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export class App extends Component {
  state = {
    movies: data,
    title: '',
  };

  handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
    const { value } = event.currentTarget;

    this.setState({ title: value });

    console.log(value);
  };


  render() {
    const { movies } = this.state;

    return (
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie
            handleChange={this.handleInputChange}
            title={this.state.title}
          />
        </div>
      </div>
    );
  }
}
