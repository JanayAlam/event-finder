import BaseRepository from "./base-repository";

class CRUDRepository<
  CreateInputType,
  UpdateInputType,
  CreateResponseType,
  GetAllResponseType,
  GetResponseType,
  UpdateResponseType,
  DeleteResponseType
> extends BaseRepository {
  readonly apiRoute: string;

  constructor(apiRoute: string) {
    super();
    this.apiRoute = apiRoute;
  }

  public getApiRoute(): string {
    return this.apiRoute;
  }
}

export default CRUDRepository;
