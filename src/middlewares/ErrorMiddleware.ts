import {
    Err,
    IMiddlewareError,
    MiddlewareError,
    Next,
    Request,
    Response
} from "@tsed/common";
import * as Express from "express";
import {Exception} from "ts-httpexceptions";
import {$log} from "ts-log-debug";

@MiddlewareError()
export default class ErrorMiddleware implements IMiddlewareError {
    public use(
        @Err() error: any,
        @Response() response: Express.Response,
        @Next() next: Express.NextFunction
    ): any {
        $log.error("" + error);
        response.status(error.status || 500).send({
            status: error.status || 500,
            message: error.message || "Internal server error"
        });
        return next();
    }
}
