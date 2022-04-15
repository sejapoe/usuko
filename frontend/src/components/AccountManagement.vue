<template>
  <div v-if="user.accountType == 3">
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
        <span v-if="alreadyRegistered"> Аккаунт с таким именем пользователя уже существует </span>
        <form v-else-if="!password" ref="createForm" @submit.stop.prevent="handleSubmitOk">
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
        <b-button v-b-modal.modal-find block>Настроить фильтр</b-button>
      </b-col>

      <b-modal
        id="modal-find"
        ref="modal-find"
        title="Фильтр аккаунтов"
        header-bg-variant="dark"
        body-bg-variant="dark"
        footer-bg-variant="dark"
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
            <b-form-input v-model="findForm.login" placeholder="Введите логин" />
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
      <span v-if="accounts.length > 0">Аккаунты:</span>
      <span v-else>Нет подходящих аккаунтов</span>
      <ul>
        <li v-for="item in accounts" :key="item.login">
          <a @click="showInfoModal(item)" href="#">{{ item.name }} {{ item.lastname }} ({{ item.username }})</a>
        </li>
      </ul>
    </div>

    <b-modal
      id="modal-info"
      ref="modal-info"
      :title="`${isEditingShowAccount ? 'Редактирование' : 'Просмотр'} аккаунта ${showAccount.username}`"
      header-bg-variant="dark"
      body-bg-variant="dark"
      footer-bg-variant="dark"
      @hidden="
        showAccount = {};
        isEditingShowAccount = false;
      "
      ok-only
    >
      <template v-if="!isEditingShowAccount">
        {{ showAccount.accountType ? types[showAccount.accountType].text : '' }}<br />Имя: {{ showAccount.name
        }}<br />Фамилия:
        {{ showAccount.lastname }}
      </template>
      <template v-else>
        <form ref="editForm" @submit.stop.prevent="handleSubmitOk">
          <b-form-group label="Выберите тип аккаунта">
            <b-form-radio-group v-model="editForm.type" :options="types" />
          </b-form-group>

          <b-form-group label="Имя">
            <b-form-input v-model="editForm.name" placeholder="Введите имя" required />
          </b-form-group>

          <b-form-group label="Фамилия">
            <b-form-input v-model="editForm.lastname" placeholder="Введите фамилию" required />
          </b-form-group>

          <b-form-group label="Класс" v-if="editForm.type === 0">
            <b-form-select v-model="editForm.class" :options="classes">
              <template #first>
                <b-form-select-option :value="null" disabled>Выберите класс</b-form-select-option>
              </template>
            </b-form-select>
          </b-form-group>

          <b-form-group label="Предмет" v-if="editForm.type === 1">
            <b-form-input v-model="editForm.subject" placeholder="Введите предмет" />
          </b-form-group>
        </form>
      </template>

      <template v-if="!isEditingShowAccount" #modal-footer="{ ok }">
        <b-button size="sm" variant="danger" @click="resetPassword()"> Сбросить пароль </b-button>
        <b-button size="sm" variant="info" @click="edit()"> Редактировать </b-button>
        <b-button size="sm" variant="success" @click="ok()"> OK </b-button>
      </template>
      <template v-else #modal-footer>
        <b-button size="sm" variant="danger" @click="isEditingShowAccount = false"> Отменить </b-button>
        <b-button size="sm" variant="success" @click="saveEditions()"> Сохранить </b-button>
      </template>
    </b-modal>

    <b-modal
      id="modal-pass"
      ref="modal-pass"
      title="Изменённый пароль"
      header-bg-variant="dark"
      body-bg-variant="dark"
      footer-bg-variant="dark"
      @hidden="password = ''"
      ok-only
    >
      <span>Новый пароль: {{ password }}</span>
    </b-modal>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator';
import { IBVModal, IUser, IClass, IExtendedClass } from '../services/interfaces';
import { createAccount, transliterate, findAccounts, editAccount, resetPassword, getClasses } from '../services/utils';

@Component
export default class AccountManagement extends Vue implements IBVModal {
  @Prop(Object) user!: IUser;

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
  editForm = {
    type: 0,
    name: '',
    lastname: '',
    class: '',
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
  alreadyRegistered = false;
  accounts = null;
  showAccount: IUser = {
    _id: '',
    accountType: 0,
    name: '',
    lastname: '',
    username: '',
    class: '',
    subject: '',
  };
  isEditingShowAccount = false;

  mounted() {
    this.getClasses();
    this.findAccounts({
      type: -1,
    });
  }

  getClasses() {
    getClasses().then(async response => {
      this.classes = await response.json();
      this.classes.forEach(ell => {
        const el = ell as IExtendedClass;
        el.text = `${el.num} ${el.liter}`;
        el.value = el._id;
      });
    });
  }

  resetCreateModal() {
    this.createForm.type = 0;
    this.createForm.name = '';
    this.createForm.lastname = '';
    this.createForm.login = '';
    this.createForm.generateLogin = false;
    this.createForm.class = null;
    this.createForm.subject = '';
    this.alreadyRegistered = false;
  }

  handleCreateModalOk(bvModalEvt: Event) {
    if (!this.password && !this.alreadyRegistered) {
      bvModalEvt.preventDefault();

      this.handleSubmitCreateForm();
    } else {
      this.password = '';
      this.alreadyRegistered = false;
    }
  }

  handleSubmitCreateForm() {
    if (!(this.$refs.createForm as HTMLFormElement).reportValidity()) {
      return;
    }

    createAccount(this.createForm).then(async response => {
      const temp = await response.text();
      if (temp == 'EAR') {
        this.alreadyRegistered = true;
      } else {
        this.password = temp;
      }
    });
  }

  updateLogin() {
    if (this.createForm.generateLogin) {
      this.createForm.login = transliterate(this.createForm.lastname.toLowerCase());
    }
  }

  handleFindModalOk(bvModalEvt: Event) {
    bvModalEvt.preventDefault();

    this.findAccounts(this.findForm);
  }

  findAccounts(filter: Record<string, unknown>) {
    findAccounts(filter).then(async response => {
      this.accounts = await response.json();
      this.isEditingShowAccount = false;
      this.$root.$emit('bv::hide::modal', 'modal-find');
    });
  }

  showInfoModal(item: IUser) {
    this.showAccount = item;

    this.$root.$emit('bv::show::modal', 'modal-info');
  }

  edit() {
    this.editForm.type = +this.showAccount.accountType;
    this.editForm.name = this.showAccount.name;
    this.editForm.lastname = this.showAccount.lastname;
    this.editForm.class = this.showAccount.class;
    this.editForm.subject = this.showAccount.subject;

    this.isEditingShowAccount = true;
    this.$root.$emit('bv::show::modal', 'modal-info');
  }

  resetPassword() {
    resetPassword(this.showAccount._id).then(password => {
      this.password = password.toString();
      this.$root.$emit('bv::show::modal', 'modal-pass');
    });

    this.$root.$emit('bv::hide::modal', 'modal-info');
  }

  saveEditions() {
    editAccount(this.showAccount._id, this.editForm).then(() => {
      this.makeSavedToast(this.showAccount.username);
      this.findAccounts(this.findForm);
      this.$root.$emit('bv::hide::modal', 'modal-info');
    });
  }

  makeSavedToast(login: string) {
    this.$bvToast.toast(`Изменения об аккаунте ${login} успешно сохранены`, {
      title: `Изменения сохранены`,
      autoHideDelay: 3000,
      variant: 'warning',
      toaster: 'b-toaster-bottom-right',
    });
  }
}
</script>

<style scoped></style>
