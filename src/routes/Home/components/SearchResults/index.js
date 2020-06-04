import React from "react";
import { Text, ScrollView, FlatList, View } from "react-native";
// import {View, List, ListItem, Left, Body } from "native-base";

import styles from "./SearchResultsStyles.js";
import Icon from "react-native-vector-icons/MaterialIcons";

export const SearchResults = ({predictions, getSelectedAddress}) => {
    function handleSelectedAddress(placeID) {
        getSelectedAddress(placeID)
    }

    return(
        <ScrollView style={styles.searchResultsWrapper}>
            <FlatList
                data ={predictions}
                renderRow = {({ item }) => {
                    <View> style = {styles.row}>
                        <View style = {styles.leftContainer}>
                            <Icon style = {styles.leftIcon} name = "location-on"/>
                        </View>
                        <Text style = {styles.primaryText}>{item.primaryText}</Text>
                        <Text style = {styles.secondaryText}>{item.secondaryText}</Text>
                    </View>        
                }}
            />
        </ScrollView>
    );
};

export default SearchResults;