import { languageConfigType } from "@opentripplanner/core-utils/lib/types";
import PropTypes from "prop-types";
import React from "react";
import { FeatureGroup, MapLayer, withLeaflet } from "react-leaflet";

import StopMarker, { stopLayerStopType } from "./stop-marker";

class StopsOverlay extends MapLayer {
  componentDidMount() {
    // set up pan/zoom listener
    this.props.leaflet.map.on("moveend", () => {
      this.refreshStops();
    });
  }

  // TODO: determine why the default MapLayer componentWillUnmount() method throws an error
  componentWillUnmount() {}

  /**
   * this method is used for backporting to React 15
   * v16:  return this.props.leaflet;
   * v15:  return this.context;
   */
  getLeafletContext() {
    return this.props.leaflet;
  }

  refreshStops() {
    const { leaflet, minZoom, refreshStops } = this.props;
    if (leaflet.map.getZoom() < minZoom) {
      this.forceUpdate();
      return;
    }

    const bounds = leaflet.map.getBounds();
    if (!bounds.equals(this.lastBounds)) {
      setTimeout(() => {
        refreshStops({
          minLat: bounds.getSouth(),
          maxLat: bounds.getNorth(),
          minLon: bounds.getWest(),
          maxLon: bounds.getEast()
        });
        this.lastBounds = bounds;
      }, 300);
    }
  }

  createLeafletElement() {}

  updateLeafletElement() {}

  render() {
    const {
      leaflet,
      minZoom,
      setLocation,
      setViewedStop,
      setMainPanelContent,
      stops,
      languageConfig
    } = this.props;

    // Don't render if below zoom threshold or no stops visible
    if (
      !leaflet ||
      !leaflet.map ||
      leaflet.map.getZoom() < minZoom ||
      !stops ||
      stops.length === 0
    ) {
      return <FeatureGroup />;
    }

    // Helper to create StopMarker from stop
    const createStopMarker = stop => (
      <StopMarker
        key={stop.id}
        stop={stop}
        leaflet={leaflet}
        setLocation={setLocation}
        setViewedStop={setViewedStop}
        setMainPanelContent={setMainPanelContent}
        languageConfig={languageConfig}
      />
    );

    // Singleton case; return FeatureGroup with single StopMarker
    if (stops.length === 1) {
      return <FeatureGroup>{createStopMarker(stops[0])}</FeatureGroup>;
    }

    // Otherwise, return FeatureGroup with mapped array of StopMarkers
    return (
      <FeatureGroup>{stops.map(stop => createStopMarker(stop))}</FeatureGroup>
    );
  }
}

StopsOverlay.propTypes = {
  languageConfig: languageConfigType.isRequired,
  /* eslint-disable-next-line react/forbid-prop-types */
  leaflet: PropTypes.object.isRequired,
  minZoom: PropTypes.number,
  queryMode: PropTypes.string,
  refreshStops: PropTypes.func.isRequired,
  setLocation: PropTypes.func.isRequired,
  setViewedStop: PropTypes.func.isRequired,
  stops: PropTypes.arrayOf(stopLayerStopType).isRequired
};

StopsOverlay.defaultProps = {
  minZoom: 15
};

export default withLeaflet(StopsOverlay);