import { CommonModule } from '@angular/common';
import { AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, Component, inject } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { SwiperContainer, register } from 'swiper/element/bundle';

register();



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {

  private firebaseConfig = {
    apiKey: "AIzaSyCIU-Lz1zHXynNUjtWXFIq1m9_kcpjanrE",
    authDomain: "fatias-de-amor.firebaseapp.com",
    projectId: "fatias-de-amor",
    storageBucket: "fatias-de-amor.appspot.com",
    messagingSenderId: "44058490489",
    appId: "1:44058490489:web:87593323e08bfe8b1b06a8",
    measurementId: "G-GFJMD08LXE"
  };

  private _formBuilder = inject(FormBuilder);

  formGroup = this._formBuilder.group({
    casca: new FormControl<any>(''),
    recheio: new FormControl<any>(''),
    adicionais: this._formBuilder.array([]),
    total: [0]
  });

  public cascas = [
    { tipo: "Ao Leite", valor: 45, adicional: 0, imagem: "casca-ao-leite.png", selected: false },
    { tipo: "Meio Amargo", valor: 45, adicional: 0, imagem: "casca-meio-amargo.png", selected: false },
    { tipo: "Chocolate Branco", valor: 45, adicional: 0, imagem: "casca-branco.png", selected: false },
    { tipo: "Brownie", valor: 45, adicional: 5, imagem: "casca-brownie.png", selected: false }
  ]

  public recheios = [
    { tipo: "Beijinho", valor: 0, adicional: 0, imagem: "beijinho.jpeg", selected: false },
    { tipo: "Brigadeiro", valor: 0, adicional: 0, imagem: "brigadeiro.jpeg", selected: false },
    { tipo: "Ninho", valor: 0, adicional: 0, imagem: "ninho.jpeg", selected: false },
    { tipo: "Doce de leite", valor: 0, adicional: 0, imagem: "doce-de-leite.jpeg", selected: false },
    { tipo: "Paçoca", valor: 0, adicional: 0, imagem: "pacoca.jpeg", selected: false },
    { tipo: "Maracujá", valor: 0, adicional: 0, imagem: "maracuja.jpeg", selected: false },
    { tipo: "Ninho com Nutela", valor: 0, adicional: 5, imagem: "ninho-nutela.jpeg", selected: false },
    { tipo: "Ninho com Morango", valor: 0, adicional: 5, imagem: "morango-ninho.jpeg", selected: false },
    { tipo: "Pedaços de Brownie com Morango", valor: 0, adicional: 5, imagem: "brownie-morango.jpeg", selected: false },
    { tipo: "KitKat com Brigadeiro", valor: 0, adicional: 5, imagem: "kitkat.jpeg", selected: false },
  ]

  public adicionaisItems = [
    { tipo: "Ferreiro Rocher", valor: 10, adicional: 0, imagem: "ferrero.jpeg", selected: false },
    { tipo: "Kinder Bueno", valor: 10, adicional: 0, imagem: "kinder-bueno.jpeg", selected: false },
    { tipo: "Fini", valor: 5, adicional: 0, imagem: "fini.jpeg", selected: false },
    { tipo: "KitKat", valor: 5, adicional: 0, imagem: "kitkat-adicional.jpeg", selected: false },
  ]

  selectedOptions: number[] = [];
  swiperEl!: SwiperContainer;

  get adicionais() {
    return this.formGroup.controls["adicionais"] as FormArray
  }

  constructor() {
    this.formGroup.valueChanges.subscribe((value) => {
      value.total = value.casca.valor + value.casca.adicional;
      value.total += value.recheio.valor + value.recheio.adicional;
      value.adicionais?.forEach((adicional: any) => {
        value.total += adicional.valor + adicional.adicional;
      });
    });
    const app = initializeApp(this.firebaseConfig);
    const analytics = getAnalytics(app);
  }


  ngAfterViewInit(): void {
    this.swiperEl = document.querySelector('swiper-container') as SwiperContainer;
    this.swiperEl.swiper.on('slideChange', () => {
      document.getElementById('containerDiv')?.scrollIntoView();
    });
  }

  addAdicional(id: number) {
    this.adicionais.clear();
    if (!this.selectedOptions.includes(id)) {
      this.selectedOptions.push(id);
    } else {
      const index = this.selectedOptions.indexOf(id);
      this.selectedOptions.splice(index, 1);
    }
    this.selectedOptions.forEach((id) => {
      this.adicionais.push(this._formBuilder.control(this.adicionaisItems[id]));
    });
  }

  enviarPedido() {
    const chocolateOrder = this.formGroup.value;
    if (chocolateOrder.total != null && chocolateOrder.total > 0) {
      const recheio = `*${chocolateOrder.recheio?.tipo}*`;
      const casca = `*${chocolateOrder.casca?.tipo}*`;
      const adicionais = chocolateOrder.adicionais?.map((adicional: any) => `*${adicional.tipo}*`).join(' e ');
      const total = `*R$${chocolateOrder.total?.toFixed(2)}*`;
      const orderString = `Olá, meu nome é *${this.nome}* Eu gostaria de um Casca ${casca} com recheio de ${recheio} e adicionais ${adicionais}, Total de ${total}`;
      const url = `https://wa.me//5521981978344?text=${encodeURIComponent(orderString)}`;
      window.open(url, "_blank");
    }
  }

  next() {
    this.swiperEl.swiper.slideNext();
  }

  selectedCasca!: any;
  selectedRecheio!: any;
  nome = '';

  selectCasca(casca: any) {
    this.cascas.forEach((c: any) => { c.selected = false });
    casca.selected = !casca.selected;
    this.formGroup.controls["casca"].setValue(casca);
    this.selectedCasca = casca;
  }
  selectRecheio(recheio: any) {
    this.recheios.forEach((r: any) => { r.selected = false });
    recheio.selected = !recheio.selected;
    this.formGroup.controls["recheio"].setValue(recheio);
    this.selectedRecheio = recheio;
  }

}
