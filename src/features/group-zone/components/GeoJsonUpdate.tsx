import { GeoJSON as LeafletGeoJSON } from 'leaflet';
import React, { ReactElement, useEffect, useRef } from 'react';
import { GeoJSON, GeoJSONProps } from 'react-leaflet';

export default function GeoJsonWithUpdates(props: GeoJSONProps): ReactElement {
  const geoJsonLayerRef = useRef<LeafletGeoJSON | null>(null);
  useEffect(() => {
    const layer = geoJsonLayerRef.current;
    if (layer) {
      layer.clearLayers().addData(props.data);
      // clearLayers() seems to remove the `pathOptions`, `style` and `interactive` prop as well
      // Resetting it here
      if (props.pathOptions) {
        layer.setStyle(props.pathOptions);
      } else if (props.style) {
        layer.setStyle(props.style);
      }
    }
  }, [props.data, props.pathOptions, props.style]);

  return <GeoJSON {...props} ref={geoJsonLayerRef} />;
}
