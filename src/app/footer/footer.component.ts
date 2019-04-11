import { Component, OnInit, OnDestroy } from '@angular/core';

import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit, OnDestroy {
  private componentName = FooterComponent.name + ' ';

  constructor(private logger: NGXLogger) {}

  ngOnInit() {}

  ngOnDestroy() {}
}
