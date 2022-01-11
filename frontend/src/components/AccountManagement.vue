<template>
  <div>
    <b-row>
      <b-col md="6">
        <b-button v-b-modal.modal-create block>Создать аккаунт</b-button>
      </b-col>

      <b-modal
        id="modal-create"
        ref="modal-create"
        title="Создание аккаунта"
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

        <span v-else> Пароль от нового аккаунта: {{ password }} </span>
      </b-modal>

      <b-col md="6">
        <b-button v-b-modal.modal-find block>Найти аккаунт</b-button>
      </b-col>

      <b-modal
        id="modal-find"
        ref="modal-find"
        title="Поиск аккаунта"
        header-bg-variant="dark"
        body-bg-variant="dark"
        footer-bg-variant="dark"
        @show="resetFindModal"
        @hidden="resetFindModal"
        @ok="handleFindModalOk"
      >
        <form ref="findForm">
          <b-form-group label="Выберите тип аккаунта">
            <b-form-radio-group v-model="findForm.type" :options="[{ value: -1, text: 'Любой' }, ...types]" />
          </b-form-group>

          <b-form-group label="Имя">
            <b-form-input v-model="findForm.name" placeholder="Введите имя" />
          </b-form-group>

          <b-form-group label="Фамилия">
            <b-form-input v-model="findForm.lastname" placeholder="Введите фамилию" />
          </b-form-group>

          <b-form-group label="Логин">
            <b-form-input v-model="findForm.login" placeholder="Придумайте логин" />
          </b-form-group>

          <b-form-group label="Класс" v-if="findForm.type === 0">
            <b-form-select v-model="findForm.class" :options="classes">
              <template #first>
                <b-form-select-option :value="null" disabled>Выберите класс</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>

          <b-form-group label="Предмет" v-if="findForm.type === 1">
            <b-form-input v-model="findForm.subject" placeholder="Введите предмет" />
          </b-form-group>
        </form>
      </b-modal>
    </b-row>

    <div v-if="accounts">
      <span v-if="accounts.length > 0">Результаты поиска:</span>
      <span v-else>По вашему запросу ничего не найдено</span>
      <ul>
        <li v-for="item in accounts" :key="item.login">
          <a @click="showInfoModal(item)" href="#">{{ item.name }} {{ item.lastname }} ({{ item.username }})</a>
        </li>
      </ul>
    </div>

    <b-modal
      id="modal-info"
      ref="modal-info"
      :title="`Просмотр аккаунта ${showAccount.username}`"
      header-bg-variant="dark"
      body-bg-variant="dark"
      footer-bg-variant="dark"
      @hidden="showAccount = {}"
      ok-only
    >
      {{ showAccount.accountType ? types[showAccount.accountType].text : '' }}<br />Имя: {{ showAccount.name
      }}<br />Фамилия:
      {{ showAccount.lastname }}
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { IBVModal } from '../services/interfaces';
import { createAccount, transliterate, findAccounts } from '../services/utils';

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
  findForm = {
    type: -1,
    name: '',
    lastname: '',
    login: '',
    class: null,
    subject: '',
  };
  readonly types = [
    { text: 'Ученик', value: 0 },
    { text: 'Учитель', value: 1 },
    { text: 'Директор', value: 2 },
    { text: 'Администратор', value: 3 },
  ];
  classes = [];
  password = '';
  accounts = null;
  showAccount = {};

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
      this.createForm.login = transliterate(this.createForm.lastname.toLowerCase());
    }
  }

  resetFindModal() {
    this.findForm.type = -1;
    this.findForm.name = '';
    this.findForm.lastname = '';
    this.findForm.login = '';
    this.findForm.class = null;
    this.findForm.subject = '';
  }

  handleFindModalOk(bvModalEvt: Event) {
    bvModalEvt.preventDefault();

    findAccounts(this.findForm).then(async response => {
      this.accounts = await response.json();

      this.$root.$emit('bv::hide::modal', 'modal-find');
    });
  }

  showInfoModal(item: Record<string, unknown>) {
    this.showAccount = item;

    this.$root.$emit('bv::show::modal', 'modal-info');
  }
}
</script>

<style scoped></style>
