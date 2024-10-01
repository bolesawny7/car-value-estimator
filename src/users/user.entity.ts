// turn user entity into a plain object
import { Expose } from "class-transformer";
import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterRemove, AfterUpdate } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    email: string

    @Column()
    //when you get an instance of user and turn it into object just exclude the password
    // @Exclude()
    password: string

    @Expose()
    getFullData() {
        return `Name: ${this.email}, id: ${this.id}`
    }

    //hooks
    //hooks only execute if we created a user entity instance with .create() not if used .save() only
    @AfterInsert()
    logInsert() {
        console.log("Inserted User with id", this.id)
    }

    @AfterRemove()
    logRemove() {
        console.log("Removed User with id", this.id)
    }


    @AfterUpdate()
    logUpdate() {
        console.log("Updated User with id", this.id)
    }


    // @Transform(({ obj }) => obj.email.split('@')[0])
    // emailName: string
    // to get user Age
    // @Exclude()
    // @Column()
    // DOB: Date
    // @Expose()
    // getAge() {
    //     return new Date().getFullYear() - this.DOB.getFullYear()
    // }


}