import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    name: string

    @Column({ unique: true })
    username: string

    @Column()
    password: string

    @Column({ default: false })
    is_admin: boolean

    @Column()
    ktp_image: string

    @Column({
        type: "enum",
        enum: ["verified", "pending", "rejected"],
        default: "pending"
    })
    verification_status: string
}
