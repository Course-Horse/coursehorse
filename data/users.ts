import { users } from "@/config/mongoCollections.js";
import { mongo, validator } from "@/data/helpers/index.ts";
import { User, UserUpdate } from "@/types";
const bcrypt = require("bcrypt");

const methods = {
  /**
   * Gets an array of all users
   * @returns {Promise} Promise object that resolves to an array of all users
   */
  async getUsers(): Promise<any> {
    let result = await mongo.getAllDocs(users);
    return result;
  },

  /**
   * Gets a user by username
   * @param {string} username of the user to get
   * @returns {Promise} Promise object that resolves to a user object
   */
  async getUser(username: string): Promise<any> {
    // TODO: validate username
    let user = (await mongo.getDocByParam(
      users,
      "username",
      username,
      "user"
    )) as User;
    delete user.password;
    return user;
  },

  /**
   * Checks if user credientials are valid
   * @param {string} username of the user to authenticate
   * @param {string} password of the user to authenticate
   * @returns {Promise} Promise object that resolves to a user object
   */
  async authUser(username: string, password: string): Promise<any> {
    // validate username
    username = validator.checkUsername(username, "username");

    // validate password
    password = validator.checkPassword(password, "password");

    // retrieve specified user and check for matching passwords
    let user = (await mongo.getDocByParam(
      users,
      "username",
      username,
      "user"
    )) as User;
    let comparison = await bcrypt.compare(password, user.password);
    if (!comparison) throw "invalid password";

    delete user.password;
    return user;
  },

  /**
   * Creates a new user in the database
   * @param {string} username of the user to create
   * @param {string} password of the user to create
   * @param {string} email of the user to create
   * @param {string} firstName of the user to create
   * @param {string} lastName of the user to create
   * @returns {Promise} Promise object that resolves to a user object
   */
  async createUser(
    username: string,
    password: string,
    email: string,
    firstName: string,
    lastName: string
  ): Promise<any> {
    // validate username and check if username already exists
    username = validator.checkUsername(username, "username");
    let usernameTaken = false;
    try {
      await mongo.getDocByParam(users, "username", username, "user");
      usernameTaken = true;
    } catch (e) {}
    if (usernameTaken) {
      throw "username taken";
    }

    // validate password
    password = validator.checkPassword(password, "password");

    // validate email
    email = validator.checkEmail(email, "email");

    // validate first name
    firstName = validator.checkName(firstName, "first name");

    // validate last name
    lastName = validator.checkName(lastName, "last name");

    // encrypt password with specified salt rounds
    const saltRounds = 16;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // create user object
    let user = {
      username: username,
      password: hashedPassword,
      email: email,
      firstName: firstName,
      lastName: lastName,
      profilePicture: "/default_profile.jpeg",
      bio: "",
      created: new Date(),
      admin: false,
      enrolledCourses: [],
      application: null,
    };

    // add user object to database using mongo helper functions
    let result = (await mongo.createDoc(users, user, "user")) as User;
    delete result.password;
    return result;
  },

  /**
   * Updates a user
   * @param {string} username of the user to update
   * @param {object} fields Object whos fields correspond to the fields to update
   * @returns {Promise} Promise object that resolves to a user object
   */
  async updateUser(username: string, fields: UserUpdate): Promise<any> {
    // retrive user from database
    let new_user = (await mongo.getDocByParam(
      users,
      "username",
      username,
      "user"
    )) as User;

    // validate email
    if (fields.hasOwnProperty("email")) {
      new_user.email = validator.checkEmail(fields.email);
    }

    // validate first name
    if (fields.hasOwnProperty("firstName")) {
      new_user.firstName = validator.checkName(fields.firstName);
    }

    // validate last name
    if (fields.hasOwnProperty("lastName")) {
      new_user.lastName = validator.checkName(fields.lastName);
    }

    // validate bio
    if (fields.hasOwnProperty("bio")) {
      new_user.bio = validator.checkString(fields.bio);
    }

    // validate password and encrypt with specified salt rounds
    if (fields.hasOwnProperty("password")) {
      let password = validator.checkPassword(fields.password, "password");
      const saltRounds = 16;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      new_user.password = hashedPassword;
    }

    // update user in database using mongo helper functions
    let result = (await mongo.replaceDocById(
      users,
      new_user._id.toString(),
      new_user,
      "user"
    )) as User;
    return result;
  },

  /**
   * Sets a user's profile picture
   * @param {string} username of the user to set the picture for
   * @param {string} picture byte data of the picture
   * @returns {Promise} Promise object that resolves to a user object
   */
  async setProfilePicture(username: string, picture: string): Promise<any> {
    return "IMPLEMENT ME";
  },

  /**
   * Deletes a user
   * @param {string} username of the user to delete
   * @returns {Promise} Promise object that resolves to a user object
   */
  async deleteUser(username: string): Promise<any> {
    return "IMPLEMENT ME";
  },

  /**
   * Gets an array of applications
   * @param {string} usernameQuery string to filter the username by
   * @param {string} sortBy field to sort by, one of: created, username
   * @param {boolean} sortOrder true for ascending, false for descending
   * @param {[string]} statusFilter array of statuses to filter by
   * @returns {Promise} Promise object that resolves to an array of all applications
   */
  async getApplications(
    usernameQuery: string,
    sortBy: string,
    sortOrder: boolean,
    statusFilter: [string]
  ): Promise<any> {
    return "IMPLEMENT ME";
  },

  /**
   * Creates a new application for a user
   * @param {string} username of the user to create an application for
   * @param {string} content of the application
   * @param {[string]} documents array of document links
   * @returns {Promise} Promise object that resolves to a user object
   */
  async createApplication(
    username: string,
    content: string,
    documents: [string]
  ): Promise<any> {
    return "IMPLEMENT ME";
  },

  /**
   * Sets the status of a user's application
   * @param username of the user to set the application status for
   * @param status to set the application to (pending, accepted, rejected)
   * @returns {Promise} Promise object that resolves to a user object
   */
  async setApplicationStatus(username: string, status: string): Promise<any> {
    return "IMPLEMENT ME";
  },
};

export default methods;
