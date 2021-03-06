import React from "react";
import PropTypes from "prop-types";
import { FeatureGroup } from "react-leaflet";

import VehicleMarker from "../VehicleMarker";
import { vehicleType } from "../types";
import * as utils from "../utils";

/**
 * presentational component used to draw the marker layer atop a leaflet map
 * expects an array of vehicles (fetched from the service)
 * optionally can include a vehicle record for a vehicle in the list we'd like to track
 * note: (vehicle) markers are created here
 */
function VehicleLayer(props) {
  const { vehicles } = props;
  const { trackedVehicle } = props;

  return (
    <FeatureGroup>
      {vehicles &&
        vehicles.map(v => (
          <VehicleMarker
            key={v.id}
            vehicle={v}
            tracked={utils.isTracked(v, trackedVehicle)}
            setTracked={props.setTracked}
            hasTooltip={props.hasTooltip}
            hasPopup={props.hasPopup}
            color={props.color}
          />
        ))}
    </FeatureGroup>
  );
}

VehicleLayer.defaultProps = {
  vehicles: [],
  trackedVehicle: null,
  hasTooltip: true,
  hasPopup: true,
  color: null
};

VehicleLayer.propTypes = {
  vehicles: PropTypes.arrayOf(vehicleType),
  trackedVehicle: vehicleType,
  setTracked: PropTypes.func.isRequired,
  hasTooltip: PropTypes.bool,
  hasPopup: PropTypes.bool,
  color: PropTypes.string
};

export default VehicleLayer;
