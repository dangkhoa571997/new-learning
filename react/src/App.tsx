import '@src/App.css';
import { useEffectOnce } from '@src/libs/react-use';
import { Fragment, useState } from 'react';
import WheelComponent from '@src/components/WheelComponent';
import { Segment } from './types/interfaces';

function App() {
  const [segmentsState, setSegmentsState] = useState<Segment[]>([]);

  useEffectOnce(() => {
    (async () => {
      const segmentsFromAPI: Segment[] = [
        {
          segmentName: 'won 7',
          segmentColor: '#F6CB18',
          segmentImageLink: 'https://picsum.photos/150/150'
        },
        {
          segmentName: 'won 10',
          segmentColor: '#FDF0B9',
          segmentImageLink: 'https://picsum.photos/150/150'
        },
        {
          segmentName: 'better luck',
          segmentColor: '#F6CB18',
          segmentImageLink: 'https://picsum.photos/150/150'
        },
        {
          segmentName: 'won 70',
          segmentColor: '#FDF0B9',
          segmentImageLink: 'https://picsum.photos/150/150'
        },
        {
          segmentName: 'won 1',
          segmentColor: '#F6CB18',
          segmentImageLink: 'https://picsum.photos/150/150'
        },
        {
          segmentName: 'better luck',
          segmentColor: '#FDF0B9',
          segmentImageLink: 'https://picsum.photos/150/150'
        }
      ];
      const proceedSegments = await handleSegmentImage(segmentsFromAPI);
      setSegmentsState(proceedSegments);
    })();
  });

  const handleSegmentImage = async (segments: Segment[]): Promise<Segment[]> => {
    const segmentPromises = (segments || []).map((segment) => {
      return new Promise((resolve) => {
        const segmentImageLink = segment.segmentImageLink;
        if (segmentImageLink) {
          const imageInstance = new Image();
          imageInstance.src = segmentImageLink;
          imageInstance.onload = () => {
            segment.segmentImageSource = imageInstance;
            return resolve(segment);
          };
        } else {
          return resolve(segment);
        }
      });
    });
    const result = (await Promise.all(segmentPromises)) as Segment[];
    return result;
  };
  const onFinished = (winningSegment: Segment) => {
    alert(`${winningSegment.segmentName}`);
  };

  return (
    <Fragment>
      {segmentsState && segmentsState.length > 0 ? (
        <WheelComponent segments={segmentsState} onFinished={(winner) => onFinished(winner)} buttonText="Spin" upDuration={100} downDuration={1000} />
      ) : (
        <div>Loading</div>
      )}
    </Fragment>
  );
}

export default App;
