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
          <b-dropdown-item to="/profile">
            Профиль
          </b-dropdown-item>
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IUser } from '../services/interfaces';
import { logout } from '../services/utils';

@Component
export default class Header extends Vue {
  @Prop(Object) user!: IUser;

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
