<template>
  <div>
    <div v-if="accounts">
      <span v-if="accounts.length > 0">Учителя:</span>
      <span v-else>На данный момент учителей нет. <a href="/profile/bar">Создать учителя.</a></span>
      <ul>
        <li v-for="item in accounts" :key="item.login">
          <a @click="showInfoModal(item)" href="#">{{ item.name }} {{ item.lastname }} ({{ item.username }})</a>
        </li>
      </ul>
    </div>

    <b-modal
      id="modal-info"
      ref="modal-info"
      :title="`Просмотр учителя ${showAccount.username}`"
      header-bg-variant="dark"
      body-bg-variant="dark"
      footer-bg-variant="dark"
      @hidden="showAccount = {}"
      ok-only
    >
      Учитель<br />Имя: {{ showAccount.name }}<br />Фамилия: {{ showAccount.lastname }}<br />Предмет:
      {{ showAccount.subject }}<br />Привязанно классов:
      <a @click="showClassesInfo()" href="#">{{ showAccount.classes.length }}</a>
    </b-modal>

    <b-modal
      id="modal-classes"
      ref="modal-classes"
      :title="`Классы учителя ${showAccount.username}`"
      header-bg-variant="dark"
      body-bg-variant="dark"
      footer-bg-variant="dark"
      ok-only
    >
      <span v-if="showAccount.classes.length == 0">Здесь пока ничего нет, но вы всегда можете это исправить.</span>
      <ul>
        <li v-for="item in showAccount.classes" :key="item">
          <a href="#">{{ classes.find(a => a._id == item).text }}</a>
        </li>
      </ul>

      <template #modal-footer="{ ok }">
        <b-button size="sm" variant="info" v-b-modal.modal-add-class> Привязать класс </b-button>
        <b-button size="sm" variant="success" @click="ok()"> OK </b-button>
      </template>
    </b-modal>

    <b-modal
      id="modal-add-class"
      ref="modal-add-class"
      title="Добавление класса"
      header-bg-variant="dark"
      body-bg-variant="dark"
      footer-bg-variant="dark"
      @show="resetAddClassModal"
      @hidden="resetAddClassModal"
      @ok="handleAddClassModalOk"
      ><form ref="addClassForm">
        <span v-if="showAccount.availableClasses.length == 0">Невозможно привязать класс к этому учителю</span>
        <b-form-group label="Класс" v-else>
          <b-form-select v-model="addClassSelection" :options="showAccount.availableClasses" required>
            <template #first>
              <b-form-select-option :value="null" disabled>Выберите класс</b-form-select-option>
            </template>
          </b-form-select>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { IBVModal } from '../services/interfaces';
import { findAccounts, getClasses, addClass } from '../services/utils';

@Component
export default class TeacherManagement extends Vue implements IBVModal {
  classes = [];
  accounts = null;
  showAccount = {
    _id: '',
    accountType: 0,
    name: '',
    lastname: '',
    username: '',
    subject: '',
    classes: [],
    availableClasses: [],
  };
  addClassSelection = null;

  constructor() {
    super();
    this.getClasses();
    this.findAccounts();
  }

  getClasses() {
    return getClasses().then(async response => {
      this.classes = await response.json();
      this.classes.forEach(el => {
        el.text = `${el.num} ${el.liter}`;
        el.value = el._id;
      });
    });
  }

  findAccounts() {
    return findAccounts({
      type: 1,
    }).then(async response => {
      this.accounts = await response.json();
    });
  }

  showInfoModal(item: Record<string, unknown>) {
    this.showAccount = item;
    this.showAccount.availableClasses = this.classes.filter(a => !this.showAccount.classes.includes(a._id));

    this.$root.$emit('bv::show::modal', 'modal-info');
  }

  showClassesInfo() {
    this.$root.$emit('bv::show::modal', 'modal-classes');
  }

  resetAddClassModal() {
    this.addClassSelection = null;
  }

  handleAddClassModalOk(bvModalEvt: Event) {
    bvModalEvt.preventDefault();

    if (!(this.$refs.addClassForm as HTMLFormElement).reportValidity()) {
      return;
    }

    addClass(this.showAccount._id, this.addClassSelection).then(async () => {
      await this.findAccounts();
      await this.getClasses();
      this.showAccount = this.accounts.find(a => a._id == this.showAccount._id);
      this.$root.$emit('bv::hide::modal', 'modal-add-class');
    });
  }
}
</script>

<style scoped></style>
