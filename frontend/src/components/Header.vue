<template>
  <div>{{ user.password }}</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

const HeaderProps = Vue.extend({
  props: {
    user: {
      type: Object,
    },
  },
});

@Component
export default class Header extends HeaderProps {}
</script>

<style scoped></style>
