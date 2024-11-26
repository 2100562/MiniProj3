import { userService } from "./user.service";

export const sponsorService = {
  async getSponsors(token) {
    return userService.getUsers(token).then(res => {
      res.body = res.body.filter(user => user.type === "sponsor");
      return res;
    });
  },

  async addSponsor(token, payload) {
    return userService.addUser(token, payload);
  },

  async editSponsor(token, payload) {
    return userService.editUser(token, payload);
  },

  async removeSponsor(token, id) {
    return userService.removeUser(token, id);
  }
};

export default sponsorService;
