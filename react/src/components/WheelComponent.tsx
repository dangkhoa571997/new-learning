import { useEffectOnce } from '@src/libs/react-use';
import { DrawSegment, Segment, WheelParams } from '@src/types/interfaces';
import { useState } from 'react';

function WheelComponent({
  segments,
  winningSegment,
  width = 500,
  height = 600,
  radius = 230,
  upDuration = 100,
  downDuration = 1000,
  wheelClassName = 'wheel',
  canvasClassName = 'canvas',
  primaryColor = 'black',
  contrastColor = 'white',
  fontFamily = 'Roboto, sans-serif',
  buttonText = 'Spin',
  needleWidth = 30,
  options,
  onFinished
}: WheelParams) {
  // variables
  const segmentLength = segments.length;
  const PI = Math.PI;
  const PI2 = PI * 2;
  const centerX = width / 2;
  const centerY = height / 2;
  const upTime = segmentLength * upDuration;
  const downTime = segmentLength * downDuration;
  const timerDelay = segmentLength;
  const outerCircleFirst = options?.outerCircleFirst ?? 5;
  const outerCircleSecond = options?.outerCircleSecond ?? 10;
  const hasPin = options?.hasPin ?? true;
  const pinRadius = options?.pinRadius ?? 4;
  const textFarFromCenter = options?.textFarFromCenter ?? 50;
  const imageFarFromCenter = options?.imageFarFromCenter ?? 50 * 2;
  const isOnlyOnce = options?.isOnlyOnce ?? false;
  let currentSegment: Segment | null = null;
  // let isStarted = false;
  let timerHandle = 0;
  let angleCurrent = 0;
  let angleDelta = 0;
  let canvasContext: CanvasRenderingContext2D | null = null;
  let maxSpeed = 0.1;
  let spinStart = 0;
  let frames = 0;

  // States
  const [isFinished, setFinished] = useState(false);

  // Effects
  useEffectOnce(() => {
    wheelInit();
    setTimeout(() => {
      window.scrollTo(0, 1);
    }, 0);
  });

  // functions
  const wheelInit = () => {
    initCanvas();
    wheelDraw();
  };

  const initCanvas = () => {
    let canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    if (navigator.userAgent.indexOf('MSIE') !== -1) {
      canvas = document.createElement('canvas');
      canvas.setAttribute('width', String(width));
      canvas.setAttribute('height', String(height));
      canvas.setAttribute('id', 'canvas');
      document.getElementsByClassName(wheelClassName)[0].appendChild(canvas);
    }
    if (canvas) {
      canvas.addEventListener('click', spin, false);
      canvasContext = canvas.getContext('2d');
    }
  };

  const spin = () => {
    // isStarted = true;
    if (timerHandle === 0) {
      spinStart = new Date().getTime();
      timerHandle = setInterval(onTimerTick, timerDelay) as unknown as number;
    }
  };

  const onTimerTick = () => {
    frames++;
    requestAnimationFrame(draw);
    const duration = new Date().getTime() - spinStart;
    let progress = 0;
    let finished = false;
    if (duration < upTime) {
      progress = duration / upTime;
      angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2);
    } else {
      if (winningSegment) {
        if (currentSegment?.segmentName === winningSegment && frames > segmentLength) {
          progress = duration / upTime;
          angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
          progress = 1;
        } else {
          progress = duration / downTime;
          angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
        }
      } else {
        progress = duration / downTime;
        angleDelta = maxSpeed * Math.sin((progress * Math.PI) / 2 + Math.PI / 2);
      }
      if (progress >= 1) finished = true;
    }

    angleCurrent += angleDelta;
    while (angleCurrent >= PI2) angleCurrent -= PI2;
    if (finished && currentSegment) {
      setFinished(true);
      onFinished(currentSegment);
      clearInterval(timerHandle);
      timerHandle = 0;
      angleDelta = 0;
    }
  };

  const wheelDraw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const draw = () => {
    clear();
    drawWheel();
    drawNeedle();
  };

  const drawWheel = () => {
    const ctx = canvasContext;
    if (ctx) {
      let lastAngle = angleCurrent;
      for (let i = 1; i <= segmentLength; i++) {
        const angle = PI2 * (i / segmentLength) + angleCurrent;
        drawSegment({ key: i - 1, lastAngle, angle });
        lastAngle = angle;
      }
      // TODO: Use css instead
      // Draw a center circle
      ctx.beginPath();
      ctx.arc(centerX, centerY, 50, 0, PI2, false);
      ctx.closePath();
      ctx.fillStyle = contrastColor;
      ctx.lineWidth = 10;
      ctx.strokeStyle = '#f65d79';
      ctx.fill();
      ctx.font = 'bold 1.5em ' + fontFamily;
      ctx.fillStyle = primaryColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(buttonText, centerX, centerY);
      ctx.stroke();
    }
  };

  const drawSegment = (segmentParams: DrawSegment) => {
    const { key, lastAngle, angle } = segmentParams;
    const ctx = canvasContext;
    if (ctx) {
      const value = segments[key].segmentName;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, lastAngle, angle, false);
      ctx.lineTo(centerX, centerY);
      ctx.fillStyle = segments[key].segmentColor;
      ctx.fill();
      ctx.closePath();

      // outer circle 1st from center
      if (outerCircleFirst > 0) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, lastAngle, angle, false);
        ctx.lineWidth = outerCircleFirst;
        ctx.strokeStyle = '#9e9e9e';
        ctx.stroke();
        ctx.closePath();
      }

      // outer circle 2nd from center
      const radiusBuffer = outerCircleFirst < 10 ? 0 : 0;
      if (outerCircleSecond) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + outerCircleFirst + radiusBuffer, lastAngle, angle, false);
        ctx.lineWidth = outerCircleSecond;
        ctx.strokeStyle = '#f65d79';
        ctx.stroke();
        ctx.closePath();
      }

      // pin
      if (hasPin && segmentLength > 1) {
        const pinSpacing = PI2 / segmentLength;
        for (let i = 1; i <= segmentLength; i++) {
          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(i * pinSpacing + lastAngle + Math.PI / 2);
          ctx.translate(-centerX, -centerY);
          ctx.beginPath();
          ctx.arc(centerX, centerY - radius - radiusBuffer - outerCircleFirst, pinRadius, 0, PI2);
          ctx.fillStyle = 'pink';
          ctx.fill();
          ctx.restore();
        }
      }

      // write label
      ctx.translate(centerX, centerY);
      ctx.rotate((lastAngle + angle) / 2 + Math.PI / 2);
      ctx.fillStyle = contrastColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 1.5em ' + fontFamily;
      // TODO: Fixed length by word
      ctx.fillText(value.substring(0, 12), 0, -radius + textFarFromCenter);
      const segmentImageSource = segments[key].segmentImageSource;
      if (segmentImageSource) {
        const imageWidth = 50;
        const imageHeight = 50;
        ctx.drawImage(segmentImageSource, -(imageWidth / 2), -radius + imageFarFromCenter, imageWidth, imageHeight);
      }
      ctx.restore();
    }
  };

  const drawNeedle = () => {
    const ctx = canvasContext;
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(centerX + needleWidth / 2, centerY - radius - outerCircleFirst - outerCircleSecond);
      ctx.lineTo(centerX - needleWidth / 2, centerY - radius - outerCircleFirst - outerCircleSecond);
      ctx.lineTo(centerX, centerY - radius - outerCircleFirst - outerCircleSecond + needleWidth);
      ctx.closePath();
      ctx.fillStyle = 'brown';
      ctx.fill();
      const change = angleCurrent + Math.PI / 2;
      let i = segmentLength - Math.floor((change / PI2) * segmentLength) - 1;
      if (i < 0) i = i + segmentLength;
      currentSegment = segments[i];
      // isStarted && ctx.fillText(currentSegment, centerX + 10, centerY + radius + 50);
    }
  };

  const clear = () => {
    const ctx = canvasContext;
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
    }
  };

  return (
    <div className={wheelClassName}>
      <canvas
        id="canvas"
        className={canvasClassName}
        width={width}
        height={height}
        style={{
          pointerEvents: isFinished && isOnlyOnce ? 'none' : 'auto'
        }}
      />
    </div>
  );
}

export default WheelComponent;
