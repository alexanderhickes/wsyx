import React from "react";
import { View, Text } from "react-native";
import { Actions } from "react-native-router-flux";

import { Container } from "native-base";
import MapContainer from "./MapContainer";

class Home extends React.Component{

    componentDidMount() {
        this.props.getCurrentLocation();
    }

    componentDidUpdate(prevProps, prevState) {
        this.props.getCurrentLocation();
	}

    render() {
        const region = {
            latitude: 3.146642,
            longitude: 101.695825,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421
        }
        return (
            <Container>
                {this.props.region.latitude &&
                <MapContainer 
                    region = {this.props.region} 
                    getInputData = {this.props.getInputData}
                    toggleSearchResultModal = {this.props.toggleSearchResultModal}
                    getAddressPredictions = {this.props.getAddressPredictions}
                    getSelectedAddress = {this.props.getSelectedAddress}
					selectedAddress = {this.props.selectedAddress}
                    resultTypes = {this.props.resultTypes}
                    predictions = {this.props.predictions}
                />
                }
            </Container>
        );     
    }
}

export default Home;