import {AsyncStorage, StatusBar, StyleSheet, Text, View} from "react-native";
import React from "react";
import Button from "react-native-elements/src/buttons/Button";
import {PHOTO_URL, STYLES} from "../constants/Constants"
import Gallery from 'react-native-image-gallery';

export default class PhotoCollectionScreen extends React.Component {
    static navigationOptions = {
        title: '照片集',
    };

    render() {
        const imageIds = this.props.navigation.getParam('photos');
        const images = imageIds.map((id) => {
            return {
                source: { uri: PHOTO_URL + id + ".jpg" }
            }
        });

        return (
            <View style={styles.container}>
                <Gallery
                    style={{ flex: 1, backgroundColor: 'black' }}
                    images={images}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        paddingTop: 5,
    },
});
