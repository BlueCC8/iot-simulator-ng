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
            polDots: this.dots
          };

          this.dots.forEach((dot, index) => {
            this.addControl(dot.dotX, dot.dotY);
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
      }
    });
  }

  get polDots() {
    return this.form.get('polDots') as FormArray;
  }
  addItem(valueX, valueY, index) {
    const dot: DotModel = {
      id: '',
      dotX: valueX,
      dotY: valueY
    };
    this.dots.push(dot);
    this.addControl(valueX, valueY);
  }
  private addControl(valueX: number, valueY: number) {
    this.keyX = `dotX`;
    this.keyY = `dotY`;
    this.polDots.push(
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

  removeItem(indexDot) {
    this.dots = this.dots.filter(el => el.id !== indexDot);
    this.polDots.removeAt(indexDot);
  }

  // onImagePicked(event: Event) {
  //   const file = (event.target as HTMLInputElement).files[0];
  //   this.form.patchValue({ image: file });
  //   // * Revalidate field
  //   this.form.get('image').updateValueAndValidity();
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.imagePreview = reader.result as string;
  //   };

  //   reader.readAsDataURL(file);
  // }
  // TODO: Implement save
  onSavePolygon() {
    if (this.form.invalid) {
      return;
    }
    // const ether: PolygonModel = {
    //   id: null,
    //   etherName: this.form.value.title,
    //   etherStandard: this.form.value.standard,
    //   etherDataRate: this.form.value.throughput,
    //   imagePath: this.form.value.image,
    //   username: null
    // };

    // this.isLoading = true;
    // if (this.mode === 'create') {
    //   this.ethernetsService.addEthernet(ether);
    // } else {
    //   ether.id = this.polId;
    //   this.ethernetsService.updateEthernet(ether);
    // }
    this.form.reset();
  }
  ngOnDestroy() {
    this.authListenerSubs$.unsubscribe();
  }
}
