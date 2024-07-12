import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {StyleSheet, View, Text, ScrollView} from 'react-native';
import {
  navigate,
  loadRef,
  _onLoading,
  _onLoadingFinish,
} from '../../navigation/RootNavigation';

import i18n from '../../../Translations/index';
import Placeholder, {
  CategoryPlaceholder,
  RecommendItemsPlaceholder,
} from '../../components/UI/Placeholder';
import CategoriesItems from '../../components/Product/CategoriesItems';
import { Colors } from '../../constant';
import { blue } from 'react-native-redash';

function NewCategories(props) {
  const [qtyAvailables, setQtyAvailables] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const categories = useSelector(state => state.product.product_type);
  const catItems = Array(4)
    .fill()
    .map((_, index) => ({id: index}));

  const handleNavigateCategoriesScreen = (id, name) => {
    props.navigation.navigate('ItemList', {
      cat_id: id,
      name: name,
    });
  };

  return (
    <ScrollView style={{flex: 1}}>
      <View style={styles.containertwocol}>
        {isLoading
          ? catItems.map(d => <CategoryPlaceholder key={d.id} />)
          : categories.map(item => {
              // console.log(item.id);
              return (
                <CategoriesItems
                  key={item.id}
                  id={item.id}
                  title={item.name}
                  image={item.image}
                  navigation={() =>
                    handleNavigateCategoriesScreen(item.id, item.name)
                  }
                />
              );
            })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  containertwocol: {
    flex: 1,
    paddingTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'rgba(132,156,185,0.2)',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 8,
    paddingBottom: 100
  },
});

export const screenOptions = nav => {
  return {
    headerTitle: i18n.t('home.Categories'),
  };
};
export default NewCategories;
