const asyncMiddleware = (fn: any) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncMiddleware;
