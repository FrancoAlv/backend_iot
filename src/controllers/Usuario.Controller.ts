import { Controller, Post, Body } from '@nestjs/common';
import { Usuario } from "../core/entities/Usuario";
import { CreateUserDto } from "../core/dto/CreateUserDto";
import { CreateUserUseCase } from "../core/useCases/CreateUserUseCase";
import { UsuarioUidDto } from "../core/dto/UsuarioUidDto";


@Controller('usuario')
export class UsuarioController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post('crear')
  async create(@Body() createUserDto: CreateUserDto): Promise<Usuario> {
    return await this.createUserUseCase.execute(createUserDto);
  }

  @Post('find')
  async findUserbyemailanduid(@Body() createUserDto: UsuarioUidDto): Promise<Usuario> {
    return await this.createUserUseCase.findUserbycorreoandUI(createUserDto);
  }


}