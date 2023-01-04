# Movies list - Fetch movies

`FindMovie` component is implemented to load movies from [OMDb API](http://www.omdbapi.com/) (One needs to register and get an API key to use it).

## Features

1. When a user enters a title and submits the form, a request is sent to `https://www.omdbapi.com/?apikey=[yourkey]&t=[title]`.
1. The submit button is disabled when the title field is empty.
1. A spinner is shown on the submit button while waiting for the respose.
    - loading is finished in any case (success or failure).
1. If a movie is not found, an error message is shown below the input.
    - it is hidden after changing the title.
1. If a movie is found, a preview is shown as a `MovieCard` and an add button.
    - [the deafult picture](https://via.placeholder.com/360x270.png?text=no%20preview) is used, if the found movie has no poster.
1. The add button **adds** the movie to the list, **clears** the form and **removes** the preview.
1. A movie should not be added to the list twice, just clear the data;

## Demo

https://sapnachoudhary06.github.io/react_movies-list-fetch-movies/

## Run Locally

Clone the project

```bash
  git clone https://github.com/sapnachoudhary06/react_movies-list-fetch-movies.git
```

Go to the project directory

```bash
  cd react_movies-list-fetch-movies
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```

## Deployment

To deploy this project run

```bash
  npm run deploy
```

## 🛠 Skills
Javascript, TypeScript, HTML, CSS, React, React Router and hooks.
