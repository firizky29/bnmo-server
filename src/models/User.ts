import { Entity, PrimaryGeneratedColumn, Column, OneToMany, AfterInsert } from "typeorm"
import { Transaction } from "./Transaction"

@Entity()
export class User {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column( { nullable: false } )
    name: string

    @Column({ nullable: false, unique: true })
    username: string

    @Column({ nullable: false })
    password: string

    @Column({ default: false })
    is_admin: boolean

    @Column("longtext", { nullable: false })
    ktp_image: string

    @Column({
        nullable: false,
        type: "enum",
        enum: ["verified", "pending", "rejected"],
        default: "pending"
    })
    verification_status: string

    @Column({ nullable: false, type: "float", default: 0.0 })
    balance: number

    @OneToMany(() => Transaction, (transaction) => transaction.creditor, { cascade: true })
    credit: Transaction[]

    @OneToMany(() => Transaction, (transaction) => transaction.debitor, { cascade: true })
    debit: Transaction[]

}
