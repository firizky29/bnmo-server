import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, AfterInsert, AfterUpdate } from "typeorm"
import { User } from "./User"
import { AppDataSource } from "../data-source";

@Entity()
export class Transaction {

    @PrimaryGeneratedColumn("uuid")
    id: string

    @ManyToOne(() => User, (user) => user.credit, { onDelete: "CASCADE" })
    creditor: User

    @ManyToOne(() => User, (user) => user.debit, { onDelete: "CASCADE" })
    debitor: User

    @Column({
        nullable: false,
        type: "enum",
        enum: ["accepted", "pending", "rejected"],
        default: "pending"
    })
    transaction_status: string


    @Column({ nullable: false, type: "float", default: 0.0 })
    amount: number

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @AfterInsert()
    async updateBalance() {
        if (this.transaction_status === "accepted") {
            if (!this.creditor.is_admin) {
                this.creditor.balance -= this.amount
                AppDataSource.getRepository(User).save(this.creditor)
            }
            if (!this.debitor.is_admin) {
                this.debitor.balance += this.amount
                AppDataSource.getRepository(User).save(this.debitor)
            }
        }
    }

    @AfterUpdate()
    async updateBalanceAfterUpdate() {
        if (this.transaction_status === "accepted") {
            if (!this.creditor.is_admin) {
                this.creditor.balance -= this.amount
                AppDataSource.getRepository(User).save(this.creditor)
            }
            if (!this.debitor.is_admin) {
                this.debitor.balance += this.amount
                AppDataSource.getRepository(User).save(this.debitor)
            }
        }
    }
}
