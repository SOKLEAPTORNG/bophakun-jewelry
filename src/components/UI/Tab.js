import React, {Fragment} from 'react';
import {StyleSheet, Platform} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Tab} from 'native-base';
import PropTypes from 'prop-types';
const propTypes = {
  heading: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.node,
  ]),
  onChangeTab: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.node,
    PropTypes.func,
  ]),
};

const CustomTab = ({heading, children}) => {
  const theme = useTheme();
  const activeTabStyle = {
    ...styles.tabStyle,
    backgroundColor: theme.dark ? '#333' : '#ffff',
  };
  const activeTextStyle = {
    ...styles.textStyle,
    color: theme.dark ? '#fff' : '#333',
  };
  const tabStyle = {backgroundColor: theme.dark ? '#333' : '#ffff'};
  return (
    <Tab
      heading={heading}
      activeTextStyle={{...activeTextStyle}}
      activeTabStyle={{...activeTabStyle}}
      tabStyle={{...tabStyle}}>
      {children}
    </Tab>
  );
};
CustomTab.propTypes = propTypes;
export default CustomTab;
const styles = StyleSheet.create({
  activeTextStyle: {
    color: '#333',
    textTransform: 'capitalize',
    fontFamily: 'OpenSans-Regular',
    fontSize: Platform.OS === 'android' ? 14 : 13,
  },
  textStyle: {
    textTransform: 'capitalize',
    fontFamily: 'OpenSans-Regular',
    fontSize: Platform.OS === 'android' ? 14 : 13,
  },
  tabStyle: {
    backgroundColor: '#fff',
  },
  text: {
    fontFamily: 'OpenSans-Bold',
    opacity: 0.5,
  },
});
