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

          <b-form-group label="Классы" required>
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

    <ul>
      <li v-for="item in tasks" :key="item._id">
        <a :href="`/profile/teacher/tasks/${item._id}`"
          >{{ item.title }}
          {{ item.files.length == 0 ? '' : `(${item.files.length} файл${quantitySuffix(item.files.length)})` }}</a
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
      Классы: <span v-html="showTask.classesFormated" /><br />
      Сдать до: {{ showTask.deadlineString }}
      <a @click="$root.$emit('bv::show::modal', 'modal-change-deadline')" href="#">[перенести]</a><br />
      {{ showTask.files.length == 0 ? `К заданию не прикреплены файлы:` : `Файлы:` }}
      <ul>
        <li v-for="item in showTask.files" :key="item">
          <a :href="`/api/files/tasks/${showTask._id}/${item.split('/').slice(-1)[0]}`">{{
            item.split('/').slice(-1)[0]
          }}</a>
          <a @click="removeFileFromTask(item)" href="#"> [delete]</a>
        </li>
        <li>
          <a @click="$root.$emit('bv::show::modal', 'modal-addfile')" href="#">Добавить файл</a>
        </li>
      </ul>
      <a v-if="showTask.answers.length != 0" @click="$root.$emit('bv::show::modal', 'modal-answers')" href="#"
        >Просмотреть ответы ({{ showTask.answers.length }}/{{ showTask.totalStudents }})</a
      >
      <template #modal-footer="{ ok }">
        <b-button
          size="sm"
          variant="danger"
          @click="deleteTask()"
          v-b-popover.hover.top="
            `Удаление задания приведет к удалению всех ответов на него. Возможно, вам следует архивировать его.`
          "
        >
          Удалить задание
        </b-button>
        <b-button size="sm" variant="info" @click="archiveTask()"> Архивировать </b-button>
        <b-button size="sm" variant="success" @click="ok()"> OK </b-button>
      </template>
    </b-modal>

    <b-modal
      id="modal-addfile"
      ref="modal-addfile"
      title="Добавить файл"
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

    <b-modal
      id="modal-change-deadline"
      ref="modal-change-deadline"
      title="Изменить время сдачи"
      header-bg-variant="dark"
      body-bg-variant="dark"
      footer-bg-variant="dark"
      @show="resetChangeDeadlineModal"
      @hidden="resetChangeDeadlineModal"
      @ok="handleChangeDeadlineModalOk"
    >
      <form ref="changeDeadlineForm">
        <b-form-group label="Дата сдачи">
          <b-form-datepicker
            name="date"
            v-model="changeDeadlineForm.date"
            :min="new Date()"
            locale="ru-ru"
            :start-weekday="1"
            value-as-date
          ></b-form-datepicker>
        </b-form-group>

        <b-form-group label="Время сдачи">
          <b-form-timepicker name="time" v-model="changeDeadlineForm.time" hourCycle="h23"></b-form-timepicker>
        </b-form-group>
      </form>
    </b-modal>

    <b-modal
      id="modal-answers"
      ref="modal-answers"
      title="Ответы на задание"
      header-bg-variant="dark"
      body-bg-variant="dark"
      footer-bg-variant="dark"
      centered
      @show="resolveAnswers"
    >
      <ul>
        <li v-for="item in answers" :key="item.user._id">
          <a @click="revealedAnswer = revealedAnswer == item.user._id ? '' : item.user._id" :href="`#`"
            >{{ item.user.name }} {{ item.user.lastname }} ({{ item.user.class.num }} {{ item.user.class.liter }})</a
          >
          {{ !!item.mark ? '[Оценено]' : '' }}
          <template v-if="revealedAnswer == item.user._id">
            <br />
            <ul>
              <li v-for="jtem in item.files" :key="jtem">
                <a
                  :href="`/api/files/tasks/${showTask._id}/answers/${item.user._id}/${jtem.split('/').slice(-1)[0]}`"
                  >{{ jtem.split('/').slice(-1)[0] }}</a
                >
              </li>
            </ul>
            <template v-if="!item.mark && !unsavedMarks[item._id]">
              Оценить: <a v-for="mark in [2, 3, 4, 5]" :key="mark" @click="setMark(mark, item)" href="#">{{ mark }} </a>
            </template>
            <template v-else> Оценка: {{ item.mark || unsavedMarks[item._id] }} </template>
          </template>
        </li>
      </ul>

      <template #modal-footer="{ ok, cancel }">
        <b-button size="sm" variant="info" @click="saveMarks()" :disabled="!hasUnsavedMarks"> Применить </b-button>
        <b-button
          size="sm"
          @click="
            resetMarks();
            cancel();
          "
        >
          Отмена
        </b-button>
        <b-button
          size="sm"
          variant="success"
          @click="
            saveMarks();
            ok();
          "
        >
          OK
        </b-button>
      </template>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IBVModal, IUser, IClass, ITask, IExtendedTask, IAnswer } from '../services/interfaces';
