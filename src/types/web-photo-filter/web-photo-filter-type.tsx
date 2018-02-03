export class WebPhotoFilterType {

  static getFilters():any {
    return {
      NO_FILTER: [
        1, 0, 0, 0, 0,
        0, 1, 0, 0, 0,
        0, 0, 1, 0, 0,
        0, 0, 0, 1, 0
      ],
      SEPIA: [
        1.351, 0, 0, 0, 0,
        1.203, 0, 0, 0, 0,
        0.937, 0, 0, 0, 0,
        0, 0, 0, 1, 0
      ],
      BLUE_MONOTONE: [
        0.95, 0, 0, 0, 0.05,
        0.85, 0, 0, 0, 0.15,
        0.50, 0, 0, 0, 0.50,
        0, 0, 0, 1, 0
      ],
      VIOLEN_TOMATO: [
        0.90, 0, 0, 0, 2,
        0.90, 0, 0, 0, -0.20,
        -0.20, 0, 0, 0, -0.5,
        -.2, -.2, -.2, 1, 0
      ],
      GREYSCALE: [
        1, 0, 0, 0, 0,
        1, 0, 0, 0, 0,
        1, 0, 0, 0, 0,
        0, 0, 0, 1, 0
      ]
    }
  }

  static getFilter(key: string): number[] {
    if (!key || 0 === key.length) {
      return null;
    }

    let result: number[] = null;

    Object.keys(WebPhotoFilterType.getFilters()).forEach((filterKey: string) => {
      if (key.toUpperCase() === filterKey) {
        result = WebPhotoFilterType.getFilters()[filterKey];
      }
    });

    return result;
  }
}
