import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Linking, Modal, Alert, AsyncStorage } from 'react-native';
import HeaderComponent from '../Components/HeaderComponent';
import ReactNativePickerModule from 'react-native-picker-module';
import RNSmtpMailer from "react-native-smtp-mailer";
import env from '../environment/env';

const xinGiay = require('../Images/xinGiay.png');
const nganhHoc = require('../Icons/nganhHocIcon.png');
const Address = require('../Icons/address.png');
const name = require('../Icons/name.png');
const tinh = require('../access/Tinh.json');
const huyen = require('../access/quan_huyen.json');
const xa = require('../access/xa_phuong.json');

const BASE_URL = env;
var STORAGE_KEY = 'key_access_token';


export default class XinGiayXNScreen extends Component {
    static navigationOptions = {
        drawerIcon: ({ icon }) => (
            <Image source={xinGiay} resizeMode="contain" style={[styles.icon1]} />
        )
    };
    constructor(props) {
        super(props);
        this.state = {
            addRess: '',
            yearStudent: 1,
            valueTinh: null,
            nameTinh: '',
            valueBirthPlace: null,
            birthPlace: '',
            tinhList: [],
            valueHuyen: null,
            nameHuyen: '',
            huyenList: [],
            valueXa: null,
            nameXa: '',
            xaList: [],
            yearStudentList: ["1", "2", "3"],
            semester: "",
            reason: "",
            modalVisible: false,
            usernameMail: "",
            passwordMail: "",
        }
        this.tinhArr = [];
        this.huyenArr = [];
    }
    _onAddRess = (addRess) => {
        this.setState({ addRess });
    }
    _onYearStudent = (yearStudent) => {
        this.setState({ yearStudent });
    }

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    _onPressConfirm = () => {
        this.setModalVisible(!this.state.modalVisible);
        let to = "vuongjp97@gmail.com";
        let subject = "Xin giấy xác nhận";
        let body = `- Địa chỉ: ${this.state.addRess}<br>- Tỉnh/Thành phố: ${this.state.nameTinh}<br>- Huyện/quận: ${this.state.nameHuyen}<br>- Xã/phường: ${this.state.nameXa}<br>- Nơi sinh: ${this.state.birthPlace}<br>- Sinh viên năm: ${this.state.yearStudent}<br>- Học kỳ: ${this.state.semester}<br>- Lý do: ${this.state.reason}`;

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
                Alert.alert(`Đã gửi mail thành công`);
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
        let subject = "Bạn đã đăng ký giấy xác nhận thành công";
        let today = new Date();
        let date = today.getDate() + "-" + parseInt(today.getMonth() + 1) + "-" + today.getFullYear() + " " + today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

        let body = `Bạn đã đăng ký Giấy xác nhận đang học tại trường vào lúc ${date}.<br>Hẹn bạn sau 3 ngày kể từ ngày đăng ký về phòng đào tạo để nhận giấy xác nhận!`;

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
                Alert.alert(`Không gửi được mail, đã có lỗi xảy ra`);
            });
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

    componentWillMount() {
        this._getInfomation();
        this.getdata();
    }

    getdata() {
        var display = [];
        // TODO: Json File data 
        var data = Object.keys(tinh).map((name) => {
            this.tinhArr.push(tinh[name]);
            return (
                <Text>Type of name: {tinh[name].name_with_type}</Text>
            )
        })
        if (this.tinhArr) {
            var len = this.tinhArr.length;
            if (len > 0) {
                for (let i = 0; i < len; i++) {
                    var data = this.tinhArr[i];
                    display.push(data.name_with_type);
                }
            }
            this.setState({
                tinhList: display
            });
        }
    }
    onChangeText = (text) => {
        var display = [];
        this.setState({
            nameHuyen: '',
            nameXa: ''
        })
        if (this.tinhArr) {
            var len = this.tinhArr.length;
            if (len > 0) {
                for (let i = 0; i < len; i++) {
                    var data1 = this.tinhArr[i];
                    if (data1.name_with_type === text) {
                        var data = Object.keys(huyen).map((name) => {
                            if (huyen[name].parent_code === data1.code) {
                                this.huyenArr.push(huyen[name]);
                                display.push(huyen[name].name_with_type);
                            }
                            return (
                                <Text>Type of name: {huyen[name].name_with_type}</Text>
                            )

                        });
                    }
                }
            }
            // if(this.huyenArr){
            //     var len = this.huyenArr.length;
            //     if (len > 0) {
            //     for (let i = 0; i < len; i++) {
            //         var data = this.huyenArr[i];
            //         display.push(data.name);
            //     }
            //     //console.warn(display)
            //     }
            this.setState({
                huyenList: display
            });
            // }   
        }
    }
    onChangeHuyen = (text) => {
        var display = [];
        this.setState({
            nameXa: ''
        })
        if (this.huyenArr) {
            var len = this.huyenArr.length;
            if (len > 0) {
                for (let i = 0; i < len; i++) {
                    var data1 = this.huyenArr[i];
                    if (data1.name_with_type === text) {
                        var data = Object.keys(xa).map((name) => {
                            if (xa[name].parent_code === data1.code) {
                                display.push(xa[name].name_with_type)
                            }
                            return (
                                <Text>Type of name: {xa[name].name_with_type}</Text>
                            )

                        });
                    }
                }
            }
            this.setState({
                xaList: display,
            })
        }
    }
    onChange = () => {
        alert('click');
    }
    render() {
        return (
            <View>
                <HeaderComponent {...this.props}></HeaderComponent>
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
                    <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={{ flex: 1, marginTop: 20, marginBottom: 100, width: '80%' }}>
                        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>ĐỊA CHỈ THƯỜNG TRÚ: </Text>
                        <View style={styles.inputContainer}>
                            <Image style={styles.inputIcon} source={name} />
                            <TextInput style={styles.textInput}
                                placeholder="Số nhà, đường hoặc Thôn"
                                keyboardType="default"
                                underlineColorAndroid='transparent'
                                onChangeText={this._onAddRess.bind(this)}
                            />
                        </View>
                        <TouchableOpacity style={styles.inputContainer} onPress={() => { this.pickerRef1.show() }}>
                            <Image style={styles.inputIcon} source={Address} />
                            <ReactNativePickerModule
                                pickerRef={e => this.pickerRef1 = e}
                                value={this.state.valueTinh}
                                title={"Chọn Tỉnh/Thành"}
                                items={this.state.tinhList}
                                onValueChange={(i) => {
                                    this.onChangeText(this.state.tinhList[i]);
                                    this.setState({
                                        valueTinh: i,
                                        nameTinh: this.state.tinhList[i]
                                    })
                                }}
                            />
                            <TextInput style={styles.textInput} editable={false} placeholder={"Chọn Tỉnh/Thành"}>{this.state.nameTinh}</TextInput>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.inputContainer} onPress={() => { this.pickerRef2.show() }}>
                            <Image style={styles.inputIcon} source={Address} />
                            <ReactNativePickerModule
                                pickerRef={e => this.pickerRef2 = e}
                                value={this.state.valueHuyen}
                                title={"Chọn Quận/Huyện"}
                                items={this.state.huyenList}
                                onValueChange={(i) => {
                                    this.onChangeHuyen(this.state.huyenList[i])
                                    this.setState({
                                        valueHuyen: i,
                                        nameHuyen: this.state.huyenList[i]
                                    })
                                }} />
                            <TextInput style={styles.textInput} editable={false} placeholder={"Chọn Quận/Huyện"}>{this.state.nameHuyen}</TextInput>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.inputContainer} onPress={() => { this.pickerRef3.show() }}>
                            <Image style={styles.inputIcon} source={Address} />
                            <ReactNativePickerModule
                                pickerRef={e => this.pickerRef3 = e}
                                value={this.state.valueXa}
                                title={"Chọn Xã/Phường/T.Trấn"}
                                items={this.state.xaList}
                                onValueChange={(i) => {
                                    this.setState({
                                        valueXa: i,
                                        nameXa: this.state.xaList[i]
                                    })
                                }} />
                            <TextInput style={styles.textInput} editable={false} placeholder={"Chọn Xã/Phường"}>{this.state.nameXa}</TextInput>
                        </TouchableOpacity>
                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                            <Text style={{ fontWeight: "bold", marginRight: 10 }}>NƠI SINH: </Text>
                            <TouchableOpacity style={[styles.inputContainer, { flex: 1 }]} onPress={() => { this.pickerRef4.show() }}>
                                <Image style={styles.inputIcon} source={Address} />
                                <ReactNativePickerModule
                                    pickerRef={e => this.pickerRef4 = e}
                                    value={this.state.valueBirthPlace}
                                    title={"Chọn Tỉnh/Thành"}
                                    items={this.state.tinhList}
                                    onValueChange={(i) => {
                                        this.setState({
                                            valueBirthPlace: i,
                                            birthPlace: this.state.tinhList[i]
                                        })
                                    }}
                                />
                                <TextInput numberOfLines={1} editable={false} style={[styles.textInput, { flex: 1 }]} placeholder={"Chọn Tỉnh/Thành"}>{this.state.birthPlace}</TextInput>
                            </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                            <Text style={{ fontWeight: "bold", marginRight: 10 }}>Sinh viên năm: </Text>
                            <TouchableOpacity style={[styles.inputContainer, { flex: 1 }]} onPress={() => { this.pickerRef5.show() }}>
                                <Image style={styles.inputIcon} source={nganhHoc} />
                                {/* <TextInput style={styles.textInput}
                                    placeholder="1"
                                    keyboardType="number-pad"
                                    keyboardType='numeric'
                                    underlineColorAndroid='transparent'
                                    onChangeText={this._onYearStudent.bind(this)}
                                /> */}
                                <ReactNativePickerModule
                                    pickerRef={e => this.pickerRef5 = e}
                                    value={this.state.yearStudent}
                                    title={"Chọn Năm Học"}
                                    items={this.state.yearStudentList}
                                    onValueChange={(i) => {
                                        this.setState({
                                            yearStudent: (i + 1) * 1
                                        })
                                    }}
                                />
                                <TextInput numberOfLines={1} editable={false} style={[styles.textInput, { flex: 1 }]}>{`${this.state.yearStudent * 1}`}</TextInput>
                            </TouchableOpacity>
                        </View>


                        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 10 }}>
                            <Text style={{ fontWeight: "bold", marginRight: 10 }}>Học kỳ: </Text>
                            <View style={[styles.inputContainer, { flex: 1 }]}>
                                <TextInput style={styles.textInput}
                                    placeholder="I/2015 - 2016"
                                    keyboardType="default"
                                    underlineColorAndroid='transparent'
                                    value={this.state.semester}
                                    onChangeText={(text) => this.setState({
                                        semester: text
                                    })}
                                />
                            </View>
                        </View>

                        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>LÝ DO: </Text>
                        <View style={[styles.inputContainer, { height: 90 }]}>
                            <TextInput style={[styles.textInput, { height: 90 }]}
                                multiline={true}
                                numberOfLines={4}
                                placeholder=""
                                keyboardType="default"
                                underlineColorAndroid='transparent'
                                value={this.state.reason}
                                onChangeText={(text) => this.setState({
                                    reason: text
                                })}
                            />
                        </View>
                        <TouchableOpacity
                            disabled={!(this.state.addRess != "" && this.state.nameTinh != "" && this.state.nameHuyen != "" && this.state.nameXa != "" && this.state.birthPlace != "" && this.state.semester != "" && this.state.reason != "")}
                            style={[styles.buttonContainer]}
                            onPress={() => {
                                this.setModalVisible(true);
                            }}
                        >
                            <Text style={styles.loginText}>Đăng ký</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View >
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
        padding: 10,
        borderRadius: 30,
        borderBottomWidth: 1,
        width: '100%',
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
        borderBottomColor: '#FFFFFF',
        color: "black",
        flex: 1,
    },
    buttonContainer: {
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: '100%',
        borderRadius: 30,
        shadowOffset: { width: 10, height: 10, },
        shadowColor: 'grey',
        shadowOpacity: 1.0,
        backgroundColor: "#00b5ec",
        marginTop: 20
    },
    loginText: {
        color: 'white',
    },
    text: {
        fontSize: 20,
        alignItems: 'center',
        marginLeft: '10%'
    }, icon1: {
        width: 25,
        height: 25
    },
})