import React from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert
} from 'react-native';
import {Card, ButtonGroup} from 'react-native-elements'
import {connect} from 'react-redux';
import {closePhotoOverlay, retrieveCards, useCard} from './reducers/HomeReducer'
import {CARD_COLORS} from '../constants/Constants'
import Overlay from "react-native-modal-overlay";
import {withNavigationFocus} from "react-navigation-is-focused-hoc";

@withNavigationFocus
export class HomeScreen extends React.Component {
    static navigationOptions = {
        title: '卡包',
    };
    _handleUsePhotoClose = () => {
        this.props.closePhotoOverlay();
    };

    constructor() {
        super();
        this.state = {
            selectedIndex: 0
        }
    }

    componentDidMount() {
        this.props.retrieveCards();
    }


    componentDidUpdate(prevProps) {
        if (prevProps && prevProps.isFocused !== this.props.isFocused) {
            this.props.retrieveCards();
        }
    }


    render() {
        const {cards, loading, usedPhotoCard, gotNewPhoto} = this.props;
        const {selectedIndex} = this.state;
        const buttons = ['全部', '可用'];

        return (
            <View style={styles.container}>

                <View>
                    <ButtonGroup
                        onPress={this.updateIndex}
                        selectedIndex={selectedIndex}
                        buttons={buttons}
                    />
                </View>

                <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={this.props.retrieveCards}
                    />
                }>
                    <View>
                        {this._renderCards()}
                    </View>
                </ScrollView>

                <Overlay closeOnTouchOutside animationType="zoomIn"
                         containerStyle={{backgroundColor: 'rgba(37, 8, 10, 0.78)'}}
                         childrenWrapperStyle={{backgroundColor: '#eee'}}
                         animationDuration={500}
                         visible={usedPhotoCard}
                         onClose={this._handleUsePhotoClose}>
                    {gotNewPhoto ?
                        <Text>获得一张照片，是新的哦！去个人中心看看吧！</Text>
                        : <Text>获得一张照片，可惜已经有了哦。 </Text>
                    }

                </Overlay>
            </View>
        );
    }

    updateIndex = (selectedIndex) => {
        this.setState({selectedIndex});
    };

    compare = (a, b) => {
        if (a.datereceived < b.datereceived)
            return -1;
        if (a.datereceived > b.datereceived)
            return 1;
        return 0;
    };

    _renderCards() {
        const {cards} = this.props;
        const {selectedIndex} = this.state;
        let sortedCards = cards.slice();
        sortedCards.sort(this.compare);

        return sortedCards.map((c) =>
            <LuckyCard card={c}
                       useCard={(id) => this.props.useCard(id)}
                       key={c.uuid}
                       showUsed={selectedIndex === 0}
            />
        )
    }
}


export class LuckyCard extends React.Component {
    render() {
        const {card} = this.props;
        const desc = card.type.desc.replace("$value", (card.value * card.type.multiplyNumber).toFixed(2));

        if (this.props.showUsed || !card.used) {
            return <TouchableOpacity onPress={card.used ? () => {
            } : () => this._handleUseCard(card.uuid)} disabled={card.used}>
                <Card wrapperStyle={card.used ? {backgroundColor: '#E1E1E1'} : {backgroundColor: 'white'}}
                      title={card.type.name.toUpperCase()}
                      image={{uri: 'https://s3.ap-southeast-1.amazonaws.com/cardstore-vini/cards/' + card.type.id + '.png'}}
                      titleStyle={{color: CARD_COLORS[card.value - 1]}}
                >
                    <Text style={{marginBottom: 10, marginLeft: 20}}>
                        {desc}
                    </Text>
                    <Text style={styles.date}> {new Date(card.datereceived).toDateString()}  </Text>

                </Card></TouchableOpacity>
        } else {
            return null
        }
    }

    _handleUseCard = (uuid) => {
        Alert.alert(
            '确定使用吗？',
            null,
            [
                {
                    text: '使用', onPress: () => {
                        this.props.useCard(uuid)
                    }
                },
                {text: '取消', style: 'cancel'}
            ],
            {cancelable: true}
        )
    }

}

const mapStateToProps = state => {
    const {userData} = state;
    return {
        ...userData
    };
};

const mapDispatchToProps = {
    retrieveCards,
    useCard,
    closePhotoOverlay
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        paddingTop: 5,
    },
    date: {
        fontSize: 12,
        color: 'grey',
        marginBottom: 2,
        textAlign: 'right',
    }
});
