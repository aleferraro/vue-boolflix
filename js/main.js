/*
Milestone 1

Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente. Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato: Titolo Titolo Originale Lingua Voto
*/

const apiUrl = 'https://api.themoviedb.org/3';
const apiKey = '416bf9524c5b7afc9a621dd41c6691ea';

const myApp = new Vue ({
  el: "#root",
  data: {
    imgPreUrl: 'https://image.tmdb.org/t/p/w500',
    films: [],
    query: ''
  },
  methods: {
    searchFilm : function(){
      axios.get(apiUrl + '/search/movie', {
        params: {
          'api_key': apiKey,
          query: this.query
        }
      })
      .then((r) => {
        console.log(r)
        this.films = [...r.data.results]
      })
    }
  }
})
