import BaseRepository from "./base.repository";

class StatusRepository extends BaseRepository {
  static apiRoute = "/status";

  constructor() {
    super();
  }

  static async health() {
    const url = `${this.apiRoute}/health`;
    const { data } = await this.request(url, "get");
    return data;
  }
}

export default StatusRepository;
