export class WebPhotoFilterType {

  static getFilters():any {
    return {
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
      ],
      BRIGHTNESS: WebPhotoFilterType.brightnessMatrix(1.5),
      CONTRAST: WebPhotoFilterType.contrastMatrix(0.51),
      HUE: WebPhotoFilterType.hueMatrix(90),
      BROWNIE: [
        0.5997023582458496,0.3455324172973633,-0.27082985639572144,0,0.186007559299469,
        -0.0377032496035099,0.8609577417373657,0.1505955308675766,0,-0.14497417211532593,
        0.2411363571882248,-0.07441037893295288,0.4497218132019043,0,-0.029655195772647858,
        0,0,0,1,0
      ],
      VINTAGE: [
        0.6279345750808716,0.32021835446357727,-0.03965408354997635,0,0.037848182022571564,
        0.025783976539969444,0.6441188454627991,0.03259127587080002,0,0.02926599606871605,
        0.04660555720329285,-0.08512330055236816,0.5241647958755493,0,0.020232120528817177,
        0,0,0,1,0
      ],
      KODA: [
        1.1285582780838013,-0.3967382311820984,-0.03992559015750885,0,0.24991995096206665,
        -0.1640433967113495,1.0835251808166504,-0.05498805269598961,0,0.09698984026908875,
        -0.16786010563373566,-0.5603416562080383,1.6014851331710815,0,0.13972482085227966,
        0,0,0,1,0
      ],
      TECHNICOLOR: [
        1.9125277996063232,-0.8545345067977905,-0.09155508130788803,0,0.046249426901340485,
        -0.3087833523750305,1.7658908367156982,-0.10601743310689926,0,-0.27589040994644165,
        -0.23110337555408478,-0.7501899003982544,1.8475978374481201,0,0.12137623876333237,
        0,0,0,1,0
      ],
      POLAROID: [
        1.438,-0.062,-0.062,0,0,
        -0.122,1.378,-0.122,0,0,
        -0.016,-0.016,1.483,0,0,
        0,0,0,1,0
      ],
      BGR: [
        0,0,1,0,0,
        0,1,0,0,0,
        1,0,0,0,0,
        0,0,0,1,0
      ]
    }
  }

  private static brightnessMatrix(brigthness: number): any {
    let b: number = (brigthness || 0) + 1;

    return [
      b, 0, 0, 0, 0,
      0, b, 0, 0, 0,
      0, 0, b, 0, 0,
      0, 0, 0, 1, 0
    ];
  }

  private static contrastMatrix(amount: number): any {
    let v: number = (amount || 0) + 1;
    let o: number = (v-1.25);

    return [
      v, 0, 0, 0, o,
      0, v, 0, 0, o,
      0, 0, v, 0, o,
      0, 0, 0, 1, 0
    ];
  }

  private static hueMatrix(rotation: number): any {
    rotation = (rotation || 0)/180 * Math.PI;

    let cos: number = Math.cos(rotation),
      sin = Math.sin(rotation),
      lumR = 0.213,
      lumG = 0.715,
      lumB = 0.072;

    return [
      lumR+cos*(1-lumR)+sin*(-lumR),lumG+cos*(-lumG)+sin*(-lumG),lumB+cos*(-lumB)+sin*(1-lumB),0,0,
      lumR+cos*(-lumR)+sin*(0.143),lumG+cos*(1-lumG)+sin*(0.140),lumB+cos*(-lumB)+sin*(-0.283),0,0,
      lumR+cos*(-lumR)+sin*(-(1-lumR)),lumG+cos*(-lumG)+sin*(lumG),lumB+cos*(1-lumB)+sin*(lumB),0,0,
      0, 0, 0, 1, 0
    ]
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
