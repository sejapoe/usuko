<template>
  <div v-if="user.accountType == 3">
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
        <a @click="showInfoModal(item)" href="#">{{ item.num }} {{ item.liter }} - ({{ item.pupils.length }} чел.)</a>
      </li>
    </ul>

    <b-modal
      id="modal-info"
      ref="modal-info"
      :title="`Класс ${showClass.num} ${showClass.liter}`"
      header-bg-variant="dark"
      body-bg-variant="dark"
      footer-bg-variant="dark"
      @hidden="showClass = {}"
      ok-only
    >
      Количество учеников: {{ showClass.pupils.length }}

      <template #modal-footer="{ ok }">
        <b-button size="sm" variant="danger" @click="deleteClass()"> Удалить класс </b-button>
        <b-button size="sm" variant="info" @click="transferClass()"> Перевести класс </b-button>
        <b-button size="sm" variant="success" @click="ok()"> OK </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IBVModal, IUser } from '../services/interfaces';
import { createClass, getClasses, deleteClass } from '../services/utils';

@Component
export default class ClassManagement extends Vue implements IBVModal {
  @Prop(Object) user!: IUser;

  createForm = {
    number: 1,
    liter: '',
  };
  classes = [];
  showClass = {
    _id: '',
    num: 0,
    liter: '',
    pupils: [],
  };

  mounted() {
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

  showInfoModal(item: Record<string, unknown>) {
    this.showClass = item;

    this.$root.$emit('bv::show::modal', 'modal-info');
  }

  deleteClass() {
    deleteClass(this.showClass._id).then(() => {
      this.getClasses();
      this.$root.$emit('bv::hide::modal', 'modal-info');
    });
  }
}
</script>

<style scoped></style>
