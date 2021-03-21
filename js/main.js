/*
Milestone 1

Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un movie. Possiamo, cliccando il bottone, cercare sull’API tutti i movie che contengono ciò che ha scritto l’utente. Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni movie trovato: Titolo, Titolo Originale, Lingua, Voto

Milestone 2

Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).

Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i movie che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i movie hanno campi nel JSON di risposta diversi, simili ma non sempre identici)
Qui un esempio di chiamata per le serie tv:
https://api.themoviedb.org/3/search/tv?api_key=e99307154c6dfb0b4750f6603256716d&language=it_IT&query=scrubs

Milestone 3

In questa milestone come prima cosa aggiungiamo la copertina del film o della serie al nostro elenco. Ci viene passata dall’API solo la parte finale dell’URL, questo perché poi potremo generare da quella porzione di URL tante dimensioni diverse. Dovremo prendere quindi l’URL base delle immagini di TMDB: https://image.tmdb.org/t/p/ per poi aggiungere la dimensione che vogliamo generare (troviamo tutte le dimensioni possibili a questo link: https://www.themoviedb.org/talk/53c11d4ec3a3684cf4006400) per poi aggiungere la parte finale dell’URL passata dall’API.
Esempio di URL che torna la copertina di BORIS:
https://image.tmdb.org/t/p/w185/s2VDcsMh9ZhjFUxw77uCFDpTuXp.jpg

Milestone 4

Trasformiamo quello che abbiamo fatto fino ad ora in una vera e propria webapp, creando un layout completo simil-Netflix:
- Un header che contiene logo e search bar
- Dopo aver ricercato qualcosa nella searchbar, i risultati appaiono sotto forma di “card” in cui lo sfondo è rappresentato dall’immagine di copertina (consiglio la poster_path con w342)
- Andando con il mouse sopra una card (on hover), appaiono le informazioni aggiuntive già prese nei punti precedenti più la overview

Milestone 5 (Opzionale)

Partendo da un film o da una serie, richiedere all'API quali sono gli attori che fanno parte del cast aggiungendo alla nostra scheda Film / Serie SOLO i primi 5 restituiti dall’API con Nome e Cognome, e i generi associati al film con questo schema: “Genere 1, Genere 2, …”.

Milestone 6 (Opzionale)

Creare una lista di generi richiedendo quelli disponibili all'API e creare dei filtri con i generi tv e movie per mostrare/nascondere le schede ottenute con la ricerca.

*/

const apiUrl = 'https://api.themoviedb.org/3';
const apiKey = '416bf9524c5b7afc9a621dd41c6691ea';
const language = 'it-IT'

