import { instance } from "features/todolists-list/tasks/api/tasks.api";
import { ResponseType } from "common/types";

export type LoginParamsType = {
  email: string;
  password: string;
  rememberMe: boolean;
  captcha?: string;
};

export const authApi = {
  authMe() {
    return instance.get<
      ResponseType<{
        id: number;
        email: string;
        login: string;
      }>
    >("/auth/me");
  },
  login(data: LoginParamsType) {
    return instance.post<ResponseType<{ userId: number }>>(`auth/login`, data);
  },
  logout() {
    return instance.delete<ResponseType>("auth/login");
  },
};
