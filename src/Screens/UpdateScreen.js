import React, {Component} from 'react';
import {View, Text, StyleSheet, AsyncStorage, Image, TextInput, TouchableHighlight,ScrollView} from 'react-native';
import HeaderComponent from '../Components/HeaderComponent';
import env from '../environment/env';

const BASE_URL = env;
var STORAGE_KEY = 'key_access_token';

const update = require('../Images/update.png');
const Address = require('../Icons/address.png');
const Phone = require('../Images/phone.png');
const iEmail = require('../Images/email1.png')

export default class UpdateScreen extends Component{
    static navigationOptions = {
        drawerIcon: ({icon}) =>(
            <Image source = {update} resizeMode="contain" style = {[styles.icon1]} />
        )
      };
    constructor(props){
        super(props);
        this.state = {
            Birthplace: '',
            Address: '',
            PhoneNumber: '',
            Email: '',
        }
    }
    _onBirthplace = (Birthplace) =>{
        this.setState({Birthplace});
      }
    _onAddress = (Address) =>{
        this.setState({Address});
    }
    _onPhoneNumber = (PhoneNumber) =>{
        this.setState({PhoneNumber});
      }
    _onEmail = (Email) =>{
        this.setState({Email});
      }
      _onPressConfirm = ()=> {
        AsyncStorage.getItem(STORAGE_KEY).then((user_data_json) => {
            this.setState({loading: true});
          let token = user_data_json;
          if (token === undefined) {
              var{navigate} = this.props.navigation;
              navigate('Main');
              this.setState({loading: false});
          }
          let Birthplace = this.state.Birthplace;
          let Address = this.state.Address;
          let PhoneNumber = this.state.PhoneNumber;
          let Email = this.state.Email;
              let url = BASE_URL + 'Account/ChangeInformationUser'
              fetch(url,{
                  method: 'POST',
                  headers: {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json',
                       Authorization: 'Bearer ' + token,
                  },
                  body: JSON.stringify({
                      'Birthplace':Birthplace,
                      'Address': Address,
                      'PhoneNumber': PhoneNumber,
                      'Email': Email,
                  })
              })
              .then((res) => {
                //console.warn(res);
                  if (res.ok) {
                      var {navigate} = this.props.navigation;
                      navigate('Home');
                      this.setState({loading: false});
                      ToastAndroid.show('Change Success!', ToastAndroid.CENTER);
                  } else {
                    ToastAndroid.show('Change False!', ToastAndroid.CENTER);
                    this.setState({loading: false});
                  }
              })
              .catch((err) => {
                  //console.log(err);
                  this.setState({loading: false});
              })
        })
        }

    render() {
        return(
            <ScrollView>
                <HeaderComponent {...this.props}></HeaderComponent>
            <View style={styles.container}>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={Address}/>
                    <TextInput style={styles.textInput}
                               placeholder= "Nơi sinh"
                               keyboardType="default"
                               underlineColorAndroid='transparent'
                               onChangeText={this._onBirthplace.bind(this)}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={Address}/>
                    <TextInput style={styles.textInput}
                               placeholder= "Địa chỉ"
                               keyboardType="default"
                               underlineColorAndroid='transparent'
                               onChangeText={this._onAddress.bind(this)}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={Phone}/>
                    <TextInput style={styles.textInput}
                               placeholder= "Số điện thoại"
                               keyboardType="phone-pad"
                               underlineColorAndroid='transparent'
                               onChangeText={this._onPhoneNumber.bind(this)}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Image style={styles.inputIcon} source={iEmail}/>
                    <TextInput style={styles.textInput}
                               placeholder= "Email"
                               keyboardType="email-address"
                               underlineColorAndroid='transparent'
                               onChangeText={this._onEmail.bind(this)}
                    />
                </View>
                <TouchableHighlight style={[styles.buttonContainer]} onPress={this._onPressConfirm.bind(this)}>
                    <Text style={styles.loginText}>Confirm</Text>
                </TouchableHighlight>
            </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 40,
        backgroundColor: '#99FFFF',
    },
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        padding:10,
        borderRadius:30,
        borderBottomWidth: 1,
        width:'80%',
        height:45,
        marginBottom:10,
        flexDirection: 'row',
        alignItems:'center',
        shadowOffset:{  width: 10,  height: 10,  },
        shadowColor: 'grey',
        shadowOpacity: 1.0,
    },
    inputIcon: {
        width:30,
        height:30,
        marginLeft:15,
        justifyContent: 'center'
    },
    textInput: {
        height:45,
        marginLeft:16,
        borderBottomColor: '#FFFFFF',
        flex:1,
    },
    buttonContainer: {
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:'80%',
        borderRadius:30,
        shadowOffset:{  width: 10,  height: 10,  },
        shadowColor: 'grey',
        shadowOpacity: 1.0,
        backgroundColor: "#00b5ec",
        marginTop: 20
    },
      loginText: {
        color: 'white',
    },
    text: {
        fontSize : 20,
        alignItems: 'center',
        marginLeft: '10%'
    },icon1: {
        width: 25,
        height: 25
    },
})