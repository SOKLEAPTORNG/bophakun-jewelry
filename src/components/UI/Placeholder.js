import React, {useState, useEffect, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import Text from '../../components/UI/DefaultText';
import {useTheme} from '@react-navigation/native';
import {Fade, Placeholder, PlaceholderLine, ShineOverlay} from 'rn-placeholder';
import {styles as style} from '../Product/CategoriesItems';
import {styles} from '../../components/Product/PopularItems';
import {styles as stylex} from '../Product/RecommendItems';
const PopularItems = (props) => {
  const theme = useTheme();
  const {colors} = theme;
  return (
    <View style={{...styles.container}}>
      <Placeholder Animation={ShineOverlay}>
        <PlaceholderLine style={styles.imgContainer} />
        <View style={{...styles.content}}>
          <PlaceholderLine width={90} />
          <PlaceholderLine width={30} />
        </View>
      </Placeholder>
    </View>
  );
};

export default PopularItems;
export const CategoryPlaceholder = () => {
  return (
    <View style={{...style.container, paddingLeft: 20}}>
      <Placeholder Animation={Fade}>
        <PlaceholderLine
          style={{...style.iconContainer, backgroundColor: '#ddd'}}
        />
        <PlaceholderLine width={80} height={8} />
      </Placeholder>
    </View>
  );
};
export const RecommendItemsPlaceholder = () => {
  return (
    <View
      style={{
        ...stylex.container,
      }}>
      <Placeholder Animation={ShineOverlay}>
        <PlaceholderLine style={stylex.imgContainer} />
        <View style={{...stylex.content}}>
          <PlaceholderLine width={60} />
          <PlaceholderLine width={25} />
        </View>
      </Placeholder>
    </View>
  );
};
