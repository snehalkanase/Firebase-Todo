<template>
  <div>
    <h1 class="text-center ma-5 text-green">{{ name }}</h1>
    <v-card class="mx-auto pl-16" max-width="500">
      <v-badge :content="totalCount" class="ma-5" color="green">
        <v-btn @click="filter = 'all'">All Books</v-btn>
      </v-badge>

      <v-badge :content="favCount" color="red">
        <v-btn @click="filter = 'favs'">Favourite Books</v-btn>
      </v-badge>

    </v-card>

    <v-card max-width="500" class="mx-auto">
      <v-form @submit.prevent="onSubmit" ref="form">
        <v-card-title>Add New Book</v-card-title>
        <v-card-text>
          <v-text-field type="input" placeholder="Enter Book Name" v-model="bookName"></v-text-field>
          <v-text-field type="input" placeholder="Enter Author Name" v-model="authorName"></v-text-field>

          <v-btn type="submit" color="green">Save</v-btn>
        </v-card-text>
      </v-form>
    </v-card>

    <v-card max-width="500" class="mx-auto" v-if="filter === 'all'" :loading="loading">
      <v-card-title>All Books</v-card-title>
      <v-list v-for="book in books" :key="book.id">
        <v-list-item>
          <v-list-item-title>{{ book.title }}</v-list-item-title>
          <v-list-item-subtitle>Author: {{ book.author }}</v-list-item-subtitle>
          <template v-slot:append>
            <v-icon v-if="book.isFav" @click="toggleFav(book.id)"
              :color="book.isFav ? 'red-accent-4' : ''">mdi-heart</v-icon>
            <v-icon v-else @click="toggleFav(book.id)">mdi-heart-outline</v-icon>
            <v-icon color="black" @click="deleteBook(book.id)">mdi-close</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
    <v-card class="mx-auto mt-5" max-width="500" border v-if="filter === 'favs'">
      <v-card-title>Favourite Books</v-card-title>
      <v-list v-for="book in favs" :key='book.id' bg-color="red-lighten-4">
        <v-list-item>
          <v-list-item-title>{{ book.title }}</v-list-item-title>
          <v-list-item-subtitle>Author: {{ book.author }}</v-list-item-subtitle>
          <template v-slot:append>
            <v-icon v-if="book.isFav" @click="toggleFav(book.id)"
              :color="book.isFav ? 'red-accent-4' : ''">mdi-heart</v-icon>
            <v-icon v-else @click="toggleFav(book.id)">mdi-heart-outline</v-icon>
            <v-icon color="black" @click="deleteBook(book.id)">mdi-close</v-icon>
          </template>
        </v-list-item>
      </v-list>
    </v-card>

  </div>
</template>

<script setup>

import { computed, onMounted } from "vue";
import { ref } from "vue";
import { db } from "../firebase";
import { collection, getDocs, onSnapshot, addDoc, deleteDoc, doc, updateDoc, query, orderBy } from "firebase/firestore";
import { getToken, onMessage, getMessaging } from "firebase/messaging";
const messaging = getMessaging();
const books = ref([])
const q = query(collection(db, "books"), orderBy("date", "desc"));

//get all documents in a collection
// onMounted(async () => {
//   const querySnapshot = await getDocs(collection(db, "books"));
//   let booksData = [];
// querySnapshot.forEach((doc) => {
//   console.log(doc.id, " => ", doc.data());
//   const books = {
//     id: doc.id,
//     title: doc.data().title,
//     author: doc.data().author,
//     isFav: doc.data().isFav,
//   }
//   booksData.push(books)
// });
//   books.value = booksData;
// })

//get real time updates

onMounted(() => {
  onSnapshot(q, (querySnapshot) => {
    const booksData = []
    querySnapshot.forEach((doc) => {
      const books = {
        id: doc.id,
        title: doc.data().title,
        author: doc.data().author,
        isFav: doc.data().isFav,
      }
      booksData.push(books)
    });
    books.value = booksData
  })
})
const name = ref('Book Store');
const bookName = ref('');
const authorName = ref('');
const favs = computed(() => books.value.filter(book => book.isFav));
const totalCount = computed(() => books.value.length);
const favCount = computed(() => books.value.reduce((pv, cv) => {
  return cv.isFav ? pv + 1 : pv
}, 0));

const filter = ref('all');

//delete a document from a collection
const deleteBook = (id) => {
  deleteDoc(doc(db, "books", id));

}

const onSubmit = () => {
  const bookData = ref({
    title: bookName.value,
    author: authorName.value,
    isFav: false,
    date: Date.now(),
    id: Math.floor(Math.random() * 1000)
  })
  addDoc(collection(db, "books"), bookData.value);
  bookName.value = '',
    authorName.value = ''
}

const toggleFav = (id) => {
  const index = books.value.findIndex(b => b.id === id)
  updateDoc(doc(db, "books", id), {
    isFav: !books.value[index].isFav
  });

};
function requestPermission() {
  console.log('Requesting permission...');
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve a registration token for use with FCM.
      // In many cases once an app has been granted notification permission,
      // it should update its UI reflecting this.
      // [START_EXCLUDE]
      // [END_EXCLUDE]
    } else {
      console.log('Unable to get permission to notify.');
    }
  });
}
requestPermission();


onMessage(messaging, (payload) => {
  console.log('Message received. ', payload);
});

getToken(messaging, { vapidKey: 'BGd4VzbgGX4ub9HVrHyAQLeudTXPmpdtp_MoJsOmS-_ySP0j45yXoNCra2FhpYHZbi_VR-NxRsM1e3HfMryjDYE' }).then((currentToken) => {
  if (currentToken) {
    // Send the token to your server and update the UI if necessary
    console.log("Token is :" ,currentToken);
  } else {
    console.log('No registration token available. Request permission to generate one.');
  }
}).catch((err) => {
  console.log('An error occurred while retrieving token. ', err);
});


</script>
