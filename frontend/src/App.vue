<template>
  <Header :user="user" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from './components/Header.vue';

@Component({
  components: {
    Header,
  },
})
export default class App extends Vue {
  user = {};

  async init() {}
}
</script>

<style scoped></style>
