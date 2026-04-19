import { Employer } from "./Employer";
import { User } from "./User/Detailed";

export type ReduxUser = {
  user: {
    site?: User;
    employer?: Employer;
  };
};
