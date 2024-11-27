import { userService } from "./user.service";

export const expertService = {
  async getExperts(token) {
    return userService.getUsers(token).then(res => {
      res.body = res.body.filter(user => user.isExpert);
      return res;
    });
  },

  async addExpert(token, payload) {
    return userService.editUser(token, payload);
  },

  async editExpert(token, payload) {
    return userService.editUser(token, payload);
  },

  async removeExpert(token, id) {
    return userService.removeUser(token, id);
  }
};

export default expertService;
