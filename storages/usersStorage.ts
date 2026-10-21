import pool from "../db/pool.js";

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  bio?: string;
};

class UsersStorage {
  async addUser(userData: Omit<User, "id">): Promise<User> {
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, age, bio)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, first_name AS "firstName", last_name AS "lastName", email, age, bio`,
      [
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.age ?? null,
        userData.bio ?? null,
      ]
    );

    return result.rows[0];
  }

  async getUsers(): Promise<User[]> {
    const result = await pool.query(
      `SELECT id, first_name AS "firstName", last_name AS "lastName",
              email, age, bio
       FROM users
       ORDER BY id`
    );

    return result.rows;
  }

  async getUser(id: number): Promise<User | undefined> {
    const result = await pool.query(
      `SELECT id, first_name AS "firstName", last_name AS "lastName",
              email, age, bio
       FROM users
       WHERE id = $1`,
      [id]
    );

    return result.rows[0];
  }

  async updateUser(
    id: number,
    userData: Omit<User, "id">
  ): Promise<User | undefined> {
    const result = await pool.query(
      `UPDATE users
       SET first_name = $1,
           last_name = $2,
           email = $3,
           age = $4,
           bio = $5
       WHERE id = $6
       RETURNING id, first_name AS "firstName", last_name AS "lastName",
                 email, age, bio`,
      [
        userData.firstName,
        userData.lastName,
        userData.email,
        userData.age ?? null,
        userData.bio ?? null,
        id,
      ]
    );

    return result.rows[0];
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await pool.query(
      "DELETE FROM users WHERE id = $1",
      [id]
    );

    return (result.rowCount ?? 0) > 0;
  }
}

export default new UsersStorage();
