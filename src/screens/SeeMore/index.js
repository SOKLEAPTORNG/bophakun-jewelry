import React, {Component} from 'react';
import {StyleSheet, View, FlatList, Image} from 'react-native';

// internal component
import SeeMoreItems from '../../components/Product/SeeMoreItems';
import i18n from '../../../Translations/index';
import {Colors} from '../../constant/index';

var headerTitle = 'See More Detail';

class SeeMore extends Component {
  handleNavigateDetailScreen = (id, title, cat_id) => {
    this.props.navigation.navigate('ProductDetail', {
      prod_id: id,
      headerTitle: title,
      cat_id: cat_id,
    });
  };
  componentDidMount() {
    this.props.navigation.setOptions({
      title: (
        <View>
          <Image
            style={{
              width: 80,
              height: 40,
              resizeMode: 'contain',
            }}
            source={require('../../assets/logo.png')}
          />
        </View>
      ),
      headerStyle: {
        shadowOffset: {height: 0, width: 0},
        backgroundColor: Colors.primary,
        height: Platform.OS === 'android' ? 75 : 120,
      },
    });
  }

  render() {
    const {seeMore, product, available_promotions} = this.props.route.params;
    console.log('seemore ', seeMore);
    console.log('product ', product);
    console.log('available_promotions ', available_promotions);

    return (
      <View style={{padding: 10}}>
        <FlatList
          data={product}
          showsVerticalScrollIndicator={false}
          numColumns={3}
          keyExtractor={item => item.id.toString()}
          renderItem={(item, index) => {
            return (
              <SeeMoreItems
                key={index}
                promotion={available_promotions}
                cat_id={item.item.category_id}
                name={item.item.name}
                image={item.item.image}
                price={item.item.price}
                navigation={() =>
                  this.handleNavigateDetailScreen(
                    item.item.id,
                    item.item.name,
                    item.item.category_id,
                  )
                }
                isLoading={false}
              />
            );
          }}
        />
      </View>
    );
  }
}

export default SeeMore;
export const screenOptions = () => {
  return {
    //   headerTitle: headerTitle,
    headerTitle: (
      <Image
        style={{
          width: 120,
          height: 60,
          resizeMode: 'contain',
        }}
        source={require('../../assets/logo.png')}
      />
    ),
  };
};

const styles = StyleSheet.create({
  containter: {
    flex: 1,
    padding: 10,
  },
});
