<template>
  <div class="wrapper">
    <main-form
      v-if="ready"
      :dialogVariants="content.dialogVariants"
      :formLabels="content.formLabels"
      @update="update($event)"
    />
  </div>
</template>

<script>
import axios from 'axios';
import MainForm from '@/components/MainForm';

export default {
  components: {
    MainForm,
  },
  props: {
    content: {
      type: [Object, Array],
      required: true,
    },
  },
  data() {
    return {
      ready: false,
      form: {
        name: '',
        msg: '',
      },
      filtered: {
        name: '',
        msg: '',
        check: 'gAe2ae8cY8HnENtA',
        datetime: '',
      },
      message: '',
      tooltip: '',
      error: false,
      token: '',
    };
  },
  methods: {
    update(data) {
      this.form.msg = data.message;
      this.form.name = data.name;
      this.filter();
    },
    filter() {
      let name = this.form.name;
      let msg = this.form.msg;
      // msg = msg.replace(/(\r\n|\r|\n)/g, '<br>');
      if (!name) {
        name = 'Аноним';
      }
      this.filtered.name = name;
      this.filtered.msg = msg;
      this.filtered.datetime = new Date().toISOString();
      this.autorize();
    },

    autorize() {
      axios
        .post('https://api.starchenkov.pro/api/auth/local', {
          identifier: 'username_here',
          password: 'password_here',
        })
        .then((response) => {
          this.token = response.data.jwt;
          this.sendData();
        });
    },
    sendData() {
      axios
        .post(
          'https://api.starchenkov.pro/api/plaints',
          {
            data: {
              name: this.filtered.name,
              msg: this.filtered.msg,
              datetime: this.filtered.datetime,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${this.token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        .then((response) => {
          // console.log('Post created successfully:', response.data);
        })
        .catch((error) => {
          this.error = true;
          this.$router.push('/error');
        })
        .finally(() => {
          if (!this.error) {
            setTimeout(() => this.$router.push('/sent'), 5000);
          }
        });
    },
  },
  mounted() {
    this.ready = true;
  },
};
</script>

<style lang="postcss"></style>
