import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { D3Service } from '../d3.service';
import { ForceDirectedGraph } from '../models/force-directed-graph';
import { Node } from '../models/node';

@Directive({
  selector: '[draggableNode]'
})
export class DraggableDirective implements OnInit {
  // tslint:disable-next-line: no-input-rename
  @Input('draggableNode') draggableNode: Node;
  // tslint:disable-next-line: no-input-rename
  @Input('draggableInGraph') draggableInGraph: ForceDirectedGraph;

  constructor(private d3Service: D3Service, private element: ElementRef) {}

  ngOnInit() {
    this.d3Service.applyDraggableBehaviour(
      this.element.nativeElement,
      this.draggableNode,
      this.draggableInGraph
    );
  }
}
