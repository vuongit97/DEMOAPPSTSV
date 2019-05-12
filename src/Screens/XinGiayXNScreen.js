import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableHighlight, TouchableOpacity, ScrollView, Linking } from 'react-native';
import HeaderComponent from '../Components/HeaderComponent';
import ReactNativePickerModule from 'react-native-picker-module';
import qs from 'qs';

const xinGiay = require('../Images/xinGiay.png');
const nganhHoc = require('../Icons/nganhHocIcon.png');
const Address = require('../Icons/address.png');
const name = require('../Icons/name.png');
const tinh = require('../access/Tinh.json');
const huyen = require('../access/quan_huyen.json');
const xa = require('../access/xa_phuong.json');

async function sendEmail(to, subject, body, options = {}) {
    const { cc, bcc } = options;

    let url = `mailto:${to}`;

    // Create email link query
    const query = qs.stringify({
        subject: subject,
        body: body,
        cc: cc,
        bcc: bcc
    });

    if (query.length) {
        url += `?${query}`;
    }

    // check if we can use this link
    const canOpen = await Linking.canOpenURL(url);

    if (!canOpen) {
        throw new Error('Provided URL can not be handled');
    }

    return Linking.openURL(url);
}


export default class XinGiayXNScreen extends Component {
    static navigationOptions = {
        drawerIcon: ({ icon }) => (
            <Image source={xinGiay} resizeMode="contain" style={[styles.icon1]} />
        )
    };
    constructor(props) {
        super(props);
        this.state = {
            fullName: '',
            addRess: '',
            yearStudent: 1,
            valueRole: null,
            Role: ['Male', 'Female'],
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

    _onPressConfirm = () => {
        // console.log(`${this.state.addRess != ""} ${this.state.nameTinh} ${this.state.nameHuyen} ${this.state.nameXa} ${this.state.birthPlace} ${this.state.semester} ${this.state.reason}`);
        console.log(this.state.addRess != "" && this.state.nameTinh != "" && this.state.nameHuyen != "" && this.state.nameXa != "" && this.state.birthPlace != "" && this.state.semester != "" && this.state.reason != "");
        let to = "vuongit97@gmail.com";
        let subject = "Xin giấy xác nhận";
        let body =
`- Địa chỉ: ${this.state.addRess}
- Tỉnh/Thành phố: ${this.state.nameTinh}
- Huyện/quận: ${this.state.nameHuyen}
- Xã/phường: ${this.state.nameXa}
- Nơi sinh: ${this.state.birthPlace}
- Sinh viên năm: ${this.state.yearStudent}
- Học kỳ: ${this.state.semester}
- Lý do: ${this.state.reason}`;

        sendEmail(
            to,
            subject,
            body,
        ).then(() => {
            console.log('Our email successful provided to device mail ');
        });
    }

    componentWillMount() {
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
                    <ScrollView showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} style={{ flex: 1, marginTop: 20, marginBottom: 100, width: '80%' }}>
                        <Text style={{ fontWeight: "bold", marginBottom: 10 }}>ĐỊA CHỈ THƯỜNG TRÚ: </Text>
                        <View style={styles.inputContainer}>
                            <Image style={styles.inputIcon} source={name} />
                            <TextInput style={styles.textInput}
                                placeholder="Số nhà, đường hoặc Thôn"
                                placeholderTextColor={"black"}
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
                            <TextInput style={styles.textInput} editable={false} placeholder={"Chọn Tỉnh/Thành"}
                                placeholderTextColor={"black"}>{this.state.nameTinh}</TextInput>
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
                            <TextInput style={styles.textInput} editable={false} placeholder={"Chọn Quận/Huyện"}
                                placeholderTextColor={"black"}>{this.state.nameHuyen}</TextInput>
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
                            <TextInput style={styles.textInput} editable={false} placeholder={"Chọn Xã/Phường"}
                                placeholderTextColor={"black"}>{this.state.nameXa}</TextInput>
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
                                            valueTinh: i,
                                            birthPlace: this.state.tinhList[i]
                                        })
                                    }}
                                />
                                <TextInput numberOfLines={1} editable={false} style={[styles.textInput, { flex: 1 }]} placeholder={"Chọn Tỉnh/Thành"}
                                    placeholderTextColor={"black"}>{this.state.birthPlace}</TextInput>
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
                                    placeholderTextColor={"black"}
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
                                placeholderTextColor={"black"}
                                keyboardType="default"
                                underlineColorAndroid='transparent'
                                value={this.state.reason}
                                onChangeText={(text) => this.setState({
                                    reason: text
                                })}
                            />
                        </View>
                        <TouchableHighlight disabled={!(this.state.addRess != "" && this.state.nameTinh != "" && this.state.nameHuyen != "" && this.state.nameXa != "" && this.state.birthPlace != "" && this.state.semester != "" && this.state.reason != "")} style={[styles.buttonContainer]} onPress={this._onPressConfirm.bind(this)}>
                            <Text style={styles.loginText}>Đăng ký</Text>
                        </TouchableHighlight>
                    </ScrollView>
                </View>
            </View>
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