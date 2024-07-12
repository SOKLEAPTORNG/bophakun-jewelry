import {StyleSheet} from 'react-native';
const IMAGE_HEIGHT = 200;
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: IMAGE_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 10,
  },
  textTitle: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '600',
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  text: {
    fontWeight: '300',
    lineHeight: 25,
    paddingTop: 5,
    fontSize: 16,
  },
});
