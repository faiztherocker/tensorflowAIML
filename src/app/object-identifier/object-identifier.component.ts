import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  OnDestroy,
  EventEmitter
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  ObjectIdentifierService,
  MobileNetInference
} from './services/object-identifier.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { skip, switchMap, map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-object-identifier',
  templateUrl: './object-identifier.component.html'
})
export class ObjectIdentifierComponent implements OnInit, OnDestroy {
  public imageUploadForm: FormGroup;
  public imagePath: string;
  @ViewChild('objectIdentifierImage', { static: true })
  public objectIdentifierImage: ElementRef<HTMLImageElement>;
  public identifiedObjects: MobileNetInference[];
  public objectIdentifierImageMutationObserver: MutationObserver;
  public objectIdentifierImageMutationEmitter: EventEmitter<any>;
  constructor(
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private objectIdentifierService: ObjectIdentifierService,
    private loaderService: NgxUiLoaderService
  ) {
    this.imagePath =
      'https://via.placeholder.com/500x500?text=Upload+image+to+identify+objects';
    this.imageUploadForm = this.formBuilder.group({
      image: [this.imagePath]
    });
    this.identifiedObjects = [];
    this.objectIdentifierImageMutationEmitter = new EventEmitter();
  }

  ngOnInit() {
    this.initializeMutationObserver();
    this.initializeMutationEventEmitterListener();
  }

  public imageChanged(imageUploadEvent: any) {
    const reader = new FileReader();
    this.identifiedObjects = [];

    if (imageUploadEvent.target.files && imageUploadEvent.target.files.length) {
      const [file] = imageUploadEvent.target.files;
      reader.readAsDataURL(file);

      reader.onload = () => {
        this.imagePath = reader.result as string;
        this.cd.markForCheck();
      };
    }
  }

  public initializeMutationObserver() {
    this.objectIdentifierImageMutationObserver = new MutationObserver(
      (mutations: MutationRecord[]) => {
        mutations.forEach((mutationRecord: MutationRecord) => {
          this.objectIdentifierImageMutationEmitter.emit();
          console.log(mutationRecord);
        });
      }
    );

    this.objectIdentifierImageMutationObserver.observe(
      this.objectIdentifierImage.nativeElement,
      {
        attributes: true
      }
    );
  }

  public initializeMutationEventEmitterListener() {
    this.objectIdentifierImageMutationEmitter
      .pipe(
        skip(1),
        tap(() => this.loaderService.start()),
        tap(() => console.log(this.objectIdentifierImage.nativeElement)),
        switchMap(() =>
          this.objectIdentifierService.predictObjects(
            this.objectIdentifierImage.nativeElement
          )
        )
      )
      .subscribe(
        (mobileNetInference: MobileNetInference[]) => {
          console.log('Inference', mobileNetInference);
          this.identifiedObjects = [...mobileNetInference];
          this.loaderService.stop();
        },
        (error: any) => {
          this.loaderService.stop();
        }
      );
  }

  public trackIdentfiedObjects(
    index: number,
    identifiedObject: MobileNetInference
  ): number {
    return index;
  }

  ngOnDestroy() {
    this.objectIdentifierImageMutationObserver.disconnect();
  }
}
