import React from 'react';
// import {PLACEHOLDER_IMAGE} from '../../image/index';
import {
  Content,
  List,
  ListItem,
  Thumbnail,
  Text,
  Left,
  Body,
} from 'native-base';
import {IMAGE_PATH} from '../../constant/index';
export default (props) => {
  return (
    <Content>
      <List>
        <ListItem
          thumbnail
          onPress={() =>
            props.navigation.navigate('ProductDetail', {
              prod_id: props.id,
              headerTitle: props.name,
              // product_cat_id: props.prod_cat_id,
            })
          }>
          <Left>
            <Thumbnail
              square
              source={{
                uri: `${IMAGE_PATH}/${props.image}`,
              }}
            />
          </Left>
          <Body>
            <Text>{props.name}</Text>
          </Body>
        </ListItem>
      </List>
    </Content>
  );
};
