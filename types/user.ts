export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "CUSTOMER" | "ADMIN";
  status?: "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
}
