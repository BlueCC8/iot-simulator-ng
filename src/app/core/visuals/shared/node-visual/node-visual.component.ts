import { Component, Input } from '@angular/core';
import { Node } from '../../../d3/models/node';

@Component({
  selector: '[nodeVisual]',
  templateUrl: './node-visual.component.html',
  styleUrls: ['./node-visual.component.css']
})
export class NodeVisualComponent {
  imgUrl = 'http://icons.iconarchive.com/icons/graphicloads/100-flat/256/home-icon.png';
  // tslint:disable-next-line: no-input-rename
  @Input('nodeVisual') node: Node;
}
