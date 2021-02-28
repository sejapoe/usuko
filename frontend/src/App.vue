<template>
  <div>
    <Header :user="user" @update="init" />
    <router-view @update="init" :user="user" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Header from './components/Header.vue';
import { getCurrentUser } from './services/utils';

@Component({
  components: {
    Header,
  },
})
export default class App extends Vue {
  user = {};

  async init() {
    this.user = await getCurrentUser();
  }

  mounted() {
    this.init();
  }
}
</script>

<style lang="css">
body {
  background-color: #42474b !important;
  color: var(--light) !important;
}

input {
  background-image: linear-gradient(-180deg, rgb(83, 86, 89) 0%, rgb(66, 69, 73) 90%) !important;
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  color: lightgray !important;
  display: inline-block;
  border: 1px solid rgb(41, 41, 41) !important;
  box-sizing: border-box;
  border-radius: 5px;
}
</style>
