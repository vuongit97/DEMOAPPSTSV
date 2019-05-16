import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Modal, AsyncStorage, Alert } from 'react-native';
import HeaderComponent from '../Components/HeaderComponent';
import ReactNativePickerModule from 'react-native-picker-module';
import RNSmtpMailer from "react-native-smtp-mailer";
import env from '../environment/env';

const xinGiay = require('../Images/xinGiay.png');
const name = require('../Icons/name.png');
const id = require('../Icons/IdIcon.png');

const BASE_URL = env;
var STORAGE_KEY = 'key_access_token';

export default class XinBangDiemScreen extends Component {
    static navigationOptions = {
        drawerIcon: ({ icon }) => (
            <Image source={xinGiay} resizeMode="contain" style={[styles.icon1]} />
        )
    };
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            masv: '',
            livingClass: '',
            Semester: ['Học kì I', 'Học kì II', 'Học kì III', 'Học kì IV', 'Học kì V', 'Học kì VI', 'Tất cả học kì'],
            valueSemester: null,
            nameSemester: "",
            modalVisible: false,
            usernameMail: "",
            passwordMail: "",
        }
    }

    _onFullName = (fullName) => {
        this.setState({ fullName })
    }

    _onChangeText = (masv) => {
        this.setState({ masv })
    }

    _onLivingClass = (livingClass) => {
        this.setState({ livingClass })
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
                this.setState({
                    usernameMail: resJson.email,
                })
            });
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    _onPressConfirm = () => {
        this.setModalVisible(!this.state.modalVisible);
        let to = "vuongjp97@gmail.com";
        let subject = "Xin cấp bảng điểm kết quả học tập";
        let body = `- Họ và tên sinh viên: ${this.state.fullName}<br>- Mã sinh viên: ${this.state.masv}<br>- Lớp sinh hoạt: ${this.state.livingClass}<br>- Các học kỳ xin cấp bảng điểm: ${this.state.nameSemester}`;

        RNSmtpMailer.sendMail({
            mailhost: "smtp.gmail.com",
            port: "465",
            ssl: true,
            username: this.state.usernameMail,
            password: this.state.passwordMail,
            from: this.state.usernameMail,
            recipients: to,
            subject: subject,
            htmlBody: body,
            attachmentPaths: [],
            attachmentNames: [],
            attachmentTypes: ["img", "txt", "csv", "pdf", "zip", "img"]
        })
            .then(success => {
                Alert.alert(success);
                this._sendEmailReplyAPI();
            })
            .catch(err => {
                Alert.alert("Vui lòng kiểm tra lại tài khoản của bạn.");
            });
    }

    _sendEmailReplyAPI = () => {
        let from = "vuongjp97@gmail.com";
        let passMail = "hdtgknvvw0";
        let to = this.state.usernameMail;
        let subject = "Bạn đã đăng ký xin cấp bảng điểm kết quả học tập thành công";
        let today = new Date();
        let date = today.getDate() + "-" + parseInt(today.getMonth() + 1) + "-" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        let body = `Bạn đã đăng ký xin cấp bảng điểm kết quả học tập vào lúc ${date}.<br>Hẹn bạn sau 3 ngày kể từ ngày đăng ký về phòng công tác học sinh, sinh viên để nhận bảng điểm kết quả học tập!`;

        RNSmtpMailer.sendMail({
            mailhost: "smtp.gmail.com",
            port: "465",
            ssl: true,
            username: from,
            password: passMail,
            from: from,
            recipients: to,
            subject: subject,
            htmlBody: body,
            attachmentPaths: [],
            attachmentNames: [],
            attachmentTypes: ["img", "txt", "csv", "pdf", "zip", "img"]
        })
            .then(success => {
                Alert.alert("Vui lòng kiểm tra thư điện tử của bạn.");
            })
            .catch(err => {
                Alert.alert(err.message);
            });
    }


    componentWillMount() {
        this._getInfomation();
    }

    render() {
        return (
            <ScrollView style={{ flex: 1, backgroundColor: '#99FFFF', }}>
                <HeaderComponent {...this.props} ></HeaderComponent>
                <View style={styles.container}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this.setModalVisible(false);
                        }}>
                        <View style={{ height: '70%', marginTop: 80, marginHorizontal: 40, justifyContent: "center", alignItems: "center", borderRadius: 5, backgroundColor: "#f1f1f1" }}>
                            <View>
                                <Text style={{ fontWeight: "bold", marginBottom: 20, textAlign: "center" }}>ĐĂNG NHẬP THƯ ĐIỆN TỬ</Text>
                                <View style={
                                    {
                                        backgroundColor: '#ffffff',
                                        padding: 10,
                                        borderRadius: 10,
                                        width: '80%',
                                        height: 45,
                                        marginBottom: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        shadowOffset: { width: 10, height: 10, },
                                        shadowColor: 'grey',
                                        shadowOpacity: 1.0,
                                    }
                                }>
                                    <Image style={styles.inputIcon} source={name} />
                                    <TextInput style={styles.textInput}
                                        placeholder="Tên tài khoản"
                                        editable={false}
                                        keyboardType="default"
                                        underlineColorAndroid='transparent'
                                        value={this.state.usernameMail}
                                        onChangeText={(text) => this.setState({ usernameMail: text })}
                                    />
                                </View>
                                <View
                                    style={
                                        {
                                            backgroundColor: '#ffffff',
                                            padding: 10,
                                            borderRadius: 10,
                                            width: '80%',
                                            height: 45,
                                            marginBottom: 10,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            shadowOffset: { width: 10, height: 10, },
                                            shadowColor: 'grey',
                                            shadowOpacity: 1.0,
                                        }
                                    }>
                                    <Image style={styles.inputIcon} source={name} />
                                    <TextInput style={styles.textInput}
                                        placeholder="Mật khẩu"
                                        keyboardType="default"
                                        secureTextEntry={true}
                                        underlineColorAndroid='transparent'
                                        onChangeText={(text) => this.setState({ passwordMail: text })}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={{
                                        padding: 10,
                                        borderRadius: 10,
                                        height: 45,
                                        marginBottom: 10,
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: "center",
                                        shadowOffset: { width: 10, height: 10, },
                                        shadowColor: 'grey',
                                        shadowOpacity: 1.0,
                                        backgroundColor: "#00b5ec",
                                    }}
                                    disabled={!(this.state.usernameMail != "" && this.state.passwordMail != "")}
                                    onPress={() => this._onPressConfirm()}
                                >
                                    <Text style={{ color: 'white', textAlign: "center" }}>ĐĂNG KÝ</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                    <View style={styles.inputContainer}>
                        <Image style={styles.inputIcon} source={name} />
                        <TextInput style={styles.textInput}
                            placeholder="Họ Tên"
                            keyboardType="default"
                            underlineColorAndroid='transparent'
                            onChangeText={(text) => this.setState({
                                fullName: text
                            })}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Image style={styles.inputIcon} source={id} />
                        <TextInput style={styles.textInput}
                            placeholder="Mã Sinh Viên"
                            keyboardType="number-pad"
                            underlineColorAndroid='transparent'
                            onChangeText={(text) => this.setState({
                                masv: text
                            })}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Image style={styles.inputIcon} source={name} />
                        <TextInput style={styles.textInput}
                            placeholder="Lớp sinh hoạt"
                            keyboardType="default"
                            underlineColorAndroid='transparent'
                            onChangeText={(text) => this.setState({
                                livingClass: text
                            })}
                        />
                    </View>

                    <TouchableOpacity style={styles.inputContainer} onPress={() => { this.pickerRef.show() }}>
                        <Image style={styles.inputIcon} source={xinGiay} />
                        <ReactNativePickerModule
                            pickerRef={e => this.pickerRef = e}
                            value={this.state.valueSemester}
                            title={"Chọn Học Kỳ"}
                            items={this.state.Semester}
                            onValueChange={(i) => {
                                this.setState({
                                    valueSemester: i,
                                    nameSemester: this.state.Semester[i]
                                })
                            }} />
                        <Text style={styles.text}>{this.state.nameSemester}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.buttonContainer]}
                        // disabled={!(this.state.fullName != "" && this.state.masv != "" && this.state.livingClass != "" && this.state.nameSemester != "")}
                        // onPress={this._onPressConfirm.bind(this)}
                        onPress={() =>
                            this.setModalVisible(true)
                        }
                    >
                        <Text style={styles.loginText}>Đăng ký</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        )
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
        padding: 10,
        borderRadius: 30,
        borderBottomWidth: 1,
        width: '80%',
        height: 45,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowOffset: { width: 10, height: 10, },
        shadowColor: 'grey',
        shadowOpacity: 1.0,
    },
    inputIcon: {
        width: 30,
        height: 30,
        marginLeft: 15,
        justifyContent: 'center'
    },
    textInput: {
        height: 45,
        marginLeft: 16,
        color: "black",
        borderBottomColor: '#FFFFFF',
        flex: 1,
    },
    icon1: {
        width: 25,
        height: 25
    },
    buttonContainer: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: '80%',
        borderRadius: 30,
        shadowOffset: { width: 10, height: 10, },
        shadowColor: 'grey',
        shadowOpacity: 1.0,
        backgroundColor: "#00b5ec",
        marginTop: 20
    },
})