const myApp = new Vue ({
  el: "#root",
  data: {
    imgPreUrl: 'https://image.tmdb.org/t/p/w342',
    movies: [],
    tvShows: [],
    genres: [],
    filterList: [],
    selectedGenre: 'all',
    query: '',
  },
  mounted: function(){

    // crea una lista di generi
    axios.get(apiUrl + '/genre/movie/list', {
      params: {
        'api_key': apiKey
      }
    })
    .then((r) => {
      this.genres = [...r.data.genres];
    });
    axios.get(apiUrl + '/genre/tv/list', {
      params: {
        'api_key': apiKey
      }
    })
    .then((r) => {
      r.data.genres.forEach(tvGenre => {
        if(this.genres.indexOf(tvGenre) === -1){
          this.genres.push(tvGenre);
        }
      })
      // console.log('genres', this.genres);
      myApp.$forceUpdate();
    })

    //cerca i film popolari
    axios.get(apiUrl + '/movie/popular', {
      params: {
        'api_key': apiKey,
        language: language
      }
    })
    .then((r) => {
      this.movies = [...r.data.results];
      this.movies.forEach(movie => {
        //trasforma il voto di ogni film in un numero intero tra 1 e 5
        movie.vote_average = movie.vote_average / 2;
        //aggiunge a ogni film la proprietà cast
        movie.cast = [];
        axios.get(apiUrl + '/movie/' + movie.id + '/credits', {
          params: {
            'api_key': apiKey,
            language: language
          }
        })
        .then((r) => {
          // movie.cast = [...r.data.cast];
          r.data.cast.forEach(person => {
            if(movie.cast.length < 5){
              movie.cast.push(person.name);
            }
          })
          myApp.$forceUpdate();
        })
        //aggiunge a ogni film la proprietà genere
        movie.genre = [];
        this.genres.forEach(genre => {
          movie.genre_ids.forEach(genreId => {
            if(genreId == genre.id){
              movie.genre.push(genre.name);
            }
          })
        })
      });
      this.optionFilter();
    });

    //cerca le serie popolari
    axios.get(apiUrl + '/tv/popular', {
      params: {
        'api_key': apiKey,
        language: language
      }
    })
    .then((r) => {
      // console.log(r);
      //crea un array di seie tv
      this.tvShows = [...r.data.results];
      this.tvShows.forEach(tv => {
        //trasforma il voto di ogni serie tv in un numero intero tra 1 e 5
        tv.vote_average = tv.vote_average / 2;
        //aggiunge a ogni film la proprietà cast
        tv.cast = [];
        axios.get(apiUrl + '/tv/' + tv.id + '/credits', {
          params: {
            'api_key': apiKey,
            language: language
          }
        })
        .then((r) => {
          r.data.cast.forEach(person => {
            if (tv.cast.length < 5){
              tv.cast.push(person.name)
            }
          })
        })
        myApp.$forceUpdate();
        //aggiunge a ogni serie tv la proprietà genere
        tv.genre = [];
        this.genres.forEach(genre => {
          tv.genre_ids.forEach(genreId => {
            if(genreId == genre.id){
              tv.genre.push(genre.name);
            }
          })
        })
      });
    });

  },
  methods: {

    searchMovie(){
      // ricerca film
      axios.get(apiUrl + '/search/movie', {
        params: {
          'api_key': apiKey,
          language: language,
          query: this.query
        }
      })
      .then((r) => {
        // console.log(r);
        // crea un array di film
        this.movies = [...r.data.results];
        this.movies.forEach(movie => {
          //trasforma il voto di ogni film in un numero intero tra 1 e 5
          movie.vote_average = movie.vote_average / 2;
          //aggiunge a ogni film la proprietà cast
          movie.cast = [];
          axios.get(apiUrl + '/movie/' + movie.id + '/credits', {
            params: {
              'api_key': apiKey,
              language: language
            }
          })
          .then((r) => {
            // movie.cast = [...r.data.cast];
            r.data.cast.forEach(person => {
              if(movie.cast.length < 5){
                movie.cast.push(person.name);
              }
            })
            myApp.$forceUpdate();
          })
          //aggiunge a ogni film la proprietà genere
          movie.genre = [];
          this.genres.forEach(genre => {
            movie.genre_ids.forEach(genreId => {
              if(genreId == genre.id){
                movie.genre.push(genre.name);
              }
            })
          })
        });
        this.optionFilter();
        // console.log('movies', this.movies);
      });
    },

    searchTvShows(){
      //ricerca serie tv
      axios.get(apiUrl + '/search/tv', {
        params: {
          'api_key': apiKey,
          language: language,
          query: this.query
        }
      })
      .then((r) => {
        // console.log(r);
        //crea un array di seie tv
        this.tvShows = [...r.data.results];
        this.tvShows.forEach(tv => {
          //trasforma il voto di ogni serie tv in un numero intero tra 1 e 5
          tv.vote_average = tv.vote_average / 2;
          //aggiunge a ogni film la proprietà cast
          tv.cast = [];
          axios.get(apiUrl + '/tv/' + tv.id + '/credits', {
            params: {
              'api_key': apiKey,
              language: language
            }
          })
          .then((r) => {
            r.data.cast.forEach(person => {
              if (tv.cast.length < 5){
                tv.cast.push(person.name)
              }
            })
          })
          myApp.$forceUpdate();
          //aggiunge a ogni serie tv la proprietà genere
          tv.genre = [];
          this.genres.forEach(genre => {
            tv.genre_ids.forEach(genreId => {
              if(genreId == genre.id){
                tv.genre.push(genre.name);
              }
            })
          })
        });
        this.optionFilter();
      });
    },

    movieImage(movie){
      if(movie.poster_path){
        return this.imgPreUrl + movie.poster_path
      } else if (movie.backdrop_path) {
        return this.imgPreUrl + movie.backdrop_path
      } else {
        return "img/placeholder-image.jpg"
      }
    },

    flagNotFound(e){
      e.target.src = 'img/flags/not_found.png'
    },

    optionFilter(){
      this.selectedGenre = 'all';
      this.filterList = [];
      this.movies.forEach(movie => {
        movie.genre.forEach(movieGenre => {
          this.genres.forEach(genre =>{
            if(movieGenre == genre.name){
              if(this.filterList.indexOf(genre) === -1){
                this.filterList.push(genre)
              }
            }
          })
        })
      })
      this.tvShows.forEach(tv => {
        tv.genre_ids.forEach(tvGenre => {
          this.genres.forEach(genre =>{
            if(tvGenre == genre.id){
              if(this.filterList.indexOf(genre) === -1){
                this.filterList.push(genre)
              }
            }
          })
        })
      })
    },

    filterMovieGenre() {
      if(this.selectedGenre == 'all'){
        return this.movies
      } else {
        return  this.movies.filter(movie => movie.genre.includes(this.selectedGenre))
      }
    },

    filterTvGenre() {
      if(this.selectedGenre == 'all'){
        return this.tvShows
      } else {
        return  this.tvShows.filter(tv => tv.genre.includes(this.selectedGenre))
      }
    },
  }
})
