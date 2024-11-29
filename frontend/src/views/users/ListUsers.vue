<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Gestão de Utilizadores" />

      <!--MENU TOPO-->
      <b-row class="mb-4">
        <b-col cols="1"></b-col>
        <b-col>
          <router-link
            :to="{ name: 'addUser' }"
            class="btn btn-outline-success mr-2 mt-2"
            tag="button"
            ><i class="fas fa-plus-square"></i> ADICIONAR UTILIZADOR
          </router-link>
          <router-link
            :to="{ name: 'admin' }"
            class="btn btn-outline-info mr-2 mt-2"
            tag="button"
            ><i class="fas fa-bars"></i> MENU PRINCIPAL
          </router-link>
        </b-col>
        <b-col cols="1"></b-col>
      </b-row>

      <!-- TABELA -->
      <b-row>
        <b-col cols="1"></b-col>
        <b-col>
          <table class="table table-striped">
            <thead class="thead-dark">
              <tr>
                <th scope="col">
                  NOME
                  <i
                    v-if="sortType === 1"
                    class="fas fa-arrow-up"
                    @click="sort()"
                  ></i>
                  <i v-else class="fas fa-arrow-down" @click="sort()"></i>
                </th>
                <th scope="col">TIPO</th>
                <th scope="col">PATROCINADOR</th>
                <th scope="col">ESPECIALISTA</th>
                <th scope="col">DATA DE CRIAÇÃO</th>
                <th scope="col">AÇÕES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user of users" :key="user._id">
                <td class="pt-4">{{ user.name }}</td>
                <td class="pt-4">
                  {{
                    user.type === "admin"
                      ? "Administrador"
                      : "Utilizador normal"
                  }}
                </td>
                <td class="pt-4">{{ user.isSponsor ? "Sim" : "Não" }}</td>
                <td class="pt-4">{{ user.isExpert ? "Sim" : "Não" }}</td>
                <td class="pt-4">{{ formatDate(user.registration_date) }}</td>
                <td>
                  <router-link
                    :to="{ name: 'editUser', params: { userId: user._id } }"
                    class="btn btn-outline-success mr-2"
                    tag="button"
                    ><i class="fas fa-edit"></i> EDITAR
                  </router-link>
                  <button
                    class="btn btn-outline-success mr-2"
                    type="button"
                    @click="viewUser(user._id)"
                  >
                    <i class="fas fa-search"></i> VER
                  </button>
                  <button
                    class="btn btn-outline-danger mr-2 "
                    type="button"
                    @click="removeUser(user._id)"
                  >
                    <i class="fas fa-trash-alt"></i> REMOVER
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </b-col>
        <b-col cols="1"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { FETCH_USERS, REMOVE_USER } from "@/store/users/user.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import { mapGetters } from "vuex";
import { FETCH_ANIMALS } from "@/store/animals/animal.constants";

export default {
  name: "ManageUsers",
  components: {
    HeaderPage
  },
  data: function() {
    return {
      users: [],
      sortType: 1,
      animals: []
    };
  },
  computed: {
    ...mapGetters(["getUserLevelByPoints"]),
    ...mapGetters("user", ["getUsers", "getMessage"]),
    ...mapGetters("animal", ["getAnimals", "getMessage", "getAnimalsById"])
  },
  methods: {
    fetchUsers() {
      return this.$store.dispatch(`user/${FETCH_USERS}`).then(
        () => {
          this.users = this.getUsers;
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    },
    fetchAnimals() {
      this.$store.dispatch(`animal/${FETCH_ANIMALS}`).then(
        () => {
          this.animals = this.getAnimals;
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    },
    sort() {
      this.users.sort(this.compareNames);
      this.sortType *= -1;
    },
    compareNames(u1, u2) {
      if (u1.name > u2.name) return 1 * this.sortType;
      else if (u1.name < u2.name) return -1 * this.sortType;
      else return 0;
    },

    viewUser(id) {
      const user = this.users.find(user => user._id === id);
      this.$fire({
        title: user.auth.username,
        html: this.generateTemplate(user),
        imageUrl: require(`@/assets/avatars/${
          this.getUserLevelByPoints(user.gamification.points).avatar
        }.png`),
        imageWidth: 150,
        imageHeight: 150,
        imageAlt: "Imagem desconhecida"
      });
    },

    generateTemplate(user) {
      const _animals = [];
      _animals.push(this.animals.find(a => a.sponsor === user._id));

      return `
          <h5>${user.gamification.points} pontos (${
        this.getUserLevelByPoints(user.gamification.points).name
      })</h5>
          <p>${user.description}</p>
          <p>
          <b>Nome:</b> ${user.name} <br>
          <b>Tipo de utilizador:</b> ${
            user.type === "admin" ? "Administrador" : "Utilizador normal"
          } <br>
          <b>Patrocinador:</b> ${user.isSponsor ? "Sim" : "Não"}<br>
          <b>Especialista:</b> ${
            user.isExpert ? "Sim (" + user.group + ")" : "Não"
          }<br>
          <b>Data de registo:</b> ${this.formatDate(
            user.registration_date
          )} <br>
          <b>Data de nascimento:</b> ${this.formatDate(user.birth_date)}<br>
          <b>Cidade:</b> ${user.location.city}<br>
          <b>País:</b> ${user.location.country}<br>
          <div v-if="user.type === 'sponsor' && _animals.length > 0">
            <b-card-body title="ANIMAIS PATROCINADOS" align="center"> </b-card-body>
            <!--TABLE-->
            <b-row>
              <b-col cols="2"></b-col>
              <b-col>
                <table class="table table-striped">
                  <thead class="thead-dark">
                    <tr>
                      <th scope="col">
                        NOME
                        <i
                          class="fas fa-arrow-up"
                          v-if="sortType === 1"
                          @click="sort()"
                        ></i>
                        <i class="fas fa-arrow-down" v-else @click="sort()"></i>
                      </th>
                      <th scope="col">GRUPO</th>
                      <th scope="col">NÍVEL</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="pt-4">${_animals[0].name}</td>
                      <td class="pt-4">${_animals[0].group}</td>
                      <td class="pt-4">${_animals[0].level}</td>
                    </tr>
                  </tbody>
                </table>
              </b-col>
              <b-col cols="2"></b-col>
            </b-row>
          </div>
          </p>
        `;
    },
    formatDate: d => {
      const newDate = new Date(Date.parse(d));
      return (
        newDate.getFullYear() +
        "-" +
        (newDate.getMonth() + 1) +
        "-" +
        newDate.getDate() +
        " " +
        newDate.getHours() +
        ":" +
        newDate.getMinutes() +
        ":" +
        newDate.getSeconds()
      );
    },
    removeUser(id) {
      this.$confirm(
        "Se sim, clique em OK",
        "Deseja mesmo remover o utilizador?",
        "warning",
        { confirmButtonText: "OK", cancelButtonText: "Cancelar" }
      ).then(
        () => {
          this.$store.dispatch(`user/${REMOVE_USER}`, id).then(() => {
            this.$alert(this.getMessage, "Utilizador removido!", "success");
            this.fetchUsers();
          });
        },
        () => {
          this.$alert("Remoção cancelada!", "Informação", "info");
        }
      );
    }
  },
  created() {
    this.fetchUsers();
    this.fetchAnimals();
  }
};
</script>
