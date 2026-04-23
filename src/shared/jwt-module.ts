import { Global, Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Global()
@Module({
    imports: [],
    providers: [JwtService],
    exports: [JwtService],
})
export class JwtModule {}