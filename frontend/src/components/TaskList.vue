<template>
  <div v-if="user.accountType == 0">
    <span v-if="tasks.length == 0">Нет доступных заданий</span>

    <ul>
      <li v-for="item in unAnsweredTasks" :key="item._id">
        <a :href="`/profile/student/tasks/${item._id}`"
          >{{ item.title }}
          {{ item.files.length == 0 ? '' : `(${item.files.length} файл${quantitySuffix(item.files.length)})` }}</a
        >
      </li>
    </ul>

    <span v-if="answeredTasks.length != 0">Отправленные задания:</span>

    <ul>
      <li v-for="item in answeredTasks" :key="item._id">
        <a :href="`/profile/student/tasks/${item._id}`"
          >{{ item.title }}
          {{ item.files.length == 0 ? '' : `(${item.files.length} файл${quantitySuffix(item.files.length)})` }}</a
        >
      </li>
    </ul>

    <span v-if="markedTasks.length != 0">Оцененные задания:</span>

    <ul>
      <li v-for="item in markedTasks" :key="item._id">
        <a :href="`/profile/student/tasks/${item._id}`"
          >{{ item.title }}
          {{ item.files.length == 0 ? '' : `(${item.files.length} файл${quantitySuffix(item.files.length)})` }}
          {{ `[${getTaskAnsweredByUser(item).mark}]` }}</a
        >
      </li>
    </ul>

    <b-modal
      id="modal-info"
      ref="modal-info"
      :title="showTask.title"
      header-bg-variant="dark"
      body-bg-variant="dark"
      footer-bg-variant="dark"
      @hidden="
        showTask = {};
        getOut();
      "
      ok-only
    >
      {{ showTask.description }}<br />
      Сдать до: {{ showTask.deadlineString }}<br />
      {{ showTask.files.length == 0 ? `К заданию не прикреплены файлы.` : `Файлы:` }}
      <ul>
        <li v-for="item in showTask.files" :key="item">
          <a :href="`/api/files/tasks/${showTask._id}/${item.split('/').slice(-1)[0]}`">{{
            item.split('/').slice(-1)[0]
          }}</a>
        </li>
      </ul>
      <span v-if="!!getTaskAnsweredByUser(showTask)">Ответ на это задание уже дан!</span>
      <br />
      <span v-if="!!getTaskAnsweredByUser(showTask) && !!getTaskAnsweredByUser(showTask).mark"
        >Ваша оценка за это задание: {{ getTaskAnsweredByUser(showTask).mark }}</span
      >
      <template #modal-footer="{ ok }">
        <b-button
          :disabled="!!getTaskAnsweredByUser(showTask)"
          size="sm"
          variant="info"
          @click="$root.$emit('bv::show::modal', 'modal-addfile')"
        >
          Добавить ответ
        </b-button>
        <b-button size="sm" variant="success" @click="ok()"> OK </b-button>
      </template>
    </b-modal>

    <b-modal
      id="modal-addfile"
      ref="modal-addfile"
      title="Добавить ответ"
      header-bg-variant="dark"
      body-bg-variant="dark"
      footer-bg-variant="dark"
      @show="addFiles = []"
      @hidden="addFiles = []"
      @ok="handleAddFilesModalOk"
    >
      <form ref="addFilesForm">
        <b-form-group label="Прикрепить файл(ы)">
          <b-form-file
            name="file"
            v-model="addFiles"
            placeholder="Выберите файлы или перенесите их сюда"
            drop-placeholder="Прикрепить файл"
            multiple
            required
          >
          </b-form-file>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IBVModal, IUser, ITask, IClass, IAnswer, IExtendedTask } from '../services/interfaces';
import { getTasks, quantitySuffix, addAnswer } from '../services/utils';

function getOut() {
  window.location.href = '/profile/student/tasks';
}

@Component
export default class TaskList extends Vue implements IBVModal {
  @Prop(Object) user!: IUser;

  tasks = [];
  unAnsweredTasks = [];
  answeredTasks = [];
  markedTasks = [];
  showTask: IExtendedTask = {
    _id: '',
    title: '',
    description: '',
    classes: [],
    files: [],
    answers: [],
    deadline: new Date(),
    deadlineString: '',
  };
  addFiles = [];
  quantitySuffix = quantitySuffix;
  getOut = getOut;

  mounted() {
    this.getTasks();
  }

  getTasks() {
    getTasks().then(async response => {
      this.tasks = await response.json();
      this.unAnsweredTasks = this.tasks.filter(a => !this.getTaskAnsweredByUser(a));
      this.answeredTasks = this.tasks.filter(a => !!this.getTaskAnsweredByUser(a));
      this.markedTasks = this.answeredTasks.filter(
        a => !!this.getTaskAnsweredByUser(a) && !!this.getTaskAnsweredByUser(a).mark,
      );
      this.answeredTasks = this.answeredTasks.filter(a => !this.markedTasks.includes(a));

      if (this.$route.params.id) {
        const x = this.tasks.find(a => (a as ITask)._id == this.$route.params.id);
        if (x) {
          this.showInfoModal(x);
        }
      }
    });
  }

  getTaskAnsweredByUser(task: ITask): IAnswer {
    return task.answers.find(
      b => (b as unknown as IAnswer).user.toString() == this.user._id.toString(),
    ) as unknown as IAnswer;
  }

  showInfoModal(item: ITask) {
    this.showTask = item;
    this.showTask.deadlineString = new Date(this.showTask.deadline).toLocaleString('ru-RU');

    this.$root.$emit('bv::show::modal', 'modal-info');
  }

  handleAddFilesModalOk(bvModalEvt: Event) {
    if (!(this.$refs.addFilesForm as HTMLFormElement).reportValidity()) {
      bvModalEvt.preventDefault();
      return;
    }

    addAnswer(this.showTask._id, new FormData(this.$refs.addFilesForm as HTMLFormElement)).then(async responce => {
      await this.getTasks();
    });
  }
}
</script>

<style scoped></style>
