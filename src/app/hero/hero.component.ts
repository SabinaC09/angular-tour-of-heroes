import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Hero } from '../hero';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.css']
})
export class HeroComponent {

  @Input() hero: any;
  @Output() delete = new EventEmitter();

  onDeleteClick($event: { stopPropagation: () => void; }): void {
    $event.stopPropagation();
    this.delete.next();
  }
}
