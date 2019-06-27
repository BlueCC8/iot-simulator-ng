import { Component, Input, OnInit } from '@angular/core';
import { Link } from 'src/app/core/d3/models/link';

@Component({
  selector: '[linkVisual]',
  templateUrl: 'link-visual.component.html',
  styleUrls: ['./link-visual.component.css']
})
export class LinkVisualComponent {
  // tslint:disable-next-line: no-input-rename
  @Input('linkVisual') link: Link;
}
