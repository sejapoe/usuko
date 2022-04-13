<template>
  <div v-if="user.accountType == 1">
    <div class="wrapper">
      <table>
        <tbody>
          <tr v-for="item in journal" :key="item._id">
            <td class="name">{{ item.fullname }}</td>
            <td v-for="jtem in item.marks" :key="jtem.task" class="tableMark">
              <a :href="`/profile/teacher/tasks/${jtem.task}`">{{ jtem.mark }}</a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IBVModal, IUser } from '../services/interfaces';
import { getJournal } from '../services/utils';

@Component
export default class Journal extends Vue implements IBVModal {
  @Prop(Object) user!: IUser;

  fields = [
    { key: 'task', label: 'Задание' },
    { key: 'mark', label: 'Оценка' },
  ];
  journal = [];

  mounted(): void {
    this.getJournal();
  }

  getJournal(): void {
    getJournal().then(async response => {
      console.log(response);
      if (response.ok) {
        this.journal = await response.json();
        this.fillJournal();
      }
    });
  }

  fillJournal(): void {
    let maxLength = 0;
    for (const i of this.journal) {
      if (i.marks.length > maxLength) {
        maxLength = i.marks.length;
      }
    }
    let c = 0;
    for (const i of this.journal) {
      for (let j = i.marks.length; j < maxLength; j++) {
        (
          i.marks as Array<{
            mark: number | null;
            task: string;
          }>
        ).push({
          mark: null,
          task: `filler_${c}`,
        });
        c++;
      }
    }
  }
}
</script>

<style scoped>
.wrapper {
  overflow-x: auto;
  white-space: nowrap;
  margin-left: 15em;
}

table td {
  border-collapse: separate;
  border: 1px solid white;
  border-spacing: 0;
  padding: 0.25em;
  margin: 0;
}

table td.name {
  min-width: 15em;
  position: absolute;
  position: -webkit-sticky;
  left: 1.25rem;
  top: auto;
  margin-top: -1px;
}

table td.tableMark {
  min-width: 2em;
  text-align: center;
}
</style>
