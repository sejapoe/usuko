<template>
  <div v-if="!!user">
    <b-container>
      <b-row>
        <b-col class="no-padding" cols="3">
          <li
            class="dialog"
            v-for="item in conversations"
            :key="item.reciever._id"
            :class="{ selected: item.reciever._id == selectedConversation }"
          >
            <a :href="`/profile/chat?rec=${item.reciever._id}`">
              <div class="dialog--container">
                <div class="dialog--content">
                  <div class="dialog--content-cw">
                    <div class="dialog--date_wrapper">
                      <div class="dialog--date">
                        {{ new Date(item.lastMessage.timestamp).toLocaleString('ru-RU') }}
                      </div>
                    </div>
                    <div class="dialog--name">
                      <span class="dialog--name-w">
                        <span>{{ `${item.reciever.name}  ${item.reciever.lastname}` }} </span>
                      </span>
                    </div>
                    <div class="dialog--preview">
                      <span v-if="isMyMessage(item.lastMessage)">Вы:</span>
                      <span v-html="truncate(item.lastMessage.message, isMyMessage(item.lastMessage) ? 42 : 46)"></span>
                    </div>
                  </div>
                </div>
              </div>
            </a>
          </li>
        </b-col>
        <b-col cols="9">
          <div v-if="selectedConversation">
            <li v-for="item in conversation" :key="item._id">
              <div class="message--container" :class="{ 'message--my': isMyMessage(item) }">
                <div class="message--wrapper">
                  <div class="message--content">
                    <span class="message"> {{ item.message }} </span>
                  </div>
                </div>
              </div>
            </li>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { IBVModal, IMessage, IUser } from '../services/interfaces';
import { getConversation, getConversations } from '../services/utils';

@Component
export default class Chat extends Vue implements IBVModal {
  @Prop(Object) user!: IUser;

  conversations = [];
  conversation = [];
  selectedConversation = '';

  mounted(): void {
    this.selectedConversation = this.$route.query.rec as string;
    this.getConversations(true);
    setInterval(getConversations, 5000);
  }

  async getConversations(isFirst = false): Promise<void> {
    await getConversations().then(async response => {
      const candidate = await response.json();
      if (!isFirst) {
        // TODO: new message check;
      }
      this.conversations = candidate;
    });
    if (this.selectedConversation) {
      await getConversation(this.selectedConversation).then(async response => {
        this.conversation = await response.json();
        this.conversation.reverse();
      });
    }
  }

  truncate(str: string, n: number): string {
    return str.length > n ? str.substr(0, n - 1) + '&hellip;' : str;
  }

  isMyMessage(item: IMessage): boolean {
    return item.sender.toString() == this.user._id;
  }
}
</script>

<style scoped>
div[class*='col'] {
  outline: 1px solid white;
}

.no-padding {
  padding: 0 0;
}

a,
a:hover {
  font: inherit;
  color: inherit;
  font-style: inherit;
  text-decoration: inherit;
}

.selected {
  background-color: #415666;
}

.selected + .dialog > a > .dialog--container > .dialog--content,
.selected > a > .dialog--container > .dialog--content {
  border-top: transparent;
}

li {
  list-style: none;
}

.dialog {
  height: 63px;
  cursor: pointer;
}

.dialog--container {
  padding: 0 15px;
}

.dialog:not(.selected):hover {
  background-color: #53585c;
}

.dialog:hover,
.dialog:hover + .dialog,
.selected,
.selected + .dialog {
  border-top: solid 1px rgb(156, 153, 153);
}

.dialog--content {
  padding-right: 15px;
  position: relative;
  display: block;
  border-top: solid 1px rgb(156, 153, 153);
}

.dialog:hover + .dialog > a > .dialog--container > .dialog--content,
.dialog:hover > a > .dialog--container > .dialog--content {
  border-top: transparent;
}

.dialog--content-cw {
  padding: 8px 0;
}

.dialog--preview {
  font-size: 11.5px;
}

.dialog--date_wrapper {
  right: 0;
  display: flex;
  position: absolute;
  top: 11px;
}

.dialog--date {
  font-size: 12.5px;
  color: rgb(138, 146, 156);
  opacity: 0.7;
}

.dialog--name {
  font-size: 15px;
  font-weight: 500;
  height: 18px;
  position: relative;
  width: 100%;
  margin-bottom: 7px;
}

.dialog--name-w {
  padding-bottom: 1px;
  max-width: 70%;
  white-space: nowrap;
  display: inline-block;
  vertical-align: top;
  text-overflow: ellipsis;
  overflow: hidden;
}

.message--container {
  display: flex;
  position: relative;
  flex-wrap: wrap;
  margin: 0 auto 0.25rem;
}

.message--content {
  background: #415666;
  min-width: 56px;
  max-width: 100%;
  position: relative;
  flex-direction: column-reverse;
  border-radius: 9px 9px 9px 9px;
}

.message {
  padding: 0 0.5rem 0.375rem 0.625rem;
  font-size: 20x;
}

.message--wrapper {
  display: flex;
  flex-direction: column;
}

.message--my {
  flex-direction: row-reverse;
}
</style>
