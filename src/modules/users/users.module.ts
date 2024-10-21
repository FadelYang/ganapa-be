import { Module } from "@nestjs/common";
import { UsersController } from "src/modules/users/users.controller";
import { UserService } from "src/modules/users/users.services";

@Module({
    imports: [],
    controllers: [UsersController],
    providers: [UserService]
})
export class UsersModule { }