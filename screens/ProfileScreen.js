import {AsyncStorage, Modal, StatusBar, StyleSheet, Text, TouchableOpacity, View, Alert} from "react-native";
import React from "react";
import Button from "react-native-elements/src/buttons/Button";
import {STYLES} from "../constants/Constants"
import {Badge, Card, Divider, Icon} from "react-native-elements";
import {withNavigationFocus} from "react-navigation-is-focused-hoc";

@withNavigationFocus
export default class ProfileScreen extends React.Component {
    static navigationOptions = {
        title: '个人中心',
    };

    constructor() {
        super();
        this.state = {
            photos: [],
            loveLetter: ""
        }
    }

    componentDidMount() {
        this._retrievePhotoUrls();
    }

    componentDidUpdate(prevProps) {
        if (prevProps && prevProps.isFocused !== this.props.isFocused) {
            this._retrievePhotoUrls();
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <Card style={{height: 100}}>
                        <Text> 欢迎回来， {global.NICKNAME}！ </Text>
                        <Text style={{color: "#975b75"}}> {this.state.loveLetter} </Text>
                    </Card>

                    <Card style={{height: 60}}>
                        <TouchableOpacity onPress={this._openPhotos} style={STYLES.badgeIconView}>
                            <View>
                                <Text style={STYLES.badge}> {this.state.photos.length} </Text>
                                <Icon name={"photo"} size={40}/>
                            </View>
                        </TouchableOpacity>
                    </Card>

                    <View style={{paddingTop: 80}}>
                        {/*<Divider/>*/}
                    </View>

                    <Button title="退出账户" onPress={this._signOutAsync} buttonStyle={STYLES.primaryButton}/>
                </View>
            </View>
        );
    }


    _openPhotos = () => {
        const {photos} = this.state;
        if (photos.length === 0) {
            Alert.alert("你还没有收集到照片哦！");
            return
        }
        this.props.navigation.navigate("Photo", {photos: photos})
    };


    _signOutAsync = async () => {
        AsyncStorage.clear();
        AsyncStorage.setItem('validated', "").then(() => {
            global.USER = '';
            global.TOKEN = '';
            global.NICKNAME = '';
            this.props.navigation.navigate('Auth');
        })
    };

    _retrieveLoveLetter() {

    }


    _retrievePhotoUrls() {
        fetch('https://4t80o7hra7.execute-api.ap-southeast-1.amazonaws.com/default/retrievePhotos', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: global.USER,
                token: global.TOKEN,
            })
        }).then(
            response => response.json()
        ).then(
            data => {
                console.log(data);
                if (data && data.photos) {
                    this.setState({photos: data.photos});
                }
                if (data && data.loveLetter) {
                    this.setState({loveLetter: data.loveLetter})
                }
            }
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
        padding: 20
    },
});
