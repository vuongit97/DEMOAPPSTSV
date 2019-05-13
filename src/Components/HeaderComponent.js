import React, { Component } from 'react';
import {
  View, Image, TouchableOpacity, Text
} from 'react-native';

export default class HeaderComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      routerName: "",
    }
  }

  componentWillMount() {
    this._handleTitleHeader();
  }

  _handleTitleHeader() {
    if (this.props.navigation.state.key == 'Home') {
      this.setState({
        routerName: "Trang chủ",
      });
    }
    else if (this.props.navigation.state.key == 'ChangePass') {
      this.setState({
        routerName: "Đổi mật khẩu",
      });
    }
    else if (this.props.navigation.state.key == 'Update') {
      this.setState({
        routerName: "Cập nhật thông tin",
      });
    }
    else if (this.props.navigation.state.key == 'XinGiayXN') {
      this.setState({
        routerName: "Xin giấy xác nhận",
      });
    }
    else if (this.props.navigation.state.key == 'XinBangDiem') {
      this.setState({
        routerName: "Xin bảng điểm",
      });
    }
    else if (this.props.navigation.state.key == 'XemTKB') {
      this.setState({
        routerName: "Xem thời khoá biểu",
      });
    }
    else {
      this.setState({
        routerName: "",
      });
    }
  }

  componentDidMount() {
    this.props.navigation.closeDrawer();
  }

  render() {
    return (
      <View style={{
        height: 70,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#29ACE4'
      }}
      >
        <TouchableOpacity
          style={{ marginLeft: 7, marginTop: 7 }}
          onPress={() => this.props.navigation.openDrawer()}>
          <Image
            style={{ width: 40, height: 40, marginTop: 20 }}
            source={require('../Icons/menuIcon.png')}
          />
        </TouchableOpacity>
        <Text style={{ position: 'absolute', left: '20%', fontWeight: '700', fontSize: 25, color: 'black', top: 30 }}>{this.state.routerName}</Text>
      </View>
    );
  }
}