Vue.component('list', {
  data: function(){
	return {
	  pageNumber: 0,
	  data: getThreads(),
	  favorites: JSON.parse(localStorage.getItem('favorites'))
	}
  },
  props: {
	size: {
	  type: Number,
	  required: false,
	  default: 10
	},
  },
  methods: {
	nextPage(){
      this.pageNumber++;
    },
    prevPage(){
      this.pageNumber--;
    },
    selectThread (selected) {
  	  this.data[id];
	},
	addToFavorite: function (id) {
	  //this.clearFavorites();
	  this.favorites = JSON.parse(localStorage.getItem('favorites'));
	  this.favorites[id] = id;
	  this.saveFavorite();
	  //this.clearFavorites();
	},
	removeFromFavorite: function (id) {
	  this.favorites = JSON.parse(localStorage.getItem('favorites'));
      this.favorites.splice(id, 1, null);
      this.saveFavorite();
    },
	saveFavorite: function(){
	  const parsed = JSON.stringify(this.favorites);
	  localStorage.setItem('favorites', parsed)
	},
	clearFavorites: function(){
	  localStorage.setItem('favorites', null);
	}
  },
  computed: {
	pageCount() {
	  var l = this.data.length,
		  s = this.size;
	  if (l%s==0) //если остаток от деления равен 0, то создаётся одна лишняя пустая страница
	    return Math.floor(l/s)-1;
	  else
	  	return Math.floor(l/s);
	},
	currendPage() {
	  var pages = [];
	  if(this.pageNumber==0)
	  	for (var i = pageNumber; i > 0; i++) {
	  	  this.pages.push(i)
	  	}
	},
	paginatedData(){
	  const start = this.pageNumber * this.size,
	        end = start + this.size;
	  return this.data.slice(start, end);
	},
	/*
	  Что если вместо favorite = [] в computed поместить 
	  favorite() {
	    return JSON.parse(localStorage.getItem('favorites'));
	  }
	  Чтобы не приходилось при каждом изменении localStorage запрашивать данные через getItem();
	  Возможно тогда мы сможем для получения данных обращатся к favorite(), а вносить изменения в localStorage();
	  Возможно это очень глупо, или нет, я над этим пока даже не пытался задуматься.
	*/
  },
  template: `	<div class="grid">
				  <div class="grid__row buttons">
					<button :disabled= "pageNumber == 0" @click="prevPage" class="grid__item title"> Предыдущая </button>
					<button v-for="" :disabled= "pageNumber == 0" @click="page()" class="grid__item title"> {{pageNumber+1}} </button>
					<button :disabled= "pageNumber >= pageCount" @click="nextPage" class="grid__item title"> Следующая </button>
				  </div>
				
				<div class="op wrapper">
				  <div class="original_post" v-for="p in paginatedData">
					<div class="op_image">

					  <img class="op_image" v-bind:src="p.url" alt="">
					  <div v-if="favorites[p.id]!=p.id" class="op_favorite" @click="addToFavorite(p.id)">♥</div>
					  <div v-if="favorites[p.id]==p.id"class="op_favorite red" @click="removeFromFavorite(p.id)">♥</div>
					</div>
					<div class="op_body">
					  <div class="op_title">
					    <p>{{p.title}}</p>
					  </div>
					  <div class="op_text">
					    {{p.original_post}}
					  </div>
					  <router-link v-bind:to="p.path" class="read_more">Открыть полностью</router-link>
					</div>
				  </div>
				</div>
				</div>
	`
})

