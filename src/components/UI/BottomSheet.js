import React from 'react';
import BottomSheet from 'reanimated-bottom-sheet';
import Text from './DefaultText';
import {View, StyleSheet, Platform} from 'react-native';
import Icons from 'react-native-vector-icons/FontAwesome5';
import PropTypes from 'prop-types';
import {useTheme} from '@react-navigation/native';
import {sheetRef} from '../../navigation/RootNavigation';
const propTypes = {
  ref: PropTypes.func,
  children: PropTypes.node,
};
const CustomBottomSheet = ({ref, children}) => {
  const theme = useTheme();
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );
  const renderContent = () => (
    <View
      style={{...styles.container, backgroundColor: theme.colors.background}}>
      <View style={{alignItems: 'center', justifyContent: 'center'}}>
        <Icons name="minus" size={30} color="#ddd" />
      </View>

      {children}
    </View>
  );
  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={[250, 0]}
      initialSnap={1}
      renderHeader={renderHeader}
      renderContent={renderContent}
      enabledGestureInteraction={Platform.OS === 'ios' ? true : false}
    />
  );
};
CustomBottomSheet.propTypes = propTypes;
export default CustomBottomSheet;
const styles = StyleSheet.create({
  container: {
    zIndex: 2,
    padding: 10,
    marginVertical: 2.5,
    marginBottom: 5,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0.5, height: 0.5},
    shadowOpacity: 0.5,
    shadowRadius: 1.5,
    elevation: 2.5,
    height: 250,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
