import {
    ActivityIndicator,
    AsyncStorage,
    StatusBar,
    StyleSheet,
    View,
    ScrollView,
    Text,
    TextInput
} from 'react-native';
import React from 'react';
import {CheckBox, Button} from "react-native-elements";
import {STYLES} from "../constants/Constants";

export class SignInScreen extends React.Component {
    static navigationOptions = {
        title: '登陆',
    };

    constructor() {
        super();
        this.state = {
            username: global.USER,
            password: "",
            showPassword: false,
            showInvalidPswd: false
        }
    }

    render() {
        let {username, password, showPassword, showInvalidPswd} = this.state;
        return (
            <ScrollView style={{padding: 20, paddingTop: 50}}>
                <Text
                    style={{fontSize: 18, padding: 20}}>
                    请输入帐号密码登陆。
                </Text>
                <TextInput placeholder='帐号' value={username} style={styles.input}
                           onChangeText={(text) => this.setState({username: text})}/>
                <TextInput secureTextEntry={!this.state.showPassword} style={styles.input} placeholder='密码' value={password}
                           onChangeText={(text) => this.setState({password: text})}/>
                <CheckBox checked={showPassword} title={'显示密码'} onPress={()=> this.setState({showPassword: !showPassword})}/>
                {showInvalidPswd? <Text style={{fontSize: 18}}>
                    密码错误。
                </Text>: null}
                <View style={{margin:7}} />
                <Button
                    onPress={this._signInAsync}
                    title="登陆"
                    buttonStyle={STYLES.primaryButton}
                />
            </ScrollView>
        );
    }

    _signInAsync = async () => {
        AsyncStorage.setItem('validated', "");

        let {username, password} = this.state;
        if (!username || !password) {
            return
        }

        // note: do not hash password because the developer want to know users' passwords
        fetch('https://rpbwgpdea1.execute-api.ap-southeast-1.amazonaws.com/default/validateUser', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: username,
                token: password,
            })
        }).then(
            response => response.json()
        ).then(
            data => {
                if (data && data.validated) {
                    Promise.all([
                        AsyncStorage.setItem('user', username),
                        AsyncStorage.setItem('pswd', password),
                        AsyncStorage.setItem('validated', "1"),
                        AsyncStorage.setItem('nickname', data.nickname)
                    ]).then(() => {
                        global.USER = username;
                        global.TOKEN = password;
                        global.NICKNAME = data.nickname;
                        this.setState({showInvalidPswd: false});

                        this.props.navigation.navigate('Main');
                    });
                } else {
                    this.setState({showInvalidPswd: true})
                }
            }

        );

    };
}

export class AuthLoadingScreen extends React.Component {
    constructor() {
        super();
        this._bootstrapAsync();
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        const validated = await AsyncStorage.getItem('validated');
        if (validated) {
            Promise.all([AsyncStorage.getItem('user'),
                AsyncStorage.getItem('pswd'),
                AsyncStorage.getItem('nickname')]).then(
                (userAndPswd) => {
                    global.USER = userAndPswd[0];
                    global.TOKEN = userAndPswd[1];
                    global.NICKNAME = userAndPswd[2];

                    this.props.navigation.navigate('Main');
                }
            );
        } else {
            this.props.navigation.navigate('Auth');
        }

        // This will switch to the App screen or Auth screen and this loading
        // screen will be unmounted and thrown away.

    };

    // Render any loading content that you like here
    render() {
        return (
            <View style={styles.container}>
                <ActivityIndicator />
                <StatusBar barStyle="default" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    input: {
        height: 40,
        backgroundColor: 'rgba(225,225,225,0.2)',
        marginBottom: 10,
        padding: 10,
        color: '#353535'
    },
    buttonContainer: {
        backgroundColor: '#2980b6',
        paddingVertical: 15
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: '700'
    }
});
