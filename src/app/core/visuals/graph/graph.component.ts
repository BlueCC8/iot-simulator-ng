import {
  Component,
  Input,
  ChangeDetectorRef,
  HostListener,
  ChangeDetectionStrategy,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { ForceDirectedGraph } from '../../d3/models/force-directed-graph';
import { D3Service } from '../../d3/d3.service';
import { Option } from '../../d3/models/option';
@Component({
  selector: 'app-graph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.css']
})
export class GraphComponent implements OnInit, AfterViewInit {
  // tslint:disable-next-line: no-input-rename
  @Input('nodes') nodes;
  // tslint:disable-next-line: no-input-rename
  @Input('links') links;
  @ViewChild('svg') svg: ElementRef;
  graph: ForceDirectedGraph;
  private _options: Option;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.graph.initSimulation(this.options);
  }

  constructor(private d3Service: D3Service, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    /** Receiving an initialized simulated graph from our custom d3 service */
    this.graph = this.d3Service.getForceDirectedGraph(this.nodes, this.links, this.options);

    /** Binding change detection check on each tick
     * This along with an onPush change detection strategy should enforce checking only when relevant!
     * This improves scripting computation duration in a couple of tests I've made, consistently.
     * Also, it makes sense to avoid unnecessary checks when we are dealing only with simulations data binding.
     */
    this.graph.ticker.subscribe(d => {
      this.ref.markForCheck();
    });
  }

  ngAfterViewInit() {
    console.log(this.svg);

    const option: Option = {
      width: this.svg.nativeElement.clientWidth,
      height: this.svg.nativeElement.clientHeight
    };
    console.log(option);
    this.options = option;
    console.log(this.options);
    this.graph.initSimulation(this.options);
  }

  get options(): Option {
    console.log('get');
    return (this._options = {
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  set options(option: Option) {
    console.log('setted');

    this._options = {
      width: option.width,
      height: option.height
    };
    console.log(this._options);
  }
}
