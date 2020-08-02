import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-cpu';
import { load, MobileNet } from '@tensorflow-models/mobilenet';

export class MobileNetInference {
  className: string;
  probability: number;
}

@Injectable()
export class ObjectIdentifierService {
  constructor() {}

  /**
   * This function is responsible to load the model
   * @param imageElement The <img> HTML Element from which objects needs to be identified.
   */
  async predictObjects(
    imageElement: HTMLImageElement
  ): Promise<MobileNetInference[]> {
    const model: MobileNet = await load({
      version: 2,
      alpha: 1.0
    });
    const identifiedObjects: MobileNetInference[] = await model.classify(
      imageElement
    );
    return identifiedObjects;
  }
}
