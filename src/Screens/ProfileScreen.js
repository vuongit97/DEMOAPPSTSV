import React from 'react';
import { Text, View, StyleSheet, AsyncStorage, Image, TouchableOpacity } from 'react-native';
import env from '../environment/env';
import ImagePicker from 'react-native-image-crop-picker';
import axios from "axios";
const BASE_URL = env;
var STORAGE_KEY = 'key_access_token';
const profile = require('../Images/profile.png');
const phone = require('../Images/phone.png');
const id = require('../Icons/IdIcon.png');
const birthday = require('../Icons/birthday.png');
const email = require('../Images/email1.png');
const address = require('../Images/address.png');

export default class MainScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: '',
            lastName: '',
            sdt: '',
            maSV: '',
            address: '',
            email: '',
            birthday: '',
            urlAvatar: ''
        }
    }
    componentDidMount = async () => {
        this._getInfomation();
    }
    logoutClick = () => {
        alert('Onclick');
        this.props.navigation.navigate('Login')
    }
    _getInfomation = async () => {
        const userToken = await AsyncStorage.getItem(STORAGE_KEY);
        let url = BASE_URL + 'Account/GetUserInformation'
        fetch(url, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + userToken,
            },
        })
            .then((res) => res.json())
            .then((resJson) => {
                console.log("resJson", resJson);
                this.setState({
                    firstName: resJson.firstName,
                    lastName: resJson.lastName,
                    sdt: resJson.phoneNumber,
                    email: resJson.email,
                    address: resJson.address,
                    maSV: resJson.userName,
                    birthday: resJson.dateOfBirth,
                    urlAvatar: resJson.avatar
                })
                // console.warn(resJson);
            });
    }

    handleImage = async () => {
        const userToken = await AsyncStorage.getItem(STORAGE_KEY);
        console.log("userToken", userToken);
        ImagePicker.openPicker({
            // cropping: true,
            includeExif: true,
            width: 800,
            height: 800,
            includeBase64: true,
            path: true,
            type: true
        }).then(image => {
            console.log("image", image);
            var formData = new FormData();
            var blobData = {
                uri: image.path,
                type: image.mime,
                name: 'avatar.jpg',
                FileAvatar: image.path
            }
            formData.append("FileAvatar", blobData);
            axios.put('https://sotaysv.herokuapp.com/api/account/UpdateAvatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': 'Bearer ' + userToken
                }
            }).then((res) => {
                console.log("xxxx", res);//upload avatar thành công
                //get lai thong tin nguoi dung
                this._getInfomation();

            }).catch(err => {
                console.log("ERR WHEN UPLOAD IMAGE: ", err)
            })

        }).catch(err => {
            console.log("ERROR WHILE PICK IMAGE: " + err);
        })
    }
    render() {
        return (
            <View style={styles.container}>
                <View style={styles.conProfile}>
                    <Image
                        source={{ uri: this.state.urlAvatar }}
                        style={styles.imageProfile}
                        resizeMode="center"
                    />
                    <View style={styles.conProfile}>
                        <Text style={styles.name}>Hello {this.state.lastName} {this.state.firstName}</Text>
                        <TouchableOpacity style={styles.logout} onPress={() => this.logoutClick()}><Text>Logout</Text></TouchableOpacity>
                    </View>
                </View>
                <View style={{ width: '100%' }}>
                    <View style={styles.comPhone}>
                        <Image source={id} style={styles.icon} />
                        <Text style={styles.text}>
                            {this.state.maSV}
                        </Text>
                    </View>
                    <View style={styles.comPhone}>
                        <Image source={phone} style={styles.icon} />
                        <Text style={styles.text}>
                            {this.state.sdt}
                        </Text>
                    </View>
                    <View style={styles.comPhone}>
                        <Image source={email} style={styles.icon} />
                        <Text style={styles.text}>
                            {this.state.email}
                        </Text>
                    </View>
                    <View style={styles.comPhone}>
                        <Image source={address} style={styles.icon} />
                        <Text style={styles.text}>
                            {this.state.address}
                        </Text>
                    </View>
                    <View style={styles.comPhone}>
                        <Image source={birthday} style={styles.icon} />
                        <Text style={styles.text}>
                            {this.state.birthday}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={() => this.handleImage()}
                >

                    <Text>Change Avatar</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        //justifyContent : 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20
    },
    name: {
        fontSize: 20,
        marginTop: 10,
    },
    conProfile: {
        height: '60%',
        width: '100%',
        flex: 0.5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#81F7F3',
        //borderBottomLeftRadius: 50,
        //borderBottomRightRadius: 50,
    },
    imageProfile: {
        height: '55%',
        width: '55%',
        marginTop: 30
    },
    logout: {
        marginTop: 20,
        color: 'green'
    },
    icon: {
        height: 30,
        width: 30,
        marginRight: 10
    },
    comPhone: {
        flexDirection: 'row',
        marginTop: 20,
        paddingLeft: 10,
        paddingRight: 15
    }
})