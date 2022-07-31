import { AppDataSource } from "../data-source";
import { User } from "./User";
import bcrypt from "bcrypt"

class Admin {
    private static instance: Admin;
    public info: User
    constructor() {
        (async (admin: Admin) => {
            const info = await AppDataSource.getRepository(User).findOne({
                where: { username: "admin" }
            })
            if (info) {
                admin.info = info;
            } else {
                const hash = await bcrypt.hash("password", 10);
                const newAdmin = new User();
                newAdmin.name = "Admin";
                newAdmin.username = "admin";
                newAdmin.password = hash;
                newAdmin.is_admin = true;
                newAdmin.ktp_image = "";
                newAdmin.verification_status = "verified";
                await AppDataSource.getRepository(User).save(newAdmin);
                const newInfo = await AppDataSource.getRepository(User).findOne({
                    where: { username: "admin" }
                })
                if(newInfo) {
                    admin.info = newInfo;
                }
            }
        })(this);
    }

    public static getInstance() {
        if (!Admin.instance) {
            Admin.instance = new Admin();
        }
        return Admin.instance.info;
    }

    public static init(){
        if (!Admin.instance) {
            Admin.instance = new Admin();
        }
    }
}

export default Admin;