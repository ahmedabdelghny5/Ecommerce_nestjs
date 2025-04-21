import * as qs from 'qs';
import { NextFunction, Request, Response } from 'express';

export const requestQueryParsed = (req: Request, res: Response, next: NextFunction) => {
    const queryString = req.url.split('?')[1] || '';
    req['parsedQuery'] = qs.parse(queryString);
    next();
};
