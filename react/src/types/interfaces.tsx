export interface Segment {
  segmentName: string;
  segmentColor: string;
  segmentImageLink?: string;
  segmentImageSource?: CanvasImageSource;
}

export interface WheelOption {
  hasPin?: boolean;
  pinRadius?: number;
  outerCircleFirst: number;
  outerCircleSecond?: number;
  isOnlyOnce?: boolean;
  textFarFromCenter?: number;
  imageFarFromCenter?: number;
}

export interface WheelParams {
  segments: Segment[];
  winningSegment?: string;
  buttonText?: string;
  radius?: number;
  upDuration?: number;
  downDuration?: number;
  fontFamily?: string;
  width?: number;
  height?: number;
  needleWidth?: number;
  primaryColor?: string;
  contrastColor?: string;
  wheelClassName?: string;
  canvasClassName?: string;
  options?: WheelOption;
  onFinished: (winningSegment: Segment) => void;
}

export interface DrawSegment {
  key: number;
  lastAngle: number;
  angle: number;
}
