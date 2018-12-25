import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Modal,
    Image,
    RefreshControl,
    PanResponder,
    Animated,
    Dimensions
} from 'react-native';
import {connect} from "react-redux";
import {luckyDraw, buyCard, listCardsSelling, closeCard, openCard, luckyDrawClose} from './reducers/ShopReducer'
import {MonoText} from "../components/StyledText";
import {Card, Button} from "react-native-elements";
import CustomMultiPicker from "react-native-multiple-select-list";
import Overlay from "react-native-modal-overlay";

// import Overlay from 'react-native-modal-overlay';

export class ShopScreen extends React.Component {
    static navigationOptions = {
        title: '黑店',
    };

    constructor(props) {
        super(props);
        props.listCardsSelling();
        this.state = {
            exchangingCard: null,
            outCardsIds: [],
            showExchange: false,
            showLuckyDraw: false,
            pan: new Animated.ValueXY()
        }

        this.panResponder = PanResponder.create({    //Step 2
            onStartShouldSetPanResponder : () => true,
            onPanResponderMove           : Animated.event([null,{ //Step 3
                dx : this.state.pan.x,
                dy : this.state.pan.y
            }]),
            onPanResponderRelease           : (e, gesture) => {
                Animated.spring(            //Step 1
                    this.state.pan,         //Step 2
                    {toValue:{x:0,y:0}}     //Step 3
                ).start();
            },
            onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                return gestureState.dx !== 0 && gestureState.dy !== 0;
            },

        });
    }

    render() {
        const {shopCards, loading} = this.props;

        return (
            <View>
                <ScrollView refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={this.props.listCardsSelling}
                    />
                }>
                    {/*shop items*/}
                    <View style={styles.shopList}>
                        {shopCards.map((c) =>
                            <View key={c.uuid} style={styles.shopCard}>
                                <TouchableOpacity onPress={() => this._handleOpenCard(c)}>
                                    <Card
                                        title={c.type.name.toUpperCase()}
                                        imageStyle={styles.image}
                                        style={styles.shopCard}
                                        image={{uri: 'https://s3.ap-southeast-1.amazonaws.com/cardstore-vini/cards/' + c.type.id + '.png'}}>
                                    </Card>
                                </TouchableOpacity>
                            </View>)}
                    </View>

                    {this._renderExchangeModal()}
                </ScrollView>

                {
                  this._renderLuckyDrawOverlay()
                }

                {
                    this._renderLuckyDrawIcon()
                }
            </View>
        );
    }

    _handleOpenCard = (card) => {
        this.setState({'showExchange': true, 'exchangingCard': card, 'outCards': []});
        this.props.openCard();
    };

    _handleCloseCard = () => {
        this.setState({'showExchange': false, 'outCards': []});
        if (this.props.needsRefresh) {
            this.props.listCardsSelling();
        }
        this.props.closeCard()
    };

    _renderExchangeModal = () => {
        const {exchanged, exchangeSuccess, userCards} = this.props;
        // change userCards to specific format
        const userCardsSelects = {};
        userCards.map((c) => {
            if (c.type.exchangable && !c.used) {
                userCardsSelects[c.uuid] = c.type.name + '  ' + c.value
            }
        });
        return <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.showExchange}
            onRequestClose={this._handleCloseCard}
        >
            <View style={{marginTop: 22, padding: 30}}>
                <Text style={{fontSize:20, lineHeight:26, marginBottom: 10}}>嘿嘿嘿用你的卡来交换吧!</Text>
                <Image source={require('../assets/images/seller.png')} style={{width: 300, height: 130}}/>
                <CustomMultiPicker
                    options={userCardsSelects}
                    multiple={true} //
                    returnValue={"value"} // label or value
                    callback={this._handleChooseCard} // callback, array of selected items
                    rowBackgroundColor={"#eee"}
                    rowHeight={40}
                    rowRadius={5}
                    iconColor={"#003446"}
                    iconSize={30}
                    selectedIconName={"md-checkbox"}
                    unselectedIconName={"md-checkbox-outline"}
                    scrollViewHeight={200}
                />
                {this._renderExchangedMessage()}
                <Button title="换" buttonStyle={styles.button} onPress={this._handleExchangeCards}
                        disabled={this.state.outCardsIds.length === 0 || (exchangeSuccess && exchanged)}/>
            </View>
        </Modal>
    };

    _renderExchangedMessage = () => {
        const {exchanged, exchangeSuccess} = this.props;
        if (exchanged) {
            if (exchangeSuccess) {
                return (<Text>交易愉快～么么～</Text>)
            } else {
                return (<Text>哎呀我这可是价值连城的宝贝，再添一点吧！</Text>)
            }
        } else {
            return null;
        }
    };

    _renderLuckyDrawOverlay = () => {
        const {loading, drawnCard} = this.props;
        return <Overlay closeOnTouchOutside animationType="zoomIn"
                 containerStyle={{backgroundColor: 'rgba(37, 8, 10, 0.78)'}}
                 childrenWrapperStyle={{backgroundColor: '#eee'}}
                 animationDuration={500}
                 visible={this.state.showLuckyDraw}
                 onClose={this._handleLuckyDrawClose}>
            {!loading ?
                (this.props.drawCardSuccess && drawnCard !== null ?
                        <Card title={drawnCard.type.name.toUpperCase()}
                              imageStyle={styles.drawnCardImage}
                              style={styles.drawnCard}
                              image={{uri: 'https://s3.ap-southeast-1.amazonaws.com/cardstore-vini/cards/' + drawnCard.type.id + '.png'}}>
                            <Text>哟哟哟，获得新卡了哦！</Text>
                        </Card> : <Text>今天抽过了哦～ </Text>
                ): <Text/>
            }

        </Overlay>
    };

    _renderLuckyDrawIcon = () => {
        const {pan} = this.state;
        return <View style={styles.draggableContainer}>
            <Animated.View
                {...this.panResponder.panHandlers}                       //Step 1
                style={[pan.getLayout()]}>

                <TouchableOpacity onPress={this._handleLuckyDrawOpen}
                                  style={{width: 80}}>
                    <Image source={require("../assets/images/lucky.png")}
                           style={{height: 70}}
                    />
                </TouchableOpacity>
            </Animated.View>
        </View>
    };

    _handleChooseCard = (res) => {
        let selectedIds = [];
        res.map((uuid) => {
            if (uuid) {
                selectedIds.push(uuid)
            }
        });
        this.setState({'outCardsIds': selectedIds})
    };

    _handleExchangeCards = () => {
        console.log(this.state.outCardsIds, this.state.exchangingCard.uuid);
        this.props.buyCard(this.state.outCardsIds, this.state.exchangingCard.uuid)
    };

    _handleLuckyDrawOpen = () => {
        console.log("open lucky");
        this.setState({'showLuckyDraw': true});
        this.props.luckyDraw()
    };

    _handleLuckyDrawClose = () => {
        console.log("close lucky");
        console.log(this.state.showLuckyDraw);
        this.setState({'showLuckyDraw': false});
        this.props.luckyDrawClose();
    }
}

