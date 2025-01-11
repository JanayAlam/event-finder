class ApiError extends Error {
  status: number;
  data: any;

  constructor(
    statusCode: number,
    message = "Something went wrong",
    data?: Object
  ) {
    super(message);

    this.status = statusCode;
    this.message = message;
    this.data = data;
  }
}

export default ApiError;
