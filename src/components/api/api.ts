export const request = (url: string) => {
  return fetch(url)
    .then(response => {
      return response.json();
    });
};