const mapStateToProps = state => {
    const {shopData, userData} = state;
    let props = shopData;
    props['userCards'] = userData.cards;
    return props;
};

const mapDispatchToProps = {
    luckyDraw, buyCard, listCardsSelling, closeCard, openCard, luckyDrawClose
};

export default connect(mapStateToProps, mapDispatchToProps)(ShopScreen);

let Window = Dimensions.get('window');
let CIRCLE_RADIUS = 36;
const styles = StyleSheet.create({
    shopList: {
        top: 0,
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: -20,
        marginHorizontal: 0,
    },
    shopCard: {
        paddingHorizontal: -10,
        marginHorizontal: -10,
        marginVertical: -10,
        width: 140,
        height: 180
    },
    image: {
        width: 100,
        height: 80,
        alignSelf: 'center'
    },
    drawnCard: {
        width: 200,
        height: 300
    },
    drawnCardImage: {
        width: 180,
        height: 250
    },
    draggableContainer: {
        position    : 'absolute',
        top         : Window.height/2 - CIRCLE_RADIUS,
        left        : Window.width/2 - CIRCLE_RADIUS,
    },
    button: {
        backgroundColor: "rgba(92, 99,216, 1)",
        width: 300,
        height: 45,
        borderColor: "transparent",
        borderWidth: 0,
        borderRadius: 5,
        alignSelf:'center'
    }
});
