<template>
  <div>
    <b-row>
      <b-col md="12">
        <b-button v-b-modal.modal-create block>Создать класс</b-button>
      </b-col>

      <b-modal
        id="modal-create"
        ref="modal-create"
        title="Создание класса"
        header-bg-variant="dark"
        body-bg-variant="dark"
        footer-bg-variant="dark"
        @show="resetCreateModal"
        @hidden="resetCreateModal"
        @ok="handleCreateModalOk"
      >
        <form ref="createForm" @submit.stop.prevent="handleSubmitOk">
          <b-form-group label="Номер класса">
            <b-form-input v-model="createForm.number" placeholder="Введите номер" required />
          </b-form-group>

          <b-form-group label="Литера">
            <b-form-input v-model="createForm.liter" placeholder="Введите литеру" />
          </b-form-group>
        </form>
      </b-modal>
    </b-row>

    <ul>
      <li v-for="item in classes" :key="item._id">
        <a href="#">{{ item.num }} {{ item.liter }} - ({{ item.pupils.length }} чел.)</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { IBVModal } from '../services/interfaces';
import { createClass, getClasses } from '../services/utils';

@Component
export default class ClassManagement extends Vue implements IBVModal {
  createForm = {
    number: 1,
    liter: '',
  };
  classes = [];
  showAccount = {
    _id: '',
    accountType: 0,
    name: '',
    lastname: '',
    username: '',
    class: null,
    subject: '',
  };
  isEditingShowAccount = false;

  constructor() {
    super();
    this.getClasses();
  }

  resetCreateModal() {
    this.createForm.number = 1;
    this.createForm.liter = '';
  }

  handleCreateModalOk(bvModalEvt: Event) {
    if (!(this.$refs.createForm as HTMLFormElement).reportValidity()) {
      return;
    }

    createClass(this.createForm).then(() => {
      this.getClasses();
      this.$bvToast.toast(`Класс успешно создан`, {
        title: `Класс создан`,
        autoHideDelay: 3000,
        variant: 'success',
        toaster: 'b-toaster-bottom-right',
      });
    });
  }

  getClasses() {
    getClasses().then(async response => {
      this.classes = await response.json();
    });
  }

  // resetFindModal() {
  //   this.findForm.type = -1;
  //   this.findForm.name = '';
  //   this.findForm.lastname = '';
  //   this.findForm.login = '';
  //   this.findForm.class = null;
  //   this.findForm.subject = '';
  // }

  // handleFindModalOk(bvModalEvt: Event) {
  //   bvModalEvt.preventDefault();

  //   this.findAccounts();
  // }

  // findAccounts() {
  //   findAccounts(this.findForm).then(async response => {
  //     this.accounts = await response.json();
  //     this.isEditingShowAccount = false;
  //     this.$root.$emit('bv::hide::modal', 'modal-find');
  //   });
  // }

  // showInfoModal(item: Record<string, unknown>) {
  //   this.showAccount = item;

  //   this.$root.$emit('bv::show::modal', 'modal-info');
  // }

  // edit() {
  //   this.editForm.type = +this.showAccount.accountType;
  //   this.editForm.name = this.showAccount.name;
  //   this.editForm.lastname = this.showAccount.lastname;
  //   this.editForm.class = this.showAccount.class;
  //   this.editForm.subject = this.showAccount.subject;

  //   this.isEditingShowAccount = true;
  //   this.$root.$emit('bv::show::modal', 'modal-info');
  // }

  // resetPassword() {
  //   resetPassword(this.showAccount._id).then(password => {
  //     this.password = password.toString();
  //     this.$root.$emit('bv::show::modal', 'modal-pass');
  //   });

  //   this.$root.$emit('bv::hide::modal', 'modal-info');
  // }

  // saveEditions() {
  //   editAccount(this.showAccount._id, this.editForm).then(() => {
  //     this.makeSavedToast(this.showAccount.username);
  //     this.findAccounts();
  //     this.$root.$emit('bv::hide::modal', 'modal-info');
  //   });
  // }

  // makeSavedToast(login: string) {
  //   this.$bvToast.toast(`Изменения об аккаунте ${login} успешно сохранены`, {
  //     title: `Изменения сохранены`,
  //     autoHideDelay: 3000,
  //     variant: 'warning',
  //     toaster: 'b-toaster-bottom-right',
  //   });
  // }
}
</script>

<style scoped></style>
