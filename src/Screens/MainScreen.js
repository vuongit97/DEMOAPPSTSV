import React, { Component } from 'react';
import { Text, View, ScrollView, StyleSheet, AsyncStorage, Image, FlatList, Linking, TouchableOpacity } from 'react-native';
import HeaderComponent from '../Components/HeaderComponent';
import flastListData from '../data/flastListData'

const main = require('../Images/home.png');
var STORAGE_KEY = 'key_access_token';

class FlastListItem extends Component {
    render() {
        return (
            <View>
                <TouchableOpacity
                    onPress={() => Linking.openURL(this.props.item.link)}
                >
                    <Text style={styles.textName} numberOfLines={1}>{this.props.item.name}</Text>
                </TouchableOpacity>
                <Text style={styles.textContent} numberOfLines={2}>{this.props.item.content}</Text>
                <Text style={styles.textAuther} numberOfLines={1}>{this.props.item.auther}</Text>
            </View>
        );
    }
}

export default class MainScreen extends React.Component {
    static navigationOptions = {
        title: 'Home',
        drawerIcon: ({ icon }) => (
            <Image source={main} resizeMode="contain" style={[styles.icon1]} />
        )
    };
    componentDidMount() {
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
            let token = user_data_json;
            //console.warn(token)
            if (token === null) {
                var { navigate } = this.props.navigation;
                navigate('Login');
                this.setState({
                    loading: false
                })
            }
            else {
                //-----------get data async from helper----------------------
            }
        })
    }
    render() {
        return (
            <View>
                <HeaderComponent {...this.props} ></HeaderComponent>
                <ScrollView>
                    <View style={styles.container}>
                        <FlatList style={{ flex: 1, marginBottom: 80 }} data={flastListData}
                            renderItem={({ item, index }) => {
                                return (<FlastListItem item={item} index={index}>

                                </FlastListItem>);
                            }}>

                        </FlatList>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#99FFFF',

    },
    icon1: {
        width: 25,
        height: 25
    },
    textName: {
        marginHorizontal: 10,
        fontSize: 16,
        fontWeight: 'bold',
    }, textContent: {
        marginHorizontal: 10,
        marginVertical: 5,
        fontSize: 13,
    },
    textAuther: {
        marginHorizontal: 10,
        fontSize: 10,
        marginBottom: 15,
    }
})