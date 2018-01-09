import { Component, forwardRef, EventEmitter, Output, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { ToastController } from "ionic-angular";
import { } from "@angular/core/src/linker/view_utils";

@Component({
  selector: 'tags-input',
  templateUrl: 'tags-input.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TagsInputComponent),
    multi: true
  }],
})
export class TagsInputComponent implements ControlValueAccessor {
  private inputValorTag: string = "";
  private listaTag: Array<string> = [];
  public adicionarHabilitado: boolean = true;

  @Input() quantidadeMaxTags: number;
  @Input() tamanhoMaxTag: number;
  @Input() permitirDuplicados: boolean = false;
  @Input() mensagemValidacaoTamanhoMaxTag: string;
  @Input() mensagemValidacaoItensDuplicados: string;
  @Input() palceholderInput: string;

  @Output() eventTagAdicionada = new EventEmitter();
  @Output() eventTagRemovida = new EventEmitter();

  constructor(private toastCtrl: ToastController) { }

  get value(): Array<string> {
    return this.listaTag
  }

  writeValue(obj: any): void {
    this.listaTag = obj;

    if (obj) {
      this.restricaoQuantidadeMaximaDeItensValida();
    }
  }

  registerOnChange(fn: any): void {
  }
  
  registerOnTouched(fn: any): void {
    // throw new Error("Method not implemented.");
  }

  setDisabledState?(isDisabled: boolean): void {
    // throw new Error("Method not implemented.");
  }

  public bindAdicionarItem(): void {
    if (this.inputValorTag && this.restricaoItensDuplicadosValida(this.inputValorTag) && this.restricaoTamanhoDaPalavraValida(this.inputValorTag)) {
      this.addValue(this.inputValorTag);
      this.inputValorTag = "";
    }
  }

  public bindRemoverItem(index: number): void {
    let valorTagRemovida = this.listaTag[index];

    this.listaTag.splice(index, 1);
    this.eventTagRemovida.emit({ data: valorTagRemovida });
    this.restricaoQuantidadeMaximaDeItensValida();
  }

  private restricaoQuantidadeMaximaDeItensValida() {
    if (this.listaTag.length >= this.quantidadeMaxTags) {
      this.adicionarHabilitado = false;
    } else {
      this.adicionarHabilitado = true;
    }
  }

  private addValue(tagValor: string) {
    this.listaTag.push(tagValor);
    this.eventTagAdicionada.emit({ data: tagValor });
    this.restricaoQuantidadeMaximaDeItensValida();
  }

  private restricaoItensDuplicadosValida(valorTag: string): boolean {
    if (!this.permitirDuplicados) {
      valorTag = valorTag.toUpperCase()

      let itensDuplicadosValidaToast = this.toastCtrl.create({
        message: this.mensagemValidacaoItensDuplicados || 'Uma tag de mesmo nome já foi informada.',
        duration: 3000
      });

      for (let index = 0; index < this.listaTag.length; index++) {
        if (this.listaTag[index].toUpperCase() == valorTag) {
          itensDuplicadosValidaToast.present();
          return false;
        }
      }
    }

    return true;
  }

  private restricaoTamanhoDaPalavraValida(tagValor: string): boolean {
    if (tagValor.length > this.tamanhoMaxTag) {
      let restricaoTamanhoDaPalavraToast = this.toastCtrl.create({
        message: this.mensagemValidacaoTamanhoMaxTag || `Somente são permitidos ${this.tamanhoMaxTag} caracteres.`,
        duration: 3000
      });

      restricaoTamanhoDaPalavraToast.present();
      return false;
    }

    return true
  }
}
