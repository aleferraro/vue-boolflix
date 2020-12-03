/*
Milestone 1

Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un movie. Possiamo, cliccando il bottone, cercare sull’API tutti i movie che contengono ciò che ha scritto l’utente. Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni movie trovato: Titolo Titolo Originale Lingua Voto

Milestone 2

Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).

Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i movie che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i movie hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
Qui un esempio di chiamata per le serie tv:
https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs

*/

const apiUrl = 'https://api.themoviedb.org/3';
const apiKey = '416bf9524c5b7afc9a621dd41c6691ea';
const language = 'it-IT'

const myApp = new Vue ({
  el: "#root",
  data: {
    imgPreUrl: 'https://image.tmdb.org/t/p/w500',
    movies: [],
    tvShows: [],
    query: '',
  },
  mounted: function(){

  },
  methods: {

    searchMovie : function(){
      // ricerca film
      axios.get(apiUrl + '/search/movie', {
        params: {
          'api_key': apiKey,
          language: language,
          query: this.query
        }
      })
      .then((r) => {
        console.log(r);
        this.movies = [...r.data.results];
        this.movies.forEach(movie => {
          movie.vote_average = Math.ceil(movie.vote_average / 2);
        });
      })
    },

    flagNotFound(e){
      e.target.src = 'img/flags/not_found.png'
    }
  },
  computed: {

  }
})
