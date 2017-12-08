import { Component, forwardRef, EventEmitter, Output, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from "@angular/forms";
import { AlertController, ToastController } from "ionic-angular";

@Component({
  selector: 'tags-input',
  templateUrl: 'tags-input.html',

  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TagsInputComponent),
    multi: true
  }],
})
export class TagsInputComponent {
  private inputValorTag: string = "";
  private listaTag: Array<string> = [];
  public adicionarHabilitado: boolean = true;

  @Input() maxTags: number;
  @Input() alertInputPlaceholder: string;
  @Input() alertButtonLabel: string;
  @Input() wordLengthRestrictionMsg: string;
  @Input() duplicatesRestrictionMsg: string;
  @Input() maxWordLength: number;
  @Input() permitirDuplicados: boolean = false;

  constructor(private alertCtrl: AlertController, private toastCtrl: ToastController) { }

  writeValue(value: Array<any>): void {
    this.listaTag = value;

    if (value) {
      this.restricaoQuantidadeMaximaDeItensValida();
    }
  }

  registerOnChange(fn: (_: Array<any>) => void): void {
  }

  registerOnTouched(fn: () => void): void {
  }

  public adicionarItem(): void {
    if (this.inputValorTag && this.restricaoItensDuplicadosValida(this.inputValorTag) && this.restricaoTamanhoDaPalavraValida(this.inputValorTag)) {
      this.addValue(this.inputValorTag);
      this.inputValorTag = "";
    }
  }

  private restricaoQuantidadeMaximaDeItensValida() {
    if (this.listaTag.length >= this.maxTags) {
      this.adicionarHabilitado = false;
    } else {
      this.adicionarHabilitado = true;
    }
  }

  private addValue(tagValor: string) {
    this.listaTag.push(tagValor);
    this.restricaoQuantidadeMaximaDeItensValida();
  }

  private restricaoItensDuplicadosValida(valorTag: string): boolean {
    if (!this.permitirDuplicados) {
      valorTag = valorTag.toUpperCase()

      let itensDuplicadosValidaToast = this.toastCtrl.create({
        message: this.duplicatesRestrictionMsg || 'Uma tag de mesmo nome já foi informada.',
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
    if (tagValor.length > this.maxWordLength) {
      let restricaoTamanhoDaPalavraToast = this.toastCtrl.create({
        message: this.wordLengthRestrictionMsg || `Somente são permitidos ${this.maxWordLength} caracteres.`,
        duration: 3000
      });

      restricaoTamanhoDaPalavraToast.present();
      return false;
    }

    return true
  }

  public removerItem(index: number): void {
    this.listaTag.splice(index, 1);
    this.restricaoQuantidadeMaximaDeItensValida()
  }
}
