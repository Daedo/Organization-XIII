import { Component, OnInit } from '@angular/core';
import { GeneratorOptions } from '../../../../model/generator-options';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {


  constructor() { }

  ngOnInit(): void {
  }

  get isLoading(): boolean {
    return false;
  }

  get hasOutput(): boolean {
    return false;
  }

  generateNames(options: GeneratorOptions): void {
    console.log(options);
  }

}
