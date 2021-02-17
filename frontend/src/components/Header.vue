<template>
  <div>
    <b-navbar toggleable="lg" class="header" type="dark">
      <b-navbar-brand to="/">УСУКО</b-navbar-brand>

      <b-navbar-nav> </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item-dropdown v-if="!!user.username" right>
          <template #button-content>
            {{ user.username }}
          </template>
          <b-dropdown-item @click="logout">
            Выйти
          </b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item v-else to="/login">Войти</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { logout } from '../services/utils';

const HeaderProps = Vue.extend({
  props: {
    user: {
      type: Object,
    },
  },
});

@Component
export default class Header extends HeaderProps {
  logout() {
    logout().then(response => {
      if (response.ok) {
        this.$emit('update');
      }
    });
  }
}
</script>

<style lang="css" scoped>
.header {
  color: var(--light);
  background-color: #1e2022 !important;
}
</style>
