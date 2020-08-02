import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  ObjectIdentifierService,
  MobileNetInference
} from './services/object-identifier.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-object-identifier',
  templateUrl: './object-identifier.component.html'
})
export class ObjectIdentifierComponent implements OnInit {
  public imageUploadForm: FormGroup;
  public defaultImagePath: string;
  @ViewChild('objectIdentifierImage', { static: true })
  public objectIdentifierImage: ElementRef<HTMLImageElement>;
  public identifiedObjects: MobileNetInference[];
  constructor(
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private objectIdentifierService: ObjectIdentifierService,
    private loaderService: NgxUiLoaderService
  ) {
    this.defaultImagePath =
      'https://via.placeholder.com/500x500?text=Upload+image+to+identify+objects';
    this.imageUploadForm = this.formBuilder.group({
      image: [this.defaultImagePath]
    });
    this.identifiedObjects = [];
  }

  ngOnInit() {}

  public imageChanged(imageUploadEvent: any) {
    const reader = new FileReader();

    if (imageUploadEvent.target.files && imageUploadEvent.target.files.length) {
      const [file] = imageUploadEvent.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imageUploadForm.patchValue({
          image: reader.result
        });
        this.cd.markForCheck();
        this.loaderService.start();
        this.objectIdentifierService
          .predictObjects(this.objectIdentifierImage.nativeElement)
          .then((identifiedObjects: MobileNetInference[]) => {
            this.loaderService.stop();
            this.identifiedObjects = [...identifiedObjects];
          })
          .catch(error => {
            console.log('Error in identifying objects', error);
            this.loaderService.stop();
          });
      };
    }
  }

  public trackIdentfiedObjects(
    index: number,
    identifiedObject: MobileNetInference
  ): number {
    return index;
  }
}
