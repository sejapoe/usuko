<template>
  <div v-if="user.accountType == 1">
    <b-row>
      <b-col md="12">
        <b-button v-b-modal.modal-create block>Дать задание</b-button>
      </b-col>

      <b-modal
        id="modal-create"
        ref="modal-create"
        title="Мастер создания заданий"
        header-bg-variant="dark"
        body-bg-variant="dark"
        footer-bg-variant="dark"
        @show="resetCreateModal"
        @hidden="resetCreateModal"
        @ok="handleCreateModalOk"
      >
        <form ref="createForm">
          <b-form-group label="Название задания">
            <b-form-input name="title" v-model="createForm.title" placeholder="Введите название" required />
          </b-form-group>

          <b-form-group label="Описание задания">
            <b-form-textarea
              name="description"
              v-model="createForm.description"
              placeholder="Введите описание"
              rows="3"
              max-rows="8"
            />
          </b-form-group>

          <b-form-group label="Классы">
            <b-form-select
              name="classes"
              v-model="createForm.classes"
              :options="classes"
              multiple
              :select-size="5"
              v-b-popover.hover="`Используйте Ctrl или Shift, чтобы выделить несколько`"
            ></b-form-select>
          </b-form-group>

          <b-form-group label="Дата сдачи">
            <b-form-datepicker
              name="date"
              v-model="createForm.date"
              :min="new Date()"
              locale="ru-ru"
              :start-weekday="1"
              value-as-date
            ></b-form-datepicker>
          </b-form-group>

          <b-form-group label="Время сдачи">
            <b-form-timepicker name="time" v-model="createForm.time" hourCycle="h23"></b-form-timepicker>
          </b-form-group>

          <b-form-group label="Прикрепить файл(ы)">
            <b-form-file
              name="file"
              v-model="createForm.files"
              placeholder="Выберите файлы или перенесите их сюда"
              drop-placeholder="Прикрепить файл"
              multiple
            >
            </b-form-file>
          </b-form-group>
        </form>
      </b-modal>
    </b-row>

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
import { createTask, getClasses, deleteClass } from '../services/utils';

@Component
export default class TaskManagement extends Vue implements IBVModal {
  @Prop(Object) user!: IUser;

  createForm = {
    title: '',
    description: '',
    classes: [],
    date: 0,
    time: '',
    files: [],
  };
  allClasses = [];
  classes = [];
  showClass = {
    _id: '',
    num: 0,
    liter: '',
    pupils: [],
  };

  constructor() {
    super();
    this.getAllClasses();
  }

  resetCreateModal() {
    this.createForm.title = '';
    this.createForm.description = '';
    this.createForm.classes = [];
    const now = new Date();
    this.createForm.date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    this.createForm.time = '17:00';
    this.files = [];
    this.getTeacherClasses();
  }

  handleCreateModalOk(bvModalEvt: Event) {
    if (!(this.$refs.createForm as HTMLFormElement).reportValidity()) {
      bvModalEvt.preventDefault();
      return;
    }

    createTask(new FormData(this.$refs.createForm as HTMLFormElement)).then(() => {
      this.$bvToast.toast(`Задание успешно создано`, {
        title: `Класс создан`,
        autoHideDelay: 3000,
        variant: 'success',
        toaster: 'b-toaster-bottom-right',
      });
    });
  }

  getTeacherClasses() {
    this.classes = [];
    this.user.classes.forEach(el => {
      const cl = this.allClasses.find(a => a._id == el);
      if (cl) {
        const x = {
          text: `${cl.num} ${cl.liter}`,
          value: cl._id,
        };
        this.classes.push(x);
      }
    });
  }

  getAllClasses() {
    getClasses().then(async response => {
      this.allClasses = await response.json();
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
