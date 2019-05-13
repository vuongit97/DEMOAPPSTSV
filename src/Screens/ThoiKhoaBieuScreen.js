import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, Alert, ScrollView, AsyncStorage } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import HeaderComponent from '../Components/HeaderComponent';
import env from '../environment/env';
const BASE_URL = env;
var STORAGE_KEY = 'key_access_token';
const tkb = require('../Images/tkbIcon.png')

export default class ThoiKhoaBieuScreen extends Component {
  static navigationOptions = {
    drawerIcon: ({ icon }) => (
      <Image source={tkb} resizeMode="contain" style={[styles.icon1]} />
    )
  };

  componentWillMount = async () => {
    const userToken = await AsyncStorage.getItem(STORAGE_KEY);
    let url = BASE_URL + 'Account/GetSchedule';
    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + userToken,
      },
    })
      .then((res) => res.json())
      .then((resJson) => {
        this.setState({ data: resJson })
        for (let i = 0; i < resJson.length; i++) {
          for (let j = 0; j < resJson[i].listSubjectClassScheduleReturnModel.length; j++) {
            this.setState({
              tableData: [...this.state.tableData,
              [
                resJson[i].listSubjectClassScheduleReturnModel[j].code,
                resJson[i].listSubjectClassScheduleReturnModel[j].name,
                resJson[i].day_Of_Week,
                `${resJson[i].listSubjectClassScheduleReturnModel[j].lessonStart}`,
                `${resJson[i].listSubjectClassScheduleReturnModel[j].lessonEnd}`,
                resJson[i].listSubjectClassScheduleReturnModel[j].lecturerName,
              ]
              ]
            });
          }
        }
      });
  }
  constructor(props) {
    super(props);
    this.state = {
      tableHead: ['Lớp', 'Môn học', 'Thứ', 'Từ tiết', 'Đến tiết', 'Giảng viên'],
      widthArr: [100, 160, 60, 60, 60, 160],
      tableData: [],
    }
  }

  render() {
    return (
      <View style={{ flex: 1, }}>
        <HeaderComponent {...this.props}></HeaderComponent>
        <View style={styles.container}>
          <ScrollView horizontal={true}>
            <View>
              <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                <Row data={this.state.tableHead} widthArr={this.state.widthArr} style={styles.header} textStyle={styles.text} />
              </Table>
              <ScrollView style={styles.dataWrapper}>
                <Table borderStyle={{ borderColor: '#C1C0B9' }}>
                  {
                    this.state.tableData && this.state.tableData.length > 0 ?
                      this.state.tableData.map((rowData, index) => (
                        <Row
                          key={index}
                          data={rowData}
                          widthArr={this.state.widthArr}
                          style={[styles.row, index % 2 && { backgroundColor: '#F7F6E7' }]}
                          textStyle={styles.text}
                        />
                      ))
                      :
                      <Row
                        key={1}
                        data={["Loading..."]}
                        widthArr={[600]}
                        style={{ height: 40, backgroundColor: '#F7F6E7' }}
                        textStyle={styles.text}
                      />
                  }
                </Table>
              </ScrollView>
            </View>
          </ScrollView>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  icon1: {
    width: 25,
    height: 25
  },
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  header: { height: 50, backgroundColor: '#537791' },
  text: { textAlign: 'center', fontWeight: '100' },
  dataWrapper: { marginTop: -1 },
  row: { height: 40, backgroundColor: '#E7E6E1' }
});