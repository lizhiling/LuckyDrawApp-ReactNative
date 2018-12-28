import {AsyncStorage, StatusBar, StyleSheet, Text, View} from "react-native";
import React from "react";
import Button from "react-native-elements/src/buttons/Button";
import {STYLES} from "../constants/Constants"

export default class ProfileScreen extends React.Component {
    static navigationOptions = {
        title: '个人中心',
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.contentContainer}>
                    <Text style={{padding: 20}}> 欢迎回来， {global.NICKNAME}！ </Text>
                    <Text style={{padding: 20, paddingBottom: 100}}> 这个页面现在什么也没有。。。 </Text>
                    <Button title="退出账户" onPress={this._signOutAsync} buttonStyle={STYLES.primaryButton} />
                    <StatusBar barStyle="default" />
                </View>
            </View>
        );
    }



    _signOutAsync = async () => {
        AsyncStorage.setItem('validated', "").then(() => {
            global.USER = '';
            global.TOKEN = '';
            global.NICKNAME = '';
            this.props.navigation.navigate('Auth');
        })
    };
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
