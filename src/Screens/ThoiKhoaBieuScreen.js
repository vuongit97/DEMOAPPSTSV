import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableHighlight, Image, Alert, ScrollView, AsyncStorage } from 'react-native';
import { Table, TableWrapper, Row, Rows, Col } from 'react-native-table-component';
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

  componentDidMount = async () => {
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
        console.log("red", resJson);
        this.setState({ data: resJson })
        // var tableHead = [];
        // for (let i = 0; i < resJson.length; i++) {
        //    tableHead.push
        // }
        // console.warn(resJson);
      });
  }
  constructor(props) {
    super(props);
    this.state = {
      // tableHead: [' Tiết ', 'Sáng', 'Phòng', 'Chiều', 'Phòng'],
      // tableTitle: ['Tiết 1', 'Tiết 2', 'Tiết 3', 'Tiết 4', 'Tiết 5'],
      // tableData: [
      //   ['Ly', '2', 'Hoa', '4'],
      //   ['', '7', 'Toan', '0'],
      //   ['', '', '', ''],
      //   ['', '', '', ''],
      //   ['', '', '', ''],
      // ]
      data: []
    }
  }

  render() {
    var { data } = this.state;
    console.log("data", data);
    return (
      <View style={{ flex: 1, }}>
        <HeaderComponent {...this.props}></HeaderComponent>
        {/* <View style={styles.container}> */}
        {/* <Table>
            <Row data={this.state.tableHead} flexArr={[1, 2, 1, 2, 1]} style={styles.head} textStyle={styles.text} />
            <TableWrapper style={styles.wrapper}>
              <Col data={this.state.tableTitle} style={styles.title} textStyle={styles.text} />
              <Rows data={this.state.tableData} flexArr={[2, 1, 2, 1]} style={styles.row} textStyle={styles.text} />
            </TableWrapper>
          </Table> */}
        {
          (data.length != 0) ?
            <ScrollView
            // style={{ backgroundColor: 'red' }}
            >
              {
                data.map((item, index) => {
                  var { day_Of_Week, listSubjectClassScheduleReturnModel } = item;
                  return (
                    <View key={index}
                      style={{ margin: 10, borderRadius: 5, backgroundColor: '#f1f8ff', padding: 8 }}
                    >
                      <Text>Thứ {day_Of_Week}</Text>

                      {
                        listSubjectClassScheduleReturnModel.length != 0 ?
                          <View style={{ flex: 1 }}>
                            {
                              listSubjectClassScheduleReturnModel.map((itemList, key) => {
                                var { code, name, lessonStart, lessonEnd } = itemList;
                                return (
                                  <View styles={{ flexDirection: 'row', }} key={key}>
                                    <Text>Mã lớp: {code}</Text>
                                    <Text>Tên học phần: {name}</Text>
                                    <Text>Tiết: {lessonStart}-{lessonStart}</Text>
                                  </View>
                                )
                              })
                            }
                          </View>
                          : <Text>Trống</Text>
                      }

                    </View>
                  )
                })
              }
            </ScrollView> : null
        }

        {/* </View> */}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  wrapper: { flexDirection: 'row' },
  title: { flex: 1, backgroundColor: '#f6f8fa', height: 140 },
  row: { height: 28 },
  text: { textAlign: 'center' },
  icon1: {
    width: 25,
    height: 25
  },
});