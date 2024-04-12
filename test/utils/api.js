import axios from "axios";
import { expect } from "chai";
import dotenv from "dotenv";
dotenv.config();

class APIUtil {

    constructor(){
        this.token
    }

  async addUser() {
    const data = {
      firstName: "abc",
      lastName: "def",
      email: process.env.email,
      password: process.env.password,
    };

    let config = {
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.post(
        `${process.env.baseUrl}${process.env.addUser}`,
        data,
        config
      );
      expect(response.status).to.equal(201);
    } catch (error) {
      console.log(`Error: ${error.message} - ${error.response.data.message}`);
    }
  }

  async getAuthToken() {
    const data = {
      email: process.env.email,
      password: process.env.password,
    };

    let config = {
      headers: {
        "Content-Type": "application/json",
      },
      data: data,
    };

    try {
      const response = await axios.post(
        `${process.env.baseUrl}${process.env.auth}`,
        data,
        config
      );
      expect(response.status).to.equal(200);
      return response.data.token
    } catch (error) {
      console.log(`Error: ${error.message} - ${error.response.data.message}`);
    }
  }

  async deleteUser(){

    let config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${await this.getAuthToken()}`
        }
      };

    try {
        const response = await axios.delete(
          `${process.env.baseUrl}${process.env.deleteUser}`,
           config
        );
        expect(response.status).to.equal(200);
      } catch (error) {
        console.log(`Error: ${error.message} - ${error.response.data.message}`);
      }

}
}
export default new APIUtil();
