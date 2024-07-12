import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {Colors as Color, IMAGE_PATH} from '../../constant/index';
import {useSelector} from 'react-redux';
import Text from '../UI/DefaultText';
const ItemLists = (props) => {
  const [imgURL, setImgURL] = React.useState('');
  const [heart_icon, setHeart_icon] = React.useState('');
  //   const items = useSelector((state) => state.favorite.favorite);
  // const favId = items.map((d) => d.prod_id);
  const fetchImage = async () => {
    let path = IMAGE_PATH;
    let getImage = props.image;
    let imageUrl = '';
    if (getImage === null) {
      imageUrl = `${path}/img/default.png`;
    } else {
      imageUrl = `${path}/uploads/img/${getImage}`;
    }
    setImgURL(imageUrl);
  };
  // const setDefualtHeartIcons = () => {
  //   const id = items.map((d) => d.prod_id);
  //   if (props.id === id) {
  //     setHeart_icon('heart');
  //   }
  // };
  React.useEffect(() => {
    fetchImage();
    // setDefualtHeartIcons();
  }, []);
  return (
    <View style={styles.mealItem}>
      <TouchableOpacity onPress={props.navigation}>
        <View>
          <View style={{...styles.mealRow, ...styles.mealHeader}}>
            <ImageBackground source={{uri: imgURL}} style={styles.bgImage}>
              <View style={styles.wrappHeartIcon}>
                <TouchableOpacity onPress={props.onToggleFav}>
                  <FontAwesome
                    name={props.imageName}
                    size={24}
                    color={Color.primary}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.titleContainer}>
                <Text style={styles.title} numberOfLines={1}>
                  {props.name} 
                </Text>
              </View>
            </ImageBackground>
          </View>
          <View style={{...styles.mealRow, ...styles.mealDetail}}>
            <Text style={styles.price}>{Number(props.price).toFixed(2)}</Text>
            <Text style={styles.price}>$$</Text>
            {/* <Text></Text> */}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mealItem: {
    height: 250,
    width: '100%',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 10
  },
  wrappHeartIcon: {
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    zIndex: 10,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  price: {
    fontSize: 16,
    fontWeight: '300',
    opacity: 0.5,
  },
  bgImage: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  mealRow: {
    flexDirection: 'row',
  },
  mealHeader: {
    height: '85%',
  },
  mealDetail: {
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '15%',
  },
  titleContainer: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  title: {
    // fontFamily: 'open-sans-bold',
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default ItemLists;