import {
  createTask,
  getClasses,
  deleteTask,
  getTasks,
  quantitySuffix,
  removeFileFromTask,
  addFilesToTask,
  changeTaskDeadline,
  resolveAnswers,
  saveMarks,
} from '../services/utils';

function getOut() {
  window.location.href = '/profile/teacher/tasks';
}

@Component
export default class TaskManagement extends Vue implements IBVModal {
  @Prop(Object) user!: IUser;

  createForm = {
    title: '',
    description: '',
    classes: [],
    date: new Date(),
    time: '',
    files: [],
  };
  addFiles = [];
  allClasses: IClass[] = [];
  classes: Record<string, string | any> = [];
  tasks = [];
  showTask: IExtendedTask = {
    _id: '',
    title: '',
    description: '',
    classes: [],
    date: new Date(),
    deadline: new Date(),
    time: '',
    files: [],
    answers: [],
    classesFormated: '',
    deadlineString: '',
    totalStudents: 0,
  };
  changeDeadlineForm = {
    time: '',
    date: new Date(),
  };
  answers: IAnswer[] = [];
  revealedAnswer = '';
  hasUnsavedMarks = false;
  unsavedMarks = {};
  quantitySuffix = quantitySuffix;
  getOut = getOut;

  async mounted() {
    await this.getAllClasses();
    await this.getTasks();
  }

  resetCreateModal() {
    this.createForm.title = '';
    this.createForm.description = '';
    this.createForm.classes = [];
    const now = new Date();
    this.createForm.date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    this.createForm.time = now.toLocaleTimeString('en-US', { hour12: false });
    this.createForm.files = [];
    this.getTeacherClasses();
  }

  handleCreateModalOk(bvModalEvt: Event) {
    if (!(this.$refs.createForm as HTMLFormElement).reportValidity()) {
      bvModalEvt.preventDefault();
      return;
    }

    createTask(new FormData(this.$refs.createForm as HTMLFormElement)).then(() => {
      this.getTasks();
      this.$bvToast.toast(`Задание успешно создано`, {
        title: `Задание создано`,
        autoHideDelay: 3000,
        variant: 'success',
        toaster: 'b-toaster-bottom-right',
      });
    });
  }

  getTeacherClasses() {
    this.classes = [];
    this.user.classes?.forEach(el => {
      const cll = this.allClasses.find(a => (a as IClass)._id == el);
      if (cll) {
        const cl = cll as IClass;
        const x = {
          text: `${cl.num} ${cl.liter}`,
          value: cl._id,
        };
        this.classes.push(x);
      }
    });
  }

  async getTasks() {
    await getTasks().then(async response => {
      this.tasks = await response.json();
      if (this.$route.params.id) {
        const x = this.tasks.find(a => (a as ITask)._id == this.$route.params.id);
        if (x) {
          this.showInfoModal(x);
        }
      }
    });
  }

  async getAllClasses() {
    await getClasses().then(async response => {
      this.allClasses = await response.json();
      await this.getTeacherClasses();
    });
  }

