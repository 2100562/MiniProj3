<template>
  <!-- Portfolio Section -->
  <section class="page-section">
    <b-container>
      <HeaderPage title="Adicionar Animal" />

      <!--FORM-->
      <b-row>
        <b-col cols="2"></b-col>
        <b-col>
          <form @submit.prevent="add">
            <div class="form-group">
              <input
                id="txtName"
                v-model="name"
                class="form-control form-control-lg"
                placeholder="escreve nome"
                required
                type="text"
              />
            </div>
            <div class="form-group">
              <select
                id="sltGroup"
                v-model="group"
                class="form-control form-control-lg"
                required
              >
                <option value>-- SELECIONA GRUPO --</option>
                <option value="anfibio">ANFÍBIO</option>
                <option value="ave">AVE</option>
                <option value="mamifero">MAMÍFERO</option>
                <option value="peixe">PEIXE</option>
                <option value="reptil">RÉPTIL</option>
              </select>
            </div>
            <div class="form-group">
              <textarea
                id="txtDescription"
                v-model="description"
                class="form-control form-control-lg"
                cols="30"
                placeholder="escreve descrição"
                required
                rows="10"
              ></textarea>
            </div>
            <div class="form-group">
              <div class="form-group">
                <input
                  id="txtLevel"
                  v-model="level"
                  class="form-control form-control-lg"
                  max="5"
                  min="1"
                  onmouseenter="(this.type='number')"
                  onmouseleave="(this.type='text')"
                  placeholder="escreve o nível"
                  required
                  type="text"
                />
              </div>
            </div>
            <div class="form-group">
              <input
                id="txtPhoto"
                v-model="links[0].url"
                class="form-control form-control-lg"
                placeholder="escreve link para foto"
                required
                type="url"
              />
            </div>
            <div class="form-group">
              <input
                id="txtPhoto"
                v-model="links[1].url"
                class="form-control form-control-lg"
                placeholder="escreve link para vídeo"
                type="url"
              />
            </div>
            <div class="form-group">
              <input
                id="txtSound"
                v-model="links[2].url"
                class="form-control form-control-lg"
                placeholder="escreve link para som"
                type="url"
              />
            </div>
            <div class="form-group">
              <select
                id="sponsor"
                v-model="sponsor"
                class="form-control form-control-lg"
                required
              >
                <option value>-- SELECIONA PATROCINADOR --</option>
                <option v-for="user of users" :key="user._id" :value="user._id"
                >{{ user.name }}
                </option>
              </select>
            </div>
            <button class="btn btn-outline-success btn-lg mr-2" type="submit">
              <i class="fas fa-plus-square"></i> ADICIONAR
            </button>
            <router-link
              :to="{ name: 'listAnimals' }"
              class="btn btn-outline-danger btn-lg"
              tag="button"
            ><i class="fas fa-window-close"></i> CANCELAR
            </router-link
            >
          </form>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { ADD_ANIMAL } from "@/store/animals/animal.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import router from "@/router";
import { mapGetters } from "vuex";
import { EDIT_USER, FETCH_USERS } from "@/store/users/user.constants";

export default {
  name: "AddAnimal",
  components: {
    HeaderPage
  },
  data: () => {
    return {
      name: "",
      group: "",
      description: "",
      level: "",
      links: [
        { types: "photo", url: "" },
        { types: "video", url: "" },
        { types: "sound", url: "" }
      ],
      evaluation: [],
      comments: [],
      sponsor: "",
      users: []
    };
  },
  computed: {
    ...mapGetters("animal", ["getMessage"]),
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
      let payload = this.$data;
      let user = payload.users.find(u => u._id === payload.sponsor);
      user.isSponsor = true;
      delete payload.users;
      this.$store.dispatch(`animal/${ADD_ANIMAL}`, payload).then(
        () => {
          this.$store.dispatch(`user/${EDIT_USER}`, user).then(
            () => {
              this.$alert(this.getMessage, "Animal adicionado!", "success");
              router.push({ name: "listAnimals" });
            },
            err => {
              this.$alert(`${err.message}`, "Erro", "error");
            }
          );
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
