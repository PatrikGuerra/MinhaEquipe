//https://ionicframework.com/docs/api/components/item/Item/
import { Component, Input } from '@angular/core';
import { TarefaSituacao } from "../../app/app.constants";

@Component({
  selector: 'tarefa-status-label',
  templateUrl: 'tarefa-status-label.html'
})
export class TarefaStatusLabelComponent {
  private enumTarefaSituacao = TarefaSituacao;
  private descricao = "";
  private corBadge = ""
  @Input('status') status: number;
  @Input('buttonBlock') block: boolean = false;

  constructor() {
  }

  ngAfterViewInit() {
    this.descricao = TarefaSituacao[this.status];
    
    if (this.status == this.enumTarefaSituacao.Andamento) {      
      this.corBadge = "cortarefaandamento";
    } else if (this.status == this.enumTarefaSituacao.Cancelada) {      
      this.corBadge = "cortarefacancelada";
    } else if (this.status == this.enumTarefaSituacao.Finalizado) {      
      this.corBadge = "cortarefafinalizado";
    } else if (this.status == this.enumTarefaSituacao.Pendente) {      
      this.corBadge = "cortarefapendente";
    }
  }
}
