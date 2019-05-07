import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm, FormGroup, FormControl, Validators } from '@angular/forms';
import { EthernetsService } from '../../services/ethernet.service';
import { EthernetModel } from '../../models/ethernet.model';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
@Component({
  selector: 'app-ethernet-create',
  templateUrl: './ethernet-create.component.html',
  styleUrls: ['/ethernet-create.component.css']
})
export class EthernetCreateComponent implements OnInit, OnDestroy {
  ether: EthernetModel;
  form: FormGroup;
  isLoading = false;
  imagePreview: string;
  private mode = 'create';
  private etherId: string;
  private authListenerSubs$ = new Subscription();
  constructor(
    public ethernetsService: EthernetsService,
    private authService: AuthService,
    public route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.authListenerSubs$ = this.authService.getAuthStatusListener().subscribe(authStatus => {
      this.isLoading = false;
    });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      standard: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      throughput: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('etherId')) {
        this.mode = 'edit';
        this.etherId = paramMap.get('etherId');
        this.isLoading = true;
        // * Get instance
        this.ethernetsService.getEthernet(this.etherId).subscribe(etherData => {
          this.isLoading = false;
          this.ether = {
            id: etherData._id,
            etherName: etherData.etherName,
            etherStandard: etherData.etherStandard,
            etherDataRate: etherData.etherDataRate,
            imagePath: etherData.imagePath,
            username: etherData.username
          };
          // console.log(etherData.username);
          // console.log(this.ether.imagePath);
          // * Set values
          this.form.setValue({
            title: this.ether.etherName,
            standard: this.ether.etherStandard,
            throughput: this.ether.etherDataRate,
            image: this.ether.imagePath
          });
        });
      } else {
        this.mode = 'create';
        this.etherId = null;
      }
    });
  }
  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    // * Revalidate field
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };

    reader.readAsDataURL(file);
  }
  onSaveEthernet() {
    if (this.form.invalid) {
      return;
    }
    const ether: EthernetModel = {
      id: null,
      etherName: this.form.value.title,
      etherStandard: this.form.value.standard,
      etherDataRate: this.form.value.throughput,
      imagePath: this.form.value.image,
      username: null
    };

    this.isLoading = true;
    if (this.mode === 'create') {
      this.ethernetsService.addEthernet(ether);
    } else {
      ether.id = this.etherId;
      this.ethernetsService.updateEthernet(ether);
    }
    this.form.reset();
  }
  ngOnDestroy() {
    this.authListenerSubs$.unsubscribe();
  }
}