Vue.component('favorite', {
  data: function(){
	return {
	  pageNumber: 0,
	  data: this.getCurrentThreads(JSON.parse(localStorage.getItem('favorites'))),
	  favorites: JSON.parse(localStorage.getItem('favorites'))
	}
  },
  props: {
	size: {
	  type: Number,
	  required: false,
	  default: 10
	}
  },
  methods: {
	nextPage(){
      this.pageNumber++;
    },
    prevPage(){
      this.pageNumber--;
    },
    removeFromFavorite: function (id) {
	  this.favorites = JSON.parse(localStorage.getItem('favorites'));
      this.favorites.splice(id, 1, null);
      this.saveFavorite();
    },
	saveFavorite: function(){
	  const parsed = JSON.stringify(this.favorites);
	  localStorage.setItem('favorites', parsed)
	},
	clearFavorites: function(){
	  localStorage.setItem('favorites', null);
	},
	getCurrentThreads: function (arrayId) {
	  var threads = [];
	  var current = JSON.parse(localStorage.getItem('favorites'));
	  fetch('https://jsonplaceholder.typicode.com/posts')
	  .then(response => response.json())
	  .then(json => {
	    for(var i=0; i<100;i++){
	      if (current[i] != null)
	  	    threads.push({
	  	    title: json[i].title,
	  	    original_post: json[i].body,
	  	    id: i,
	  	    url: "https://picsum.photos/1600/900/?blur?image="+i,
	  	    path: "/thread/"+i
	  	    });
	  	  }
	    });
	  return threads;
	}
  },
  computed: {
	pageCount() {
	  var l = this.data.length,
		  s = this.size;
	  return Math.floor(l/s);
	},
    paginatedData(){
      const start = this.pageNumber * this.size,
            end = start + this.size;
      return this.data.slice(start, end);
    }
  },
  template: `	<div class="grid">
				  <div class="grid__row buttons">
					<button :disabled= "pageNumber == 0" @click="prevPage" class="grid__item title"> Предыдущая </button>
					<button v-for="" :disabled= "pageNumber == 0" @click="page()" class="grid__item title"> {{pageNumber+1}} </button>
					<button :disabled= "pageNumber >= pageCount" @click="nextPage" class="grid__item title"> Следующая </button>
				  </div>
				
				<div class="op wrapper">
				  <div class="original_post" v-if="favorites[p.id]==p.id" v-for="p in paginatedData">
					<div class="op_image">

					  <img class="op_image" v-bind:src="p.url" alt="">
					  <div class="op_favorite" @click="removeFromFavorite(p.id)"><b>X</b></div>
					</div>
					<div class="op_body">
					  <div class="op_title">
					    <p>{{p.title}}</p>
					  </div>
					  <div class="op_text">
					    {{p.original_post}}
					  </div>
					  <router-link v-bind:to="p.path" class="read_more">Открыть полностью</router-link>
					</div>
				  </div>
				</div>
				</div>
	`
})

Vue.component('selectedThread',{
  data: function (){
	return{
	  data: getThreads(), //всместо getThreads() должен был вызываться currentThreads(), но это не получилось реальзовать
	  //data: currentThread(this.$route.params.id),
	  //id: this.$route.params.id

		}
	},
	props: {

	},
	methods: {

	},
	computed: {
//		selectedThread () {
//			return this.data.slice(this.id, this.id+1); 
//		}
	},
	template: `<div class="op wrapper">
				  <img v-bind:src="this.data[this.$route.params.id].url">
				  <div>{{this.data[this.$route.params.id].title}}</div>
				  <div>{{this.data[this.$route.params.id].original_post}}</div>
				</div>`
})

const List =  { template: '<list></list>'}
const Favorite = { template: '<favorite></favorite>'}
const Thread = { template: '<selectedThread></selectedThread>'}

const router = new VueRouter({
  routes : [
    { path: '/list', component: List },
    { path: '/favorite', component: Favorite },
    { path: '/thread/:id', component: Thread }
  ]
})

new Vue({
	el:'#thread-list',
	router,
	data: {
		test: "text"
	}
})

function getThreads () {
  var threads = [];
  fetch('https://jsonplaceholder.typicode.com/posts')
  .then(response => response.json())
  .then(json => {
    for(var i=0; i<100;i++){
  	  threads.push({
  	  title: json[i].title,
  	  original_post: json[i].body,
  	  id: i,
  	  url: "https://picsum.photos/1600/900/?blur?image="+i,
  	  path: "/thread/"+i
  	  });
  	}
  });
  return threads;
}
/*
getCurrentThreads: function (arrayId) {
	  var mass = [];
	  this.mass = getThreads();
	  var current = [];
	  console.log(this.favorites);
	  arrayId.forEach(function(id, i, arrayId)  {
	  	if (id!=null) {
		  console.log(this.mass.i);	
	  	  current.push({
	  	    title: this.mass[i].title,
	  		original_post: this.mass[i].original_post,
	  		id: this.mass[i].id,
	  		url: this.mass[i].url,
	  		path: this.mass[i].path
	  	  });
	  	//console.log(this.mass[i].title);
	  	}
}*/
/*
function getFavorites () {
  var favoritesId = JSON.parse(localStorage.getItem('favorites'));
  var threads = [];
  for (var i = 0; i < favoritesId.length(); i++){
    this.threads.push(getCurrentThreads(this.favoritesId[i].id))
  }
  return threads;
}*/
/*
function currentThread (id) {
  var thread = getThreads();
  return this.thread.slice(this.id, this.id+1);
}
*/
