import React, { useEffect, useState, Profiler } from 'react';
import {
  AutoSizer,
  CellMeasurer,
  CellMeasurerCache,
  List,
  ListRowProps,
  WindowScroller,
} from 'react-virtualized';

interface Photo {
  id: number;
  title: string;
  url: string;
}

const cache = new CellMeasurerCache({
  fixedWidth: true,
});

function App() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/photos')
      .then((res) => res.json())
      .then((data) => setPhotos(data));
  }, []);

  const print = (id: any, phase: any, actualDuration: any) => {
    console.log(id, phase, actualDuration);
  };

  const renderRow = ({ index, style, key, parent }: ListRowProps) => {
    const { title, url } = photos[index];
    return (
      <CellMeasurer style={style} cache={cache} parent={parent} key={key} rowIndex={index}>
        {({ measure, registerChild }) => (
          <div style={style} ref={registerChild}>
            <h1>{title.repeat(3)}</h1>
            <img alt={title} src={url} onLoad={measure} />
          </div>
        )}
      </CellMeasurer>
    );
  };

  return (
    <WindowScroller>
      {({ height, registerChild }) => (
        <AutoSizer disableHeight>
          {({ width }) => (
            <Profiler id='photos' onRender={print}>
              <div ref={registerChild}>
                <List
                  width={width}
                  height={height}
                  rowCount={photos.length}
                  rowHeight={cache.rowHeight}
                  deferredMeasurementCache={cache}
                  rowRenderer={renderRow}
                />
              </div>
            </Profiler>
          )}
        </AutoSizer>
      )}
    </WindowScroller>
  );
}

export default App;
