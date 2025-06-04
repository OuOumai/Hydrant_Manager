interface User {
  name: string;
  role: string;
  email: string;
}

const users: { [key: string]: User } = {
  "Mohammed Salim": { name: "Mohammed Salim", role: "technician", email: "mohammed.salim@technician.hyd.ma" },
  "Ali Alawi": { name: "Ali Alawi", role: "municipal", email: "ali.alawi@municipal.hyd.ma" },
  "Ahmed Benali": { name: "Ahmed Benali", role: "firefighter", email: "ahmed.benali@firefighter.hyd.ma" },
  "Omar Alami": { name: "Omar Alami", role: "technician", email: "omar.alami@technician.hyd.ma" },
  "Laila Bennani": { name: "Laila Bennani", role: "municipal", email: "laila.bennani@municipal.hyd.ma" },
  "Youssef Tazi": { name: "Youssef Tazi", role: "firefighter", email: "youssef.tazi@firefighter.hyd.ma" },
  "Rachid Moussaoui": { name: "Rachid Moussaoui", role: "technician", email: "rachid.moussaoui@technician.hyd.ma" },
  "Aicha Kadiri": { name: "Aicha Kadiri", role: "municipal", email: "aicha.kadiri@municipal.hyd.ma" },
  "Hassan Berrada": { name: "Hassan Berrada", role: "firefighter", email: "hassan.berrada@firefighter.hyd.ma" },
  "Karim Idrissi": { name: "Karim Idrissi", role: "technician", email: "karim.idrissi@technician.hyd.ma" },
  "Leila Fassi": { name: "Leila Fassi", role: "technician", email: "leila.fassi@technician.hyd.ma" },
  "Sofia El Amrani": { name: "Sofia El Amrani", role: "technician", email: "sofia.elamrani@technician.hyd.ma" },
  "Kamal Tazi": { name: "Kamal Tazi", role: "firefighter", email: "kamal.tazi@firefighter.hyd.ma" },
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