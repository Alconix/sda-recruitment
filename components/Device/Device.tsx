import React from "react";
import * as rdd from "react-device-detect";

const Device = ({ children }) => <>{children(rdd)}</>;

export default Device;
