import { createKeyv } from "@keyv/redis";
import { CacheModule } from "@nestjs/cache-manager";
import { Module } from "@nestjs/common";


@Module({
    imports: [CacheModule.registerAsync({
        isGlobal: true,
        useFactory: async () => {
            return {
              stores: [
               
                createKeyv('redis://localhost:6379'),
              ],
            };
          },
    })]
})
export class CoreModule { }