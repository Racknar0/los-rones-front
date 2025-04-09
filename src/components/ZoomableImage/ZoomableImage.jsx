import React from 'react';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

const ZoomableImage = ({ src, alt, thumbnailWidth = 50, thumbnailHeight = 50 }) => {
  return (
    <Zoom>
      <img
        src={src}
        alt={alt}
        width={thumbnailWidth}
        height={thumbnailHeight}
        style={{ cursor: 'pointer' }}
      />
    </Zoom>
  );
};

export default ZoomableImage;