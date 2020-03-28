import React from 'react';
import PropTypes from 'prop-types';
import {
  Dimensions,
  FlatList,
  TouchableHighlight,
  View,
  StyleSheet,
  ViewPropTypes
} from 'react-native';

import { ifIphoneX } from 'react-native-iphone-x-helper';

import Constants from './constants';
import { Photo } from './media';

// 1 margin and 1 border width
const ITEM_MARGIN = 2;

export default class GridContainer extends React.Component {

  static propTypes = {
    style: ViewPropTypes.style,
    mediaList: PropTypes.array.isRequired,
    square: PropTypes.bool,
    displaySelectionButtons: PropTypes.bool,
    onPhotoTap: PropTypes.func,
    itemPerRow: PropTypes.number,

    /*
     * refresh the list to apply selection change
     */
    onMediaSelection: PropTypes.func,

    /**
     * offsets the width of the grid
     */
    offset: PropTypes.number,
  };

  static defaultProps = {
    displaySelectionButtons: false,
    onPhotoTap: () => {},
    itemPerRow: 3,
  };

  keyExtractor = item => {
    if (item.id) {
      return `id-${item.id}`;
    } else if (item.thumb) {
      return `${item.thumb}`;
    } else {
      return `${item.photo}`;
    }
  }

  renderItem = ({ item, index }) => {
    const {
      displaySelectionButtons,
      onPhotoTap,
      onMediaSelection,
      itemPerRow,
      square,
      offset,
    } = this.props;
    const screenWidth = Dimensions.get('window').width - offset;
    const photoWidth = (screenWidth / itemPerRow) - (ITEM_MARGIN * 2);

    return (
      <TouchableHighlight onPress={() => onPhotoTap(index)}>
        <View style={styles.row}>
          <Photo
            width={photoWidth}
            height={square ? photoWidth : 100}
            resizeMode={'cover'}
            thumbnail
            progressImage={require('../Assets/hourglass.png')}
            displaySelectionButtons={displaySelectionButtons}
            uri={item.thumb || item.photo}
            selected={item.selected}
            onSelection={(isSelected) => onMediaSelection(item, index, isSelected)}
          />
        </View>
      </TouchableHighlight>
    );
  }

  render() {
    const { mediaList } = this.props;

    return (
      <View style={styles.container}>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={mediaList}
          initialNumToRender={21}
          numColumns={3}
          renderItem={this.renderItem}
          removeClippedSubviews={false}
          getItemLayout={this.getItemLayout}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: ifIphoneX(18, 0),
    paddingBottom: Constants.TOOLBAR_HEIGHT,
  },
  row: {
    justifyContent: 'center',
    margin: 1,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 1,
  },
});
