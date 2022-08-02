import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { AppDataSource } from "../data-source";
import { User } from "../models/User";
import { CONST } from "../constants/constant";
import jwt from "jsonwebtoken";

interface JwtPayload {
    _id: string
}

class AuthController {
    private userRepository;

    constructor() {

        this.userRepository = AppDataSource.getRepository(User)
    }

    register = async (req: Request, res: Response): Promise<Response> => {
        try {
            let { name, username, password, ktp } = req.body;
            const user = await this.userRepository.findOne({ where: { username } });
            if (user) {
                return res.status(404).json({
                    username: "Username already exists" 
                });
            }

            const hash = await bcrypt.hash(password, 10);
            const newUser = new User();
            newUser.name = name;
            newUser.username = username;
            newUser.password = hash;
            newUser.ktp_image = ktp;
            newUser.is_admin = false;

            await this.userRepository.save(newUser);

            return res.send({ message: "Registration Success" });
        } catch (err) {
            return res.status(500).send({ message: "Internal Server Error" , err})
        }
    }

    login = async (req: Request, res: Response): Promise<Response> => {
        try {
            let { username, password } = req.body;
            const user = await this.userRepository.findOne({ where: { username } });
            if (!user) {
                return res.status(401).json({
                    credential: "Invalid username or password"
                });
            }

            if (!await bcrypt.compare(password, user.password)) {
                return res.status(401).json({
                    credential: "Invalid username or password"
                });
            }

            if (user.verification_status !== "verified") {
                return res.status(401).json({
                    credential: "Please wait until your account is verified"
                });
            }


            const token = jwt.sign({ _id: user.id }, CONST.JWT_SECRET_KEY || "secret")

            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 // 1 day
            })

            return res.send({ message: "Login Success" });
        } catch (err) {
            return res.status(500).send({ message: "Internal Server Error" })
        }
    }

    profile = async (req: Request, res: Response): Promise<Response> => {
        try {
            const cookie = req.cookies['jwt'];
            const { _id } = jwt.verify(cookie, CONST.JWT_SECRET_KEY || "secret") as JwtPayload;

            if (!_id) {
                return res.status(401).json({
                    message: "Unauthorized"
                });
            }
            try {
                const user = await this.userRepository.findOne({ 
                    select: { id: true, name: true, username: true, is_admin: true },
                    where: { id: _id } 
                });
                return res.send(user);
            } catch (err) {
                return res.status(500).send({ message: "Internal Server Error" })
            }
        } catch (err) {
            return res.status(401).send({ message: "Unauthorized" });
        }
    }

    logout = (req: Request, res: Response): Response => {
        res.clearCookie('jwt');

        return res.send({ message: "Logout Success" });
    }
}

export default new AuthController();