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

import { computed } from "vue";
import { ref } from "vue";
const books = ref([])
const name = ref('Book Store');
const bookName = ref('');
const authorName = ref('');
const favs = computed(() => books.value.filter(book => book.isFav));
const totalCount = computed(() => books.value.length);
const favCount = computed(() => books.value.reduce((pv, cv) => {
  return cv.isFav ? pv + 1 : pv
}, 0));

const filter = ref('all');
const deleteBook = (id) => {
  books.value = books.value.filter(b => {
    return b.id !== id
  })
}
let addBook = (book) => {
  return books.value.push(book)
}
const onSubmit = () => {

  console.log({
    title: bookName.value,
    author: authorName.value
  })

  addBook({
    title: bookName.value,
    author: authorName.value,
    isFav: false,
    id: Math.floor(Math.random() * 1000)
  })



  bookName.value = '',
    authorName.value = ''
}

const toggleFav = (id) => {
  const book = books.value.find(b => b.id === id)
  book.isFav = !book.isFav
};
</script>
