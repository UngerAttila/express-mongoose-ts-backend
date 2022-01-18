import { config } from "dotenv";
import App from "./app";
import AuthenticationController from "./authentication/authentication.controller";
import PostController from "./post/post.controller";
import ReceptController from "./recept/recept.controller";
import ReportController from "./report/report.controller";
import UserController from "./user/user.controller";
import validateEnv from "./utils/validateEnv";

config(); // Read and set variables from .env file.
validateEnv();

const app = new App([new PostController(), new AuthenticationController(), new UserController(), new ReportController(), new ReceptController()]);

app.listen();
