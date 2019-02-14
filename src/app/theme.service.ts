import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor() {
  }

  getThemes() {
    return [
      'Advento',
      'Amor fraternal',
      'Ano Novo',
      'Apelo',
      'Arrependimento',
      'Ascensão',
      'Batismo',
      'Casamento',
      'Confiança',
      'Consagração',
      'Consolação',
      'Conversão',
      'Culto e Adoração',
      'Dedicação de Templo',
      'Despedida',
      'Entrada Triunfal',
      'Epifania',
      'Escola Dominical',
      'Esperança',
      'Evangelização',
      'Família',
      'Fim do Culto',
      'Louvor',
      'Natal',
      'Oração',
      'Oração Vespertina',
      'Palavra de Deus',
      'Pentecostes',
      'Perdão',
      'Perseverança',
      'Pátria',
      'Reforma',
      'Regozijo',
      'Reino de Deus',
      'Ressurreição',
      'Santa Ceia',
      'Santificação',
      'Segunda Vinda',
      'Serviços Fúnebres',
      'Trindade',
      'Vocação Pastoral',
    ];
  }
}
