<template>
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
</template>

<script>
import { reactive, ref } from 'vue'
import { useBookStore } from '../store/BookStore'
export default {
    setup(){
        const bookStore = useBookStore()

        const bookName = ref('');
        const authorName = ref('');


        const onSubmit = () => {

            console.log({
                title: bookName.value,
                author: authorName.value
            })
        
                bookStore.addBook({
                    title: bookName.value,
                    author:authorName.value,
                    isFav: false,
                    id: Math.floor(Math.random() * 1000)
                })

                console.log(bookStore)

                bookName.value = '',
                authorName.value = ''
        }

        return{onSubmit, bookName, authorName, bookStore}
    }
}
</script>