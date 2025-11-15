import BaseRepository from "./base.repository";

class AuthRepository extends BaseRepository {
  static readonly apiRouter = "/auth";

  constructor() {
    super();
  }

  static logout() {
    const url = `${AuthRepository.apiRouter}/logout`;
    return this.request<undefined, { message: string }>(url, "get", undefined);
  }
}

export default AuthRepository;
