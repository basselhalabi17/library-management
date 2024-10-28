import HttpException from './http-exception';

class NotFoundException extends HttpException {
  constructor(message: string) {
    super(404, message);
  }
}

export default NotFoundException;