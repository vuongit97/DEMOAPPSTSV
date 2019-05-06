import React from 'react';
import { createDrawerNavigator, createAppContainer } from 'react-navigation';
import MainScreen from '../Screens/MainScreen';
import ChangePassScreen from '../Screens/ChangePassScreen';
import UpdateScreen from '../Screens/UpdateScreen';
import XinGiayXNScreen from '../Screens/XinGiayXNScreen';
import XinBangDiemScreen from '../Screens/XinBangDiemScreen';
import ThoiKhoaBieuScreen from '../Screens/ThoiKhoaBieuScreen';
import SiderBarComponent from '../Components/SideBarComponent';

const NavigationProfile = (props) => (
  <SiderBarComponent {...props}></SiderBarComponent>
)

const MyDrawerNavigator = createDrawerNavigator({
  Home: {
    screen: MainScreen, navigationOptions: { header: null, title: "Trang chủ", }
  },
  ChangePass: {
    screen: ChangePassScreen, navigationOptions: { header: null, title: "Đổi mật khẩu", }
  },
  Update: {
    screen: UpdateScreen, navigationOptions: { header: null, title: "Cập nhật thông tin", }
  },
  XinGiayXN: {
    screen: XinGiayXNScreen, navigationOptions: { header: null, title: "Xin giấy xác nhận", }
  },
  XinBangDiem: {
    screen: XinBangDiemScreen, navigationOptions: { header: null, title: "Xin bảng điểm", }
  },
  XemTKB: {
    screen: ThoiKhoaBieuScreen, navigationOptions: { header: null, title: "Xem thời khoá biểu", }
  },
},
  {
    initialRouteName: 'Home',
    contentComponent: NavigationProfile // edit drawer stack
  }
);

const MyApp = createAppContainer(MyDrawerNavigator);
export default MyApp;