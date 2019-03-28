import { Component, OnInit } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material';
import { PlaygroundService } from '../playground.service';

/**
 * Food data with nested structure.
 * Each node has a name and an optiona list of children.
 */
interface FoodNode {
  name: string;
  children?: FoodNode[];
}

const TREE_DATA: FoodNode[] = [
  {
    name: 'Fruit',
    children: [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Fruit loops' }]
  },
  {
    name: 'Vegetables',
    children: [
      {
        name: 'Green',
        children: [{ name: 'Broccoli' }, { name: 'Brussel sprouts' }]
      },
      {
        name: 'Orange',
        children: [{ name: 'Pumpkins' }, { name: 'Carrots' }]
      }
    ]
  }
];
@Component({
  selector: 'app-filter-list',
  templateUrl: './filter-list.component.html',
  styleUrls: ['./filter-list.component.css']
})
export class FilterListComponent implements OnInit {
  isLoading = false;

  treeControl = new NestedTreeControl<FoodNode>(node => node.children);
  dataSource = new MatTreeNestedDataSource<FoodNode>();
  hasChild = (_: number, node: FoodNode) => !!node.children && node.children.length > 0;

  constructor(private playgroundService: PlaygroundService) {
    this.dataSource.data = TREE_DATA;
  }

  ngOnInit() {
    this.isLoading = true;
  }
  onSelect(node) {
    this.playgroundService.setDeviceSelected(node);
  }
  // flattenDeep(arr1) {
  //   return arr1.reduce(function iter(r, a) {
  //     if (a === null) {
  //       return r;
  //     }
  //     if (Array.isArray(a)) {
  //       return a.reduce(iter, r);
  //     }
  //     if (typeof a === 'object') {
  //       return Object.keys(a)
  //         .map(k => a[k])
  //         .reduce(iter, r);
  //     }
  //     return r.concat(a);
  //   }, []);
  // }

  // onDrop(event: CdkDragDrop<string[]>) {
  //   console.log(this.boardList);
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     transferArrayItem(
  //       event.previousContainer.data,
  //       event.container.data,
  //       event.previousIndex,
  //       event.currentIndex
  //     );
  //   }
  // }
}
