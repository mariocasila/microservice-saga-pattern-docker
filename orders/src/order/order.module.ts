import { Module } from '@nestjs/common';
import { OrderStore } from './stores/order.store';
import { SagaStore } from './stores/saga.store';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderCommandHandlers } from './commands/handlers';
import { OrderController } from './controllers/order.controller';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JWTConfig } from 'src/configs/jwt.config';
import { OrderService } from './services/order.service';
import { OrderSaga } from './sagas/order.saga';
import { Saga } from './entities/saga.entity';
import { OrderQueryHandlers } from './queries/handlers';
import { ProducerService } from './services/amqp/producer.service';
import { ConsumerService } from './services/amqp/consumer.service';
import { CacheModule } from '@nestjs/cache-manager';
import { StateService } from './services/state.service';

@Module({
  controllers: [OrderController],
  imports: [
    CqrsModule,
    AuthModule,
    JwtModule.registerAsync({
      useFactory: (jwtConfig: JWTConfig) => ({
        secret: jwtConfig.secret,
      }),
      inject: [JWTConfig],
    }),
    TypeOrmModule.forFeature([Order, Saga]),
    CacheModule.register({ ttl: 0 }),
  ],
  providers: [
    SagaStore,
    OrderStore,
    ...OrderCommandHandlers,
    OrderService,
    OrderSaga,
    ...OrderQueryHandlers,
    ProducerService,
    ConsumerService,
    StateService,
  ],
})
export class OrderModule {}
