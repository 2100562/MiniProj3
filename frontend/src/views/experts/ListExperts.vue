<template>
  <section class="page-section">
    <b-container>
      <HeaderPage title="Gestão de Especialistas" />
      <!--MENU TOPO-->
      <b-row class="mb-4">
        <b-col cols="2"></b-col>
        <b-col>
          <router-link
            :to="{ name: 'addExpert' }"
            class="btn btn-outline-success mr-2 mt-2"
            tag="button"
          >
            <i class="fas fa-plus-square"></i> ADICIONAR ESPECIALISTA
          </router-link>
          <router-link
            :to="{ name: 'admin' }"
            class="btn btn-outline-info mr-2 mt-2"
            tag="button"
          >
            <i class="fas fa-bars"></i> MENU PRINCIPAL
          </router-link>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>

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
                  v-if="sortType === 1"
                  class="fas fa-arrow-up"
                  @click="sort()"
                ></i>
                <i v-else class="fas fa-arrow-down" @click="sort()"></i>
              </th>
              <th scope="col">CIDADE</th>
              <th scope="col">ESPECIALIDADE</th>
              <th scope="col">AÇÕES</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="expert of experts" :key="expert._id">
              <td class="pt-4">{{ expert.name }}</td>
              <td class="pt-4">{{ expert.location.city }}</td>
              <td class="pt-4">{{ expert.group }}</td>
              <td>
                <router-link
                  :to="{ name: 'editUser', params: { userId: expert._id } }"
                  tag="button"
                  class="btn btn-outline-success mr-2 mt-2"
                >
                  <i class="fas fa-edit"></i> EDITAR
                </router-link>
                <button
                  class="btn btn-outline-success mr-2 mt-2"
                  type="button"
                  @click="viewExpert(expert._id)"
                >
                  <i class="fas fa-search"></i> VER
                </button>
                <button
                  class="btn btn-outline-danger mr-2 mt-2"
                  type="button"
                  @click="removeExpert(expert._id)"
                >
                  <i class="fas fa-trash-alt"></i> REMOVER
                </button>
              </td>
            </tr>
            </tbody>
          </table>
        </b-col>
        <b-col cols="2"></b-col>
      </b-row>
    </b-container>
  </section>
</template>

<script>
import { FETCH_EXPERTS } from "@/store/experts/expert.constants";
import HeaderPage from "@/components/HeaderPage.vue";
import { mapGetters } from "vuex";
import { REMOVE_USER } from "@/store/users/user.constants";

export default {
  name: "ManageExperts",
  components: {
    HeaderPage
  },
  data: function() {
    return {
      experts: [],
      sortType: 1
    };
  },
  computed: {
    ...mapGetters("expert", ["getExperts", "getMessage"]),
    ...mapGetters(["getUserLevelByPoints"])
  },
  methods: {
    fetchExperts() {
      this.$store.dispatch(`expert/${FETCH_EXPERTS}`).then(
        () => {
          this.experts = this.getExperts;
        },
        err => {
          this.$alert(`${err.message}`, "Erro", "error");
        }
      );
    },
    sort() {
      this.experts.sort(this.compareNames);
      this.sortType *= -1;
    },
    compareNames(u1, u2) {
      if (u1.name > u2.name) return 1 * this.sortType;
      else if (u1.name < u2.name) return -1 * this.sortType;
      else return 0;
    },
    viewExpert(id) {
      const expert = this.experts.find(expert => expert._id === id);
      this.$fire({
        title: expert.auth.username,
        html: this.generateTemplate(expert),
        imageUrl: require(`@/assets/avatars/${
          this.getUserLevelByPoints(expert.gamification.points).avatar
        }.png`),
        imageWidth: 150,
        imageHeight: 150,
        imageAlt: "Imagem desconhecida"
      });
    },

    generateTemplate(user) {
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
        user.isExpert ? "Sim" : "Não"
      }<br>
          <b>Data de registo:</b> ${this.formatDate(
        user.registration_date
      )} <br>
          <b>Data de nascimento:</b> ${this.formatDate(user.birth_date)}<br>
          <b>Cidade:</b> ${user.location.city}<br>
          <b>País:</b> ${user.location.country}<br>
          <b>Especialidade:</b> ${user.group}
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
    removeExpert(id) {
      this.$confirm(
        "Se sim, clique em OK",
        "Deseja mesmo remover o especialista?",
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
    this.fetchExperts();
  }
};
</script>
