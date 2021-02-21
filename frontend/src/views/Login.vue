<template>
  <b-container>
    <b-row style="height: 80vh" align-v="center">
      <b-col md="4" offset-md="4">
        <div style="text-align: center">
          <h4>Авторизация в УСУКО</h4>
        </div>
        <div class="auth">
          <b-form @submit="onSubmit" class="p-3">
            <b-form-group id="input-group-1" label="Логин" label-for="input-1">
              <b-form-input id="input-1" v-model="form.username" type="text" placeholder="Введите логин" required />
            </b-form-group>

            <b-form-group
              id="input-group-2"
              label="Пароль"
              label-for="input-2"
              invalid-feedback="Неверный логин или пароль"
              :state="!wrongLoginOrPassword"
            >
              <b-form-input
                id="input-2"
                v-model="form.password"
                type="password"
                placeholder="Введите пароль"
                required
              />
            </b-form-group>

            <b-button type="submit" variant="dark" block>
              Войти
            </b-button>

            <b-form-checkbox id="checkbox-1" v-model="form.remember" name="checkbox-1">
              Запомнить меня
            </b-form-checkbox>
          </b-form>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { login } from '../services/utils';
import { IVueRouter } from '../services/interfaces';

@Component
export default class Login extends Vue implements IVueRouter {
  form = {
    username: '',
    password: '',
    remember: false,
  };
  wrongLoginOrPassword = false;

  onSubmit(event: Event) {
    event.preventDefault();
    login(this.form).then(response => {
      if (response.ok) {
        this.$emit('update');
        this.$router.push('/profile');
      } else {
        this.wrongLoginOrPassword = true;
      }
    });
  }
}
</script>

<style scoped>
div.auth {
  background-color: rgb(49, 54, 63);
  border-radius: 5px;
}

div.auth button {
  background-image: linear-gradient(-180deg, rgb(83, 86, 89) 0%, rgb(66, 69, 73) 90%) !important;
  color: lightgray;
  border: none;
  cursor: pointer;
  width: 100%;
  border-radius: 5px;
}

div.auth button:hover {
  background-image: linear-gradient(-180deg, rgb(73, 76, 79) 0%, rgb(56, 59, 63) 90%) !important;
}
</style>
