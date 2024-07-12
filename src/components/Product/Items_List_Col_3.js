import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Image} from 'react-native'; 
import {IMAGE_PATH, SCREEN_WIDTH} from '../../constant/index';
import ExtraTouchable from '../UI/TouchableCmp';
import Text from '../UI/DefaultText';
import {Placeholder, PlaceholderLine} from 'rn-placeholder';
import PropTypes from 'prop-types';
import {useTheme} from '@react-navigation/native';
const propTypes = {
  name: PropTypes.string.isRequired,
  image: PropTypes.oneOfType([PropTypes.string]),
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  navigation: PropTypes.func,
  isLoading: PropTypes.bool,
  promotion: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  cat_id: PropTypes.number,
};
const ListItems = ({
  navigation,
  name,
  image,
  price,
  isLoading,
  promotion,
  cat_id,
}) => {
  const [state, setState] = useState({
    discount_value: 0,
    discount_percentage: 0,
    discount_type: '',
  });
  const available_promotions = promotion.filter(
    (d) => d.category_id === cat_id,
  );
  const theme = useTheme();

  useEffect(() => {
    if (available_promotions.length > 0) {
      available_promotions.map((d) => {
        let discount;
        if (d.discount_type === 'fixed') {
          discount = d.discount_amount;
        } else {
          discount = (price * d.discount_amount) / 100;
        }
        setState({
          ...state,
          discount_value: discount,
          discount_percentage: Number.parseFloat(d.discount_amount),
          discount_type: d.discount_type,
        });
      });
    }
  }, [promotion]);
  if (isLoading) {
    return (
      <View>
        <Placeholder Animation={Placeholder}>
          <View style={styles.container}>
            <PlaceholderLine style={styles.imageContainer} />
          </View>
        </Placeholder>
      </View>
    );
  }
  return (
    <ExtraTouchable onPress={navigation}>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: !image
                ? `${IMAGE_PATH}/img/default.png`
                : `${IMAGE_PATH}/uploads/img/${image}`,
            }}
            style={styles.img}
          />
        </View>
        <View 
        style={styles.wrappTitle}
        >
          <Text style={styles.label}>
            {' '}
            {name}
          </Text>
        </View> 
        <Text
          style={{...styles.price, backgroundColor: theme.colors.background, marginLeft: 10}}>
          {state.discount_value > 0 ? (
           <View style={{flexDirection: 'row'}}>
           <Text>
             ${' '}
             <Text style={{paddingLeft: 15,color: '#e4482d' }}>
             {Number.parseFloat(price - state.discount_value).toFixed(2)}
            </Text>
            {'  '}
             <Text
               style={{textDecorationLine: 'line-through', opacity: 0.5}}>
               ($ {Number.parseFloat(price).toFixed(2)})
             </Text> 
           </Text>
           
         </View>
          ) : (
            <Text style={{color: '#e4482d'}}> $ {Number.parseFloat(price).toFixed(2)}</Text>
          )}
        </Text>
      </View>
    </ExtraTouchable>
  );
};
ListItems.propTypes = propTypes;
export default ListItems;
const styles = StyleSheet.create({
  container: {
    height: 180, 
    width: 120,
    marginLeft: 10,
    borderRadius: 3, 
    position: 'relative',
    backgroundColor:'#fff',
  },
  img: {
    height: 120, 
    width: 120,
    resizeMode: 'cover', 
  },
  imageContainer: {
    height: 120, 
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', 

  },
  wrappTitle: {
    padding: 10,
    paddingBottom:0,
    alignItems: 'flex-start', 
    justifyContent: 'space-evenly',
  },
  label: {
    fontSize: 12,
  },
  price: { 
    top: 0,
    fontSize: 12,
    fontWeight: '700',
    color: '#333', 
    opacity: 0.9,
    paddingTop:0,
    padding: 5,
  },
  icon: {
    width: 20,
    height: 10,
    margin: 10,
    marginRight: 30,
    borderRadius: 50,
  },
});