  showInfoModal(item: ITask) {
    this.showTask = item;
    this.showTask.classesFormated = item.classes
      .map(a => {
        const cll = this.allClasses.find(b => (b as IClass)._id == a);
        if (cll) {
          const cl = cll as IClass;
          return `<a href="/profile/teacher/journal/${a}">${cl.num} ${cl.liter}</a>`;
        }
      })
      .join(', ');
    this.showTask.deadlineString = new Date(this.showTask.deadline).toLocaleString('ru-RU');
    this.showTask.totalStudents = 0;
    for (const i of this.allClasses.filter(a => this.showTask.classes.includes((a as IClass)._id))) {
      this.showTask.totalStudents += i.pupils.length;
    }

    this.$root.$emit('bv::show::modal', 'modal-info');
  }

  deleteTask() {
    this.$root.$emit('bv::hide::modal', 'modal-info');
    deleteTask(this.showTask._id).then(async () => {
      await this.getTasks();
      this.$router.push('/profile/teacher/tasks');
    });
  }

  removeFileFromTask(file: string) {
    removeFileFromTask(this.showTask._id, file).then(async response => {
      await this.getTasks();
      const x = this.tasks.find(a => (a as ITask)._id == this.showTask._id);
      if (x) {
        this.showTask = x;
      }
    });
  }

  handleAddFilesModalOk(bvModalEvt: Event) {
    if (!(this.$refs.addFilesForm as HTMLFormElement).reportValidity()) {
      bvModalEvt.preventDefault();
      return;
    }

    addFilesToTask(this.showTask._id, new FormData(this.$refs.addFilesForm as HTMLFormElement)).then(async response => {
      if (response.status == 201) {
        const body = await response.json();
        if (body.errors) {
          this.$bvToast.toast(
            `${body.errors} файл${quantitySuffix(body.errors)} не удалось загрузить (одинаковые имена файлов).`,
            {
              title: `Загрузка файлов`,
              autoHideDelay: 3000,
              variant: 'danger',
              toaster: 'b-toaster-bottom-right',
            },
          );
        }
      } else {
        this.$bvToast.toast(`Все файлы успешно загружены`, {
          title: `Загрузка файлов`,
          autoHideDelay: 3000,
          variant: 'success',
          toaster: 'b-toaster-bottom-right',
        });
      }

      await this.getTasks();
      const x = this.tasks.find(a => (a as ITask)._id == this.showTask._id);
      if (x) {
        this.showTask = x;
      }
    });
  }

  resetChangeDeadlineModal() {
    const now = new Date();
    this.changeDeadlineForm.time = now.toLocaleTimeString('en-US', { hour12: false });
    this.changeDeadlineForm.date = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }

  handleChangeDeadlineModalOk(bvModalEvt: Event) {
    changeTaskDeadline(this.showTask._id, new FormData(this.$refs.changeDeadlineForm as HTMLFormElement)).then(
      async response => {
        await this.getTasks();
        const x = this.tasks.find(a => (a as ITask)._id == this.showTask._id);
        if (x) {
          this.showTask = x;
        }
      },
    );
  }

  resolveAnswers() {
    resolveAnswers(this.showTask._id).then(async response => {
      this.answers = await response.json();
      this.answers.sort((a, b) => {
        if (!!a.mark == !!b.mark) {
          return 0;
        }
        if (!!a.mark && !b.mark) {
          return 1;
        }
        if (!a.mark && !!b.mark) {
          return -1;
        }
        return 0;
      });
    });
  }

  setMark(mark: number, answer: IAnswer) {
    this.hasUnsavedMarks = true;
    this.$set(this.unsavedMarks, answer._id, mark);
  }

  saveMarks() {
    saveMarks(this.unsavedMarks).then(response => {
      // maybe notification?
      this.resolveAnswers();
      this.hasUnsavedMarks = false;
      this.unsavedMarks = {};
    });
  }

  resetMarks() {
    this.hasUnsavedMarks = false;
    this.unsavedMarks = {};
  }
}
</script>

<style scoped></style>
