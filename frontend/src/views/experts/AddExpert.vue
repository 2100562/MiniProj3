<template>
  <!-- Portfolio Section -->
  <section class="page-section">
    <b-container>
      <HeaderPage title="Adicionar Especialista" />

      <!--FORM-->
      <b-row>
        <b-col cols="2"></b-col>
        <b-col>
          <form @submit.prevent="add">
            <div class="form-group">
              <select
                id="user"
                v-model="user"
                class="form-control form-control-lg"
                required
              >
                <option value>-- SELECIONA UTILIZADOR --</option>
                <option v-for="user of users" :key="user._id" :value="user._id"
                >{{ user.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <select
                id="sltGroup"
                v-model="group"
                class="form-control form-control-lg"
                required
              >
                <option value>-- SELECIONA ESPECIALIDADE --</option>
                <option value="anfibio">ANFÍBIO</option>
                <option value="ave">AVE</option>
                <option value="mamifero">MAMÍFERO</option>
                <option value="peixe">PEIXE</option>
                <option value="reptil">RÉPTIL</option>
              </select>
            </div>
            <button class="btn btn-outline-success btn-lg mr-2" type="submit">
              <i class="fas fa-plus-square"></i> ADICIONAR
            </button>
            <router-link
              :to="{ name: 'listExperts' }"
              class="btn btn-outline-danger btn-lg"
              tag="button"
            ><i class="fas fa-window-close"></i> CANCELAR
            </router-link>
          </form>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import HeaderPage from "@/components/HeaderPage.vue";
import router from "@/router";
import { mapGetters } from "vuex";
import { FETCH_USERS } from "@/store/users/user.constants";
import { ADD_EXPERT } from "@/store/experts/expert.constants";

export default {
  name: "AddExpert",
  components: {
    HeaderPage
  },
  data: () => {
    return {
      user: "",
      group: "",
      users: []
    };
  },
  computed: {
    ...mapGetters("user", ["getUsers", "getMessage"])
  },
  methods: {
    fetchUsers() {
      this.$store.dispatch(`user/${FETCH_USERS}`).then(
        () => {
          this.users = this.getUsers;
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    },
    add() {
      let user = this.$data.users.find(u => u._id === this.$data.user);
      user.isExpert = true;
      user.group = this.$data.group;
      this.$store.dispatch(`expert/${ADD_EXPERT}`, user).then(
        () => {
          this.$alert(this.getMessage, "Especialista adicionado!", "success");
          router.push({ name: "listExperts" });
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    }
  },
  created() {
    this.fetchUsers();
  }
};
</script>
