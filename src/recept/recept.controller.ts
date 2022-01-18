import { Router, Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import ReceptNotFoundException from "../exceptions/ReceptNotFoundException";
import IdNotValidException from "../exceptions/IdNotValidException";
import HttpException from "../exceptions/HttpException";
import Controller from "../interfaces/controller.interface";
import RequestWithUser from "../interfaces/requestWithUser.interface";
import authMiddleware from "../middleware/auth.middleware";
import validationMiddleware from "../middleware/validation.middleware";
import CreateReceptDto from "./recept.dto";
import Recept from "./recept.interface";
import receptModel from "./recept.model";

export default class ReceptController implements Controller {
    public path = "/receptek";
    public router = Router();
    private post = receptModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(this.path, authMiddleware, this.getAllReceptek);
        this.router.get(`${this.path}/:id`, authMiddleware, this.getReceptById);
        this.router.get(`${this.path}/:offset/:limit/:order/:sort/:keyword?`, authMiddleware, this.getPaginatedReceptek);
        this.router.patch(`${this.path}/:id`, [authMiddleware, validationMiddleware(CreateReceptDto, true)], this.modifyRecept);
        this.router.delete(`${this.path}/:id`, authMiddleware, this.deleteReceptek);
        this.router.post(this.path, [authMiddleware, validationMiddleware(CreateReceptDto)], this.createRecept);
    }

    private getAllReceptek = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // const posts = await this.post.find().populate("author", "-password");
            const count = await this.post.countDocuments();
            const receptek = await this.post.find();
            res.send({ count: count, receptek: receptek });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getPaginatedReceptek = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const offset = parseInt(req.params.offset);
            const limit = parseInt(req.params.limit);
            const order = req.params.order;
            const sort = parseInt(req.params.sort); // desc: -1  asc: 1
            let receptek = [];
            let count = 0;
            if (req.params.keyword) {
                const regex = new RegExp(req.params.keyword, "i"); // i for case insensitive
                count = await this.post.find({ $or: [{ title: { $regex: regex } }, { content: { $regex: regex } }] }).count();
                receptek = await this.post
                    .find({ $or: [{ ReceptNev: { $regex: regex } }, { content: { $regex: regex } }] })
                    .sort(`${sort == -1 ? "-" : ""}${order}`)
                    .skip(offset)
                    .limit(limit);
            } else {
                count = await this.post.countDocuments();
                receptek = await this.post
                    .find({})
                    .sort(`${sort == -1 ? "-" : ""}${order}`)
                    .skip(offset)
                    .limit(limit);
            }
            res.send({ count: count, receptek: receptek });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private getReceptById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (Types.ObjectId.isValid(id)) {
                const recept = await this.post.findById(id).populate("author", "-password");
                if (recept) {
                    res.send(recept);
                } else {
                    next(new ReceptNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private modifyRecept = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (Types.ObjectId.isValid(id)) {
                const receptData: Recept = req.body;
                const recept = await this.post.findByIdAndUpdate(id, receptData, { new: true });
                if (recept) {
                    res.send(recept);
                } else {
                    next(new ReceptNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private createRecept = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {
            const receptData: Recept = req.body;
            const createdRecept = new this.post({
                ...receptData,
                author: req.user._id,
            });
            const savedRecept = await createdRecept.save();
            await savedRecept.populate("author", "-password");
            res.send(savedRecept);
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private deleteReceptek = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id;
            if (Types.ObjectId.isValid(id)) {
                const successResponse = await this.post.findByIdAndDelete(id);
                if (successResponse) {
                    res.sendStatus(200);
                } else {
                    next(new ReceptNotFoundException(id));
                }
            } else {
                next(new IdNotValidException(id));
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };
}
