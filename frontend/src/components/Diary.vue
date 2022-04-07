<template>
  <div v-if="user.accountType == 0">
    <b-card-group deck>
      <div v-for="item in diary" :key="item.teacher._id">
        <b-card
          :title="`${item.teacher.name} ${item.teacher.lastname} (${item.teacher.subject})`"
          style="width: 21.7rem; height: 25rem"
          bg-variant="dark"
          text-variant="white"
        >
          <b-table sticky-header="90%" :items="item.marks" :fields="fields" table-variant="dark" borderless fixed>
            <template #cell(task)="data">
              <a :href="`/profile/students/tasks/${data.value._id}`">{{ data.value.title }}</a>
            </template>
          </b-table>
          <template #footer>
            <b-button size="sm" block disabled>Открыть чат с учителем</b-button>
            <!-- TODO: #14 Make chat system -->
          </template>
        </b-card>
      </div>
    </b-card-group>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IBVModal, IUser } from '../services/interfaces';
import { getDiary } from '../services/utils';

@Component
export default class Diary extends Vue implements IBVModal {
  @Prop(Object) user!: IUser;

  fields = [
    { key: 'task', label: 'Задание' },
    { key: 'mark', label: 'Оценка' },
  ];
  diary = [];

  mounted() {
    this.getDiary();
  }

  getDiary() {
    getDiary().then(async response => {
      this.diary = await response.json();
    });
  }
}
</script>

<style scoped>
.card-deck .card {
  flex: 1 0 0%;
  margin: 1rem;
}
</style>
