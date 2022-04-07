<template>
  <div v-if="user.accountType == 3">
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
      @hidden="
        showAccount = {
          _id: '',
          accountType: 0,
          name: '',
          lastname: '',
          username: '',
          subject: '',
          classes: [],
          availableClasses: [],
        }
      "
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
          {{ classes.find(a => a._id == item).text }} <a @click="removeClassFromTeacher(item)" href="#">[delete]</a>
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
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IBVModal, IUser, IClass, IExtendedClass, IExtendedUser } from '../services/interfaces';
import { findAccounts, getClasses, addClass, removeClassFromTeacher } from '../services/utils';

@Component
export default class TeacherManagement extends Vue implements IBVModal {
  @Prop(Object) user!: IUser;

  classes = [];
  accounts = [];
  showAccount: IExtendedUser = {
    _id: '',
    accountType: 0,
    name: '',
    lastname: '',
    username: '',
    subject: '',
    classes: [],
    availableClasses: [],
    class: '',
  };
  addClassSelection = '';

  mounted(): void {
    this.getClasses();
    this.findAccounts();
  }

  getClasses(): void {
    getClasses().then(async response => {
      this.classes = await response.json();
      this.classes.forEach(ell => {
        const el = ell as IExtendedClass;
        el.text = `${el.num} ${el.liter}`;
        el.value = el._id;
      });
    });
  }

  findAccounts(): void {
    findAccounts({
      type: 1,
    }).then(async response => {
      this.accounts = await response.json();
    });
  }

  showInfoModal(item: IUser): void {
    this.showAccount = item;
    this.showAccount.availableClasses = this.classes.filter(
      a => !this.showAccount.classes?.includes((a as IClass)._id),
    );

    this.$root.$emit('bv::show::modal', 'modal-info');
  }

  showClassesInfo(): void {
    this.$root.$emit('bv::show::modal', 'modal-classes');
  }

  resetAddClassModal(): void {
    this.addClassSelection = '';
  }

  handleAddClassModalOk(bvModalEvt: Event): void {
    bvModalEvt.preventDefault();

    if (!(this.$refs.addClassForm as HTMLFormElement).reportValidity()) {
      return;
    }

    addClass(this.showAccount._id, this.addClassSelection).then(async () => {
      await this.findAccounts();
      await this.getClasses();
      const x = this.accounts.find(a => (a as IUser)._id == this.showAccount._id);
      if (x) {
        this.showAccount = x;
        this.showAccount.availableClasses = this.classes.filter(
          a => !this.showAccount.classes?.includes((a as IClass)._id),
        );
        this.$root.$emit('bv::hide::modal', 'modal-add-class');
      }
    });
  }

  removeClassFromTeacher(id: string): void {
    removeClassFromTeacher(this.showAccount._id, id).then(async () => {
      await this.findAccounts();
      await this.getClasses();
      const x = this.accounts.find(a => (a as IUser)._id == this.showAccount._id);
      if (x) {
        this.showAccount = x;
        this.showAccount.availableClasses = this.classes.filter(
          a => !this.showAccount.classes?.includes((a as IClass)._id),
        );
      }
    });
  }
}
</script>

<style scoped></style>
