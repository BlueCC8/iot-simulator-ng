import { Component, OnInit, OnDestroy } from '@angular/core';
import { RoomPolygonConfigModel } from 'src/app/core/models/room-polygon-config.model';
import { PolygonModel } from 'src/app/core/models/polygon.model';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { EthernetsService } from 'src/app/core/services/ethernet.service';
import { mimeType } from 'src/app/core/obsolete/ethernet-create/mime-type.validator';
import { DotModel } from 'src/app/core/models/dot.model';
import { PolygonsService } from 'src/app/core/services/polygon.service';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-polygon-create',
  templateUrl: './polygon-create.component.html',
  styleUrls: ['./polygon-create.component.css']
})
export class PolygonCreateComponent implements OnInit, OnDestroy {
  componentName = PolygonCreateComponent.name;
  keyX = '';
  keyY = '';
  polygon: PolygonModel;
  defaultX = 0;
  defaultY = 0;
  dots: DotModel[] = [];
  form: FormGroup;
  isLoading = false;
  private mode = 'create';
  private polId: string;
  private authListenerSubs$ = new Subscription();

  constructor(
    public polygonsService: PolygonsService,
    private authService: AuthService,
    public route: ActivatedRoute,
    private logger: NGXLogger,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
    this.authListenerSubs$ = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });

    this.form = this.formBuilder.group({
      polName: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      polDots: this.formBuilder.array([])
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.logger.log(this.componentName, 'Editing mode');

      if (paramMap.has('polygonId')) {
        this.mode = 'edit';
        this.polId = paramMap.get('polygonId');
        this.isLoading = true;
        // * Get instance
        this.polygonsService.getPolygon(this.polId).subscribe(polygonData => {
          this.isLoading = false;
          this.logger.log(this.componentName, polygonData);

          if (polygonData.polDots.length > 0) {
            this.dots = polygonData.polDots;
          }
          this.polygon = {
            id: polygonData.id,
            polName: polygonData.polName,
            polDots: this.dots,
            username: polygonData.username
          };

          this.dots.forEach((dot, index) => {
            this.addControl(dot.dotX, dot.dotY, index);
          });

          // * Patch values
          this.form.patchValue({
            polName: polygonData.polName
          });
          this.logger.log(this.componentName, 'dots', this.polDots);
        });
      } else {
        this.mode = 'create';
        this.polId = null;
        const dot: DotModel = {
          id: '',
          dotX: 0,
          dotY: 0
        };
        this.dots.push(dot);
        this.addControl(dot.dotX, dot.dotY, 0);
      }
    });
  }

  get polDots() {
    return this.form.get('polDots') as FormArray;
  }
  addItem(ev: Event, valueX: number, valueY: number, index: number) {
    ev.preventDefault();

    this.logger.log(this.componentName, 'Add item index', index);
    const dot: DotModel = {
      id: '',
      dotX: valueX,
      dotY: valueY
    };
    this.dots.splice(index, 0, dot);
    this.logger.log(this.componentName, 'After add dots', this.dots);
    this.addControl(valueX, valueY, index);
    this.logger.log(this.componentName, 'Form', this.form);
  }
  private addControl(valueX: number, valueY: number, index: number) {
    this.keyX = `dotX`;
    this.keyY = `dotY`;
    this.polDots.insert(
      index,
      this.formBuilder.group({
        [this.keyX]: new FormControl(valueX, {
          validators: [Validators.required, Validators.min(0)]
        }),
        [this.keyY]: new FormControl(valueY, {
          validators: [Validators.required, Validators.min(0)]
        })
      })
    );
  }

  removeItem(ev: Event, indexDot) {
    ev.preventDefault();

    this.dots = this.dots.filter((el, index) => index !== indexDot);
    this.logger.log(this.componentName, 'After delete dots', this.dots);
    this.polDots.removeAt(indexDot);
    this.logger.log(this.componentName, 'Form', this.form);
  }
  onSavePolygon() {
    if (this.form.invalid) {
      return;
    }
    const polygon: PolygonModel = {
      id: null,
      polName: this.form.value.polName,
      polDots: this.form.value.polDots,
      username: this.authService.getUsername()
    };
    this.logger.log(this.componentName, 'Result poldots', polygon.polDots);
    this.isLoading = true;

    if (this.mode === 'create') {
      this.polygonsService.addPolygon(polygon);
    } else {
      polygon.id = this.polId;
      this.polygonsService.updatePolygon(polygon);
      this.logger.log(this.componentName, 'Succes edit');
    }
    this.form.reset();
  }
  ngOnDestroy() {
    this.authListenerSubs$.unsubscribe();
  }
}
