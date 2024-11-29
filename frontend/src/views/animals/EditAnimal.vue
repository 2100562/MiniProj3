<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Editar Animal" />

      <!--FORM-->
      <b-row>
        <b-col cols="2"></b-col>
        <b-col cols="8">
          <form @submit.prevent="update">
            <div class="form-group">
              <input
                id="txtName"
                v-model="animal.name"
                class="form-control form-control-lg"
                placeholder="escreve nome"
                required
                type="text"
              />
            </div>
            <div class="form-group">
              <select
                id="sltGroup"
                v-model="animal.group"
                class="form-control form-control-lg"
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
                v-model="animal.description"
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
                  v-model="animal.level"
                  class="form-control form-control-lg"
                  max="5"
                  min="1"
                  placeholder="escreve o nível"
                  required
                  type="number"
                />
              </div>
            </div>
            <div class="form-group">
              <input
                id="txtPhoto"
                v-model="animal.links[0].url"
                class="form-control form-control-lg"
                placeholder="escreve link para foto"
                required
                type="url"
              />
            </div>
            <div class="form-group">
              <input
                id="txtPhoto"
                v-model="animal.links[1].url"
                class="form-control form-control-lg"
                placeholder="escreve link para vídeo"
                type="url"
              />
            </div>
            <div class="form-group">
              <input
                id="txtSound"
                v-model="animal.links[2].url"
                class="form-control form-control-lg"
                placeholder="escreve link para som"
                type="url"
              />
            </div>
            <div class="form-group">
              <select
                id="sponsor"
                v-model="animal.sponsor"
                class="form-control form-control-lg"
                required
              >
                <option value>-- SELECIONA PATROCINADOR --</option>
                <option v-for="user of users" :key="user._id" :value="user._id"
                  >{{ user.name }}
                </option>
              </select>
            </div>
            <button
              class="btn btn-outline-success btn-lg mr-2"
              type="button"
              @click="removeComments()"
            >
              <i class="fas fa-edit"></i> REMOVER COMENTÁRIOS
            </button>
            <button class="btn btn-outline-success btn-lg mr-2" type="submit">
              <i class="fas fa-edit"></i> ATUALIZAR
            </button>
            <router-link
              :to="{ name: 'listAnimals' }"
              class="btn btn-outline-danger btn-lg"
              tag="button"
            >
              <i class="fas fa-window-close"></i> CANCELAR
            </router-link>
          </form>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { EDIT_ANIMAL } from "@/store/animals/animal.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import router from "@/router";
import { mapGetters } from "vuex";
import { FETCH_USERS } from "@/store/users/user.constants";

export default {
  name: "EditAnimal",
  components: {
    HeaderPage
  },
  data: () => {
    return {
      animal: {},
      users: []
    };
  },
  computed: {
    ...mapGetters("animal", ["getAnimalsById", "getMessage"]),
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
    removeComments() {
      this.animal.comments.length = 0;
      this.$alert(
        "Comentários removidos, clique em atualizar!",
        "Comentários!",
        "success"
      );
    },
    update() {
      this.$store.dispatch(`animal/${EDIT_ANIMAL}`, this.$data.animal).then(
        () => {
          this.$alert(this.getMessage, "Animal atualizado!", "success");
          router.push({ name: "listAnimals" });
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    }
  },
  created() {
    this.fetchUsers();
    this.animal = this.getAnimalsById(this.$route.params.animalId);
  }
};
</script>

<style scoped>
.center_div {
  margin: 0 auto;
  width: 80%;
}
</style>
