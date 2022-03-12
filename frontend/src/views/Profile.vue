<template>
  <div>
    <b-card bg-variant="dark" text-variant="white" no-body>
      <b-card-header header-tag="nav">
        <b-nav v-if="user.accountType == 3" card-header tabs justified>
          <b-nav-item to="/profile/admin/teachers" exact exact-active-class="active"> Управление учителями </b-nav-item>
          <b-nav-item to="/profile/admin/accounts" exact exact-active-class="active">
            Управление аккаунтами
          </b-nav-item>
          <b-nav-item to="/profile/admin/classes" exact exact-active-class="active"> Управление классами </b-nav-item>
        </b-nav>
      </b-card-header>
      <b-card-body>
        <router-view :user="user" />
      </b-card-body>
    </b-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { IUser, IVueRouter } from '../services/interfaces';

@Component
export default class Profile extends Vue implements IVueRouter {
  @Prop(Object) readonly user: IUser | undefined;
}
</script>

<style scoped>
.nav-tabs .nav-link.active {
  background-color: #42474b;
  color: aliceblue;
  border-bottom: none;
  border-color: rgb(29, 24, 24);
}
.nav-tabs .nav-link {
  /* background-color: rgb(58, 62, 63); */
  color: lightgray;
}

.card-header {
  background-color: var(--dark);
}

.card {
  background-color: #42474b !important;
}
</style>
