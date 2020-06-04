import update from "react-addons-update";
import constants from "./actionConstants";
import { Dimensions } from "react-native";
import RNGooglePlaces from "react-native-google-places";

import request from "../../../util/request";

import calculateFare from "../../../util/fareCalculator.js";

//Constants

const { 
    GET_CURRENT_LOCATION, 
    GET_INPUT,
    TOGGLE_SEARCH_RESULT,
    GET_ADDRESS_PREDICTIONS
} = constants;

const {width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = ASPECT_RATIO * LATITUDE_DELTA

//Actions

export function getCurrentLocation() {
    return (dispatch)=>{
        navigator.geolocation.getCurrentPosition(
            (position)=>{
                dispatch({
                    type:GET_CURRENT_LOCATION,
                    payload:position
                });
                console.log(position);
            },
            (error)=> console.log(error.message),
            {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
        );
    }
}

export function getInputData(payload) {
    return {
        type: GET_INPUT,
        payload
    }
}

export function toggleSearchResultModal(payload) {
    return {
        type: TOGGLE_SEARCH_RESULT,
        payload
    }
}

export function getAddressPredictions(){
	return(dispatch, store)=>{
		let userInput = store().home.resultTypes.searchLocation ? store().home.inputData.searchLocation : store().home.inputData.searchHomie;
        console.log("DEBUG userInput: ", userInput);
        RNGooglePlaces.getAutocompletePredictions(userInput,
            {
                country:"UK"
            }
        )
        .then((results) =>
            dispatch({
                type:GET_ADDRESS_PREDICTIONS,
                payload:results
            })
        )
        .catch((error) => console.log("THIS IS THE PROBLEM: ", error.message));
        console.log("POST RNGooglePlaces, Results: ", results);
	};
}

// export function getAddressPredictions() {
//     return (dispatch, store) => {
//         let userInput = store().home.resultTypes.searchLocation ? store().home.inputData.searchLocation : store().home.inputData.searchHomie;
        
//         console.log("DEBUG dispatch: ", dispatch);

//         console.log("DEBUG user input: ", userInput);

//         console.log("DEBUG store().home: ", store().home);

//         console.log("DEBUG store().home.resultTypes: ", store().home.resultTypes);
//         console.log("DEBUG store().home.resultTypes.searchLocation: ", store().home.resultTypes.searchLocation);

//         console.log("DEBUG store().home.inputData: ", store().home.inputData);
//         console.log("DEBUG store().home.inputData.searchLocation: ", store().home.inputData.searchLocation);
//         console.log("DEBUG store().home.inputData.searchHomie: ", store().home.inputData.searchHomie);
        
//         console.log("RNGooglePlaces.getAutocompletePredictions(userInput ... : ", 
//             RNGooglePlaces.getAutocompletePredictions(userInput, {
//                 country:"UK"
//             }).then((results) => 
//                 dispatch({
//                     type: GET_ADDRESS_PREDICTIONS,
//                     payload: results
//                 })
//             ).catch((error) => 
//                 console.log(error.message)
//             )
//         );   

//         console.log("DEBUG RNGooglePlaces.getAutocompletePredictions: ", RNGooglePlaces.getAutocompletePredictions(userInput, {
//             country:"UK"
//         }));

//         RNGooglePlaces.getAutocompletePredictions(userInput, {
//             country:"UK"
//         }).then((results) => 
//             dispatch({
//                 type: GET_ADDRESS_PREDICTIONS,
//                 payload: results
//             })
//         ).catch((error) => 
//             console.log(error.message)
//         );     
//     };
// }

export function getSelectedAddress(payload){
	const dummyNumbers ={
		baseFare:0.4,
		timeRate:0.14,
		distanceRate:0.97,
		surge:1
	}
	return(dispatch, store)=>{
		RNGooglePlaces.lookUpPlaceByID(payload)
		.then((results)=>{
			dispatch({
				type:GET_SELECTED_ADDRESS,
				payload:results
			})
		})
		.then(()=>{
			//Get the distance and time
			if(store().home.selectedAddress.selectedLocation && store().home.selectedAddress.selectedHomie){
				request.get("https://maps.googleapis.com/maps/api/distancematrix/json")
				.query({
					origins:store().home.selectedAddress.selectedLocation.latitude + "," + store().home.selectedAddress.selectedLocation.longitude,
					destinations:store().home.selectedAddress.selectedHomie.latitude + "," + store().home.selectedAddress.selectedHomie.longitude,
					mode:"driving",
					key:"AIzaSyDUYbTR-3PDWPhgxjENs4yf35g2eHc641s"
				})
				.finish((error, res)=>{
					dispatch({
						type:GET_DISTANCE_MATRIX,
						payload:res.body
					});
				})
			}
			setTimeout(function(){
				if(store().home.selectedAddress.selectedLocation && store().home.selectedAddress.selectedHomie){
					const fare = calculateFare(
						dummyNumbers.baseFare,
						dummyNumbers.timeRate,
						store().home.distanceMatrix.rows[0].elements[0].duration.value,
						dummyNumbers.distanceRate,
						store().home.distanceMatrix.rows[0].elements[0].distance.value,
						dummyNumbers.surge,
					);
					dispatch({
						type:GET_FARE,
						payload:fare
					})
				}


			},2000)

		})
		.catch((error)=> console.log(error.message));
	}
}

//Action Handlers

function handleGetCurrentLocation(state, action){
	return update(state, {
		region:{
			latitude:{
				$set:action.payload.coords.latitude
			},
			longitude:{
				$set:action.payload.coords.longitude
			},
			latitudeDelta:{
				$set:LATITUDE_DELTA
			},
			longitudeDelta:{
				$set:LONGITUDE_DELTA
			}
		}
	})
}

function handleGetInputData(state, action) {
    const { key, value } = action.payload;
    return update(state, {
        inputData: {
            [key]: {
                $set:value
            }
        }
    });
}

function handleToggleSearchResult(state, action) {
    if(action.payload === "searchLocation") {
        return update (state, {
            resultTypes:{
                searchLocation:{
                    $set:true,
                },
                searchHomie:{
                    $set:false
                }
            },
            predictions:{
                $set:{}
            }
        });
    }

    if(action.payload === "searchHomie") {
        return update(state, {
            resultTypes:{
                searchLocation:{
                    $set: false,
                },
                searchHomie:{
                    $set: true
                }
            },
            predictions:{
                $set: {}
            }
        })
    }
}

function handleGetAddressPredictions(state, action) {
    return update(state, {
        predictions: {
            $set: action.payload
        }
    })
}

const ACTION_HANDLERS = {
    GET_CURRENT_LOCATION: handleGetCurrentLocation,
    GET_INPUT: handleGetInputData,
    TOGGLE_SEARCH_RESULT: handleToggleSearchResult,
    GET_ADDRESS_PREDICTIONS: handleGetAddressPredictions
}

const initialState = {
    region:{},
    inputData:{},
    resultTypes:{},
    selectedAddress:{}
};

export function HomeReducer(state = initialState, action) {
    const handler = ACTION_HANDLERS[action.type];

    return handler ? handler(state, action) : state;
}