import React from 'react';
import {View} from 'react-native-animatable';
import {FlatList} from 'react-native-gesture-handler';
import PromoItems from '../Promotions/PromoItems';
import TouchableCmp from '../../components/UI/TouchableCmp';

function promotionItems(props) {
  return (
    <View>
      <FlatList
        style={styles.flatlist}
        data={promotions}
        keyExtractor={item => item.id.toString()}
        refreshing={refreshing}
        onRefresh={_onRefresh}
        renderItem={items => {
          const create_date = moment(items.item.create_at).format(
            'MMMM Do YYYY',
          );
          return (
            <PromoItems
              style={{
                elevation: 4,
              }}
              name={items.item.name}
              description={items.item.description}
              createAt={create_date}
              onSelect={() =>
                navigate('PromoDetail', {
                  id: items.item.id,
                })
              }
            />
          );
        }}
      />
    </View>
  );
}

export default promotionItems;
