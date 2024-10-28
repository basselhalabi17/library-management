class HttpException extends Error {
    public status: number;
    public messsage: any;
    public errors: any;
    constructor(status: number, message = '', errors: any = []) {
      super(message);
      this.status = status;
      this.message = message;
      this.errors = errors;
    }
  }
  
  export default HttpException;