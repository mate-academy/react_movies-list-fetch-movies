const BaseURL = 'https://www.omdbapi.com/?apikey=fd38d107&t=';

export const request = (title: string) => {
  return fetch(`${BaseURL}${title}`).then(response => {
    return response.json();
  });
};
