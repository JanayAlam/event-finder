import BaseRepository from "./base.repository";

class CRUDRepository<
  CreateInputType,
  UpdateInputType,
  CreateResponseType,
  GetAllResponseType,
  GetResponseType,
  UpdateResponseType,
  DeleteResponseType
> extends BaseRepository {
  static apiRoute: string;

  constructor(apiRoute: string) {
    super();
    CRUDRepository.apiRoute = apiRoute;
  }

  public async getAll(
    query?: Record<string, any>
  ): Promise<GetAllResponseType> {
    const data = await CRUDRepository.request<undefined, GetAllResponseType>(
      CRUDRepository.apiRoute,
      "get",
      undefined,
      { params: query }
    );
    return data;
  }

  public async get(
    id: string,
    query?: Record<string, any>
  ): Promise<GetResponseType> {
    const data = await CRUDRepository.request<undefined, GetResponseType>(
      `${CRUDRepository.apiRoute}/${id}`,
      "get",
      undefined,
      { params: query }
    );
    return data;
  }
}

export default CRUDRepository;
