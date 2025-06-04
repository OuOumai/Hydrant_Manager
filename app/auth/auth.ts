interface User {
  name: string;
  role: string;
  email: string;
}

const users: { [key: string]: User } = {
  "Mohammed Salim": { name: "Mohammed Salim", role: "technician", email: "mohammed.salim@example.com" },
  "Ali Alawi": { name: "Ali Alawi", role: "municipal", email: "ali.alawi@example.com" },
  "Ahmed Benali": { name: "Ahmed Benali", role: "firefighter", email: "ahmed.benali@example.com" },
  "Omar Alami": { name: "Omar Alami", role: "technician", email: "omar.alami@example.com" },
  "Laila Bennani": { name: "Laila Bennani", role: "municipal", email: "laila.bennani@example.com" },
  "Youssef Tazi": { name: "Youssef Tazi", role: "firefighter", email: "youssef.tazi@example.com" },
  "Rachid Moussaoui": { name: "Rachid Moussaoui", role: "technician", email: "rachid.moussaoui@example.com" },
  "Aicha Kadiri": { name: "Aicha Kadiri", role: "municipal", email: "aicha.kadiri@example.com" },
  "Hassan Berrada": { name: "Hassan Berrada", role: "firefighter", email: "hassan.berrada@example.com" },
  "Karim Idrissi": { name: "Karim Idrissi", role: "supervisor", email: "karim.idrissi@example.com" },
  "Leila Fassi": { name: "Leila Fassi", role: "technician", email: "leila.fassi@example.com" },
  "Sofia El Amrani": { name: "Sofia El Amrani", role: "municipal", email: "sofia.elamrani@example.com" },
  "Kamal Tazi": { name: "Kamal Tazi", role: "firefighter", email: "kamal.tazi@example.com" },
};

const DEFAULT_PASSWORD = "1234";

export const authenticate = (username: string, password: string): User | null => {
  if (password !== DEFAULT_PASSWORD) {
    return null;
  }

  return users[username] || null;
};

export const getRoleName = (role: string): string => {
  switch (role) {
    case "technician":
      return "Technicien";
    case "municipal":
      return "Gestionnaire Municipal";
    case "firefighter":
      return "Pompier";
    case "supervisor":
      return "Superviseur";
    default:
      return role;
  }
};

export const getAllUsers = (): User[] => {
  return Object.values(users);
};

export const getUserByName = (name: string): User | null => {
  return users[name] || null;
}; 