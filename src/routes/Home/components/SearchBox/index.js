import React from "react";
import { Text } from "react-native";
import {View, InputGroup, Input } from "native-base";

import Icon from "react-native-vector-icons/MaterialIcons";
import styles from "./SearchBoxStyles.js";

export const SearchBox = ({
    getInputData, 
    toggleSearchResultModal, 
    getAddressPredictions,
    selectedAddress
}) => {
    function handleInput(key, val) {
        getInputData({
            key,
            value:val
        });
        getAddressPredictions();
    }

    return(
        <View style={styles.searchBox}>
            <View style={styles.inputWrapper}>
                <Text style={styles.label}>SEARCH BY LOCATION</Text>
                <InputGroup>
                    <Icon name="search" size={15} color="#FF5398"/>
                    <Input 
                        onFocus={() => toggleSearchResultModal("searchLocation")} 
                        style={styles.inputSearch} 
                        placeholder="Search for a location" 
                        onChangeText={handleInput.bind(this, "searchLocation")}
                    />
                </InputGroup>
            </View>
            <View style={styles.secondInputWrapper}>
                <Text style={styles.label}>SEARCH BY HOMIE</Text>
                <InputGroup>
                    <Icon name="search" size={15} color="#FF5398"/>
                    <Input 
                        onFocus={() => toggleSearchResultModal("searchHomie")} 
                        style={styles.inputSearch} 
                        placeholder="Search for a homie" 
                        onChangeText={handleInput.bind(this, "searchHomie")}
                    />
                </InputGroup>
            </View>
        </View>
    );
};

export default SearchBox;