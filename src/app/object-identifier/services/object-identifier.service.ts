import { Injectable } from '@angular/core';
import '@tensorflow/tfjs-backend-cpu';
import { load, MobileNet } from '@tensorflow-models/mobilenet';
import { Observable, from, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

export class MobileNetInference {
  className: string;
  probability: number;
}

@Injectable()
export class ObjectIdentifierService {
  public mobileNetModel: MobileNet;
  constructor() {
    this.mobileNetModel = null;
  }

  /**
   * This function is responsible to load the model
   * @param imageElement The <img> HTML Element from which objects needs to be identified.
   */
  public predictObjects(
    imageElement: HTMLImageElement
  ): Observable<MobileNetInference[]> {
    return this.loadMobileNetModel().pipe(
      map((model: MobileNet) => (this.mobileNetModel = model)), // This should change as it is reassigning every time
      switchMap(
        (model: MobileNet) =>
          this.classifyBasedOnMobileNetModel(model, imageElement)
        // This method should not be passed a model as it is availabel at class level
      )
    );
  }

  private loadMobileNetModel(): Observable<MobileNet> {
    // if (this.mobileNetModel !== null) {
    //   return of(this.mobileNetModel);
    // } else {
    return from(
      load({
        version: 2,
        alpha: 1.0
      })
    );
    // }
  }

  private classifyBasedOnMobileNetModel(
    model: MobileNet,
    imageElement
  ): Observable<MobileNetInference[]> {
    return from(model.classify(imageElement));
  }
}
