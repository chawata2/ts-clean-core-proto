import { type User } from "../domains/user";

export type UserRepo = {
  findById: (id: string) => Promise<User | null>;
  findByEmail: (email: string) => Promise<User | null>;
  create: (user: User) => Promise<User>;
};

export const inMemoryUserRepo: UserRepo = (() => {
  const users: User[] = [];

  return {
    findById: async (id: string) => {
      return users.find((user) => user.id === id) || null;
    },
    findByEmail: async (email: string) => {
      return users.find((user) => user.email === email) || null;
    },
    create: async (user: User) => {
      users.push(user);
      return user;
    },
  };
})();
