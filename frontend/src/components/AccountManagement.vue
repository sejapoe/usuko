<template>
  <div>
    <b-row>
      <b-col md="6">
        <b-button v-b-modal.modal-create block>Создать аккаунт</b-button>
      </b-col>

      <b-modal
        id="modal-create"
        ref="modal-create"
        title="Test"
        header-bg-variant="dark"
        body-bg-variant="dark"
        footer-bg-variant="dark"
        @show="resetCreateModal"
        @hidden="resetCreateModal"
        @ok="handleCreateModalOk"
      >
        <form v-if="!password" ref="createForm" @submit.stop.prevent="handleSubmitOk">
          <b-form-group label="Выберите тип аккаунта">
            <b-form-radio-group v-model="createForm.type" :options="types" />
          </b-form-group>

          <b-form-group label="Имя">
            <b-form-input v-model="createForm.name" placeholder="Введите имя" required />
          </b-form-group>

          <b-form-group label="Фамилия">
            <b-form-input v-model="createForm.lastname" placeholder="Введите фамилию" @input="updateLogin" required />
          </b-form-group>

          <b-form-group label="Логин">
            <b-form-input
              v-model="createForm.login"
              :disabled="createForm.generateLogin"
              placeholder="Придумайте логин"
            />
            <b-form-checkbox v-model="createForm.generateLogin" @input="updateLogin"
              >Сгенерировать автоматически</b-form-checkbox
            >
          </b-form-group>

          <b-form-group label="Класс" v-if="createForm.type === 0">
            <b-form-select v-model="createForm.class" :options="classes">
              <template #first>
                <b-form-select-option :value="null" disabled>Выберите класс</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>

          <b-form-group label="Предмет" v-if="createForm.type === 1">
            <b-form-input v-model="createForm.subject" placeholder="Введите предмет" />
          </b-form-group>
        </form>

        <span v-else>
          {{ password }}
        </span>
      </b-modal>

      <b-col md="6">
        <b-button block>Найти аккаунт</b-button>
      </b-col>
    </b-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { IBVModal } from '../services/interfaces';
import { createAccount } from '../services/utils';

@Component
export default class AccountManagement extends Vue implements IBVModal {
  createForm = {
    type: 0,
    name: '',
    lastname: '',
    login: '',
    generateLogin: false,
    class: null,
    subject: '',
  };
  types = [
    { text: 'Ученик', value: 0 },
    { text: 'Учитель', value: 1 },
    { text: 'Директор', value: 2 },
  ];
  classes = [];
  password = '';

  resetCreateModal() {
    this.createForm.type = 0;
    this.createForm.name = '';
    this.createForm.lastname = '';
    this.createForm.login = '';
    this.createForm.generateLogin = false;
    this.createForm.class = null;
    this.createForm.subject = '';
  }

  handleCreateModalOk(bvModalEvt: Event) {
    if (!this.password) {
      bvModalEvt.preventDefault();

      this.handleSubmitCreateForm();
    } else {
      this.password = '';
    }
  }

  handleSubmitCreateForm() {
    if (!(this.$refs.createForm as HTMLFormElement).reportValidity()) {
      return;
    }

    createAccount(this.createForm).then(async response => {
      this.password = await response.text();
    });
  }

  updateLogin() {
    if (this.createForm.generateLogin) {
      this.createForm.login = this.createForm.lastname;
    }
  }
}
</script>

<style scoped></style>
