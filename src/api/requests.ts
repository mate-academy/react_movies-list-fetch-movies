const BaseURL = 'https://www.omdbapi.com/?apikey=fd38d107&t=';

export const request = (title:string) => {
  return fetch(`${BaseURL}${title}`).then(response => {
    // eslint-disable-next-line no-console
    /*  console.log(response); */

    return response.json();
  });
};
