import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from "../src/app.module";
import { CreateUserDto } from "../src/core/dto/CreateUserDto";

describe('UsuarioController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/usuario/crear (POST) - success', async () => {
    const createUserDto: CreateUserDto = {
      nombre: 'John Doe',
      correo: 'john.doe@example.com',
      telefono: '1234567890',
      codigo_equipo_iot: 'ABC123',
    };

    return request(app.getHttpServer())
      .post('/usuario/crear')
      .send(createUserDto)
      .expect(201)
      .then((response) => {
        expect(response.body).toHaveProperty('usuario_id');
        expect(response.body.nombre).toBe(createUserDto.nombre);
        expect(response.body.correo).toBe(createUserDto.correo);
        expect(response.body.telefono).toBe(createUserDto.telefono);
        expect(response.body.codigo_equipo_iot).toBe(createUserDto.codigo_equipo_iot);
      });
  });

  it('/usuario/crear (POST) - conflict', async () => {
    const createUserDto: CreateUserDto = {
      nombre: 'John Doe',
      correo: 'john.doe@example.com',
      telefono: '1234567890',
      codigo_equipo_iot: 'ABC123',
    };

    // First request to create the user
    await request(app.getHttpServer())
      .post('/usuario/crear')
      .send(createUserDto)
      .expect(201);

    // Second request should fail due to conflict
    return request(app.getHttpServer())
      .post('/usuario/crear')
      .send(createUserDto)
      .expect(409)
      .then((response) => {
        expect(response.body.message).toBe('El usuario con este correo ya existe.');
      });
  });
});