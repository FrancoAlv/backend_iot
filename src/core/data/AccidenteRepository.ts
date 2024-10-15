import { Usuario } from '../entities/Usuario';
import { OpenAIAnalysisResult } from '../interfaces/OpenAIAnalysisResult';

export abstract class AccidenteRepository {
  abstract save(usuario: Usuario, analysis: OpenAIAnalysisResult): Promise<void>;

  abstract savewithVehiculoCercano(usuario: Usuario, analysis: OpenAIAnalysisResult,url:string,publicid:string): Promise<void>;
}