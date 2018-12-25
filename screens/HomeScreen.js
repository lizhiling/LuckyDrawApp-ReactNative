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
import {Card, Button, Icon, ButtonGroup} from 'react-native-elements'
import {connect} from 'react-redux';
import {retrieveCards, useCard} from './reducers/HomeReducer'

export class HomeScreen extends React.Component {
    static navigationOptions = {
        title: '卡包',
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


    render() {
        const {cards, loading} = this.props;
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
        const desc = card.type.desc.replace("$value", card.value * card.type.multiplyNumber);

        if (this.props.showUsed || !card.used) {
            return <TouchableOpacity onPress={card.used ? ()=>{} :() => this._handleUseCard(card.uuid)}>
                <Card
                    wrapperStyle={card.used ? {backgroundColor: '#E1E1E1'}: {backgroundColor: 'white'}}
                title={card.type.name.toUpperCase()}
                image={{uri: 'https://s3.ap-southeast-1.amazonaws.com/cardstore-vini/cards/'+card.type.id+'.png'}}>
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
        cards: userData.cards,
        loading: userData.loading,
        error: userData.error,
        message: userData.message,
    };
};

const mapDispatchToProps = {
    retrieveCards,
    useCard
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
