import React from "react";
import { View } from "native-base";
import MapView from "react-native-maps";

import styles from "./MapContainerStyles.js";

import SearchBox from "../SearchBox/index.js";
import SearchResults from "../SearchResults";

export const MapContainer = ({
    region, 
    getInputData, 
    toggleSearchResultModal,
    getAddressPredictions,
    resultTypes,
    predictions,
    getSelectedAddress,
    selectedAddress
}) => {

    const { selectedLocation, selectedHomie } = selectedAddress || {};

    return(
        <View style={styles.container}>
            <MapView
                provider = {MapView.PROVIDER_GOOGLE}
                style={styles.map}
                region={region}
            >
                <MapView.Marker
                    coordinate={region}
                    pinColor="red"
                />
            </MapView>
            <SearchBox 
                getInputData = {getInputData} 
                toggleSearchResultModal = {toggleSearchResultModal}
                getAddressPredictions = {getAddressPredictions}
            />
            { (resultTypes.searchLocation || resultTypes.searchHomie) && 
            <SearchResults
                predictions = {predictions} 
                getSelectedAddress = {getSelectedAddress}
            />
            }
        </View>
    )
}

export default MapContainer;