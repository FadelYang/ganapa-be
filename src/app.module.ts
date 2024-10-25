import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoreModule } from './core/code.module';
import { UsersModule } from './modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './common/auth.guard';
import { ProductCategoryModule } from './modules/productCategories/product-category.module';
import { ProductModule } from './modules/products/products.module';
import { CartModule } from './modules/carts/carts.module';
import { RolesGuard } from './common/roles.guard';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { OrderModule } from './modules/orders/orders.module';

@Module({
  imports: [
    CoreModule,
    UsersModule,
    ProductCategoryModule,
    ProductModule,
    CartModule,
    OrderModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '12h' }
    }),
    ServeStaticModule.forRoot({
        rootPath: join(__dirname, '..', 'uploads'), // Path to your upload folder
        serveRoot: '/uploads', // URL path for accessing images
      },
    ),
  ],

  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ],

})
export class AppModule { }
