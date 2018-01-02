import _ from 'underscore'
import { FlatList, Dimensions } from 'react-native'
import Modal from 'react-native-modal'
import React from 'react';
import { Alert, Button, Clipboard, StyleSheet, Text, View } from 'react-native';
import {Image, TextInput, TouchableHighlight, ScrollView} from 'react-native'
import debounce from 'debounce'
import Config from './config'
import StatusBarBackground from './status-bar-background'
import rower from './rower'

// https://stackoverflow.com/questions/41056761/detect-scrollview-has-reached-the-end/41058382
const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
  const paddingToBottom = 400;
  return layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom;
};

export default class App extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      query: '',
      results: [],
      rows: [],
      modal_visible: false,
      loaded_offsets: {},
      layout_measurement: null,
      content_offset: {x: 0, y: 0},
      content_size: null,
    }
    
    this.fetch = debounce(this.fetch, 1000)
  }
  
  render() {
    return (
      <View style={styles.container} onLayout={this.layout_did_change.bind(this)}>
      
        <StatusBarBackground style={{backgroundColor:'#191970'}}/>
        
        <Text style={styles.header}>
          Giphy Search
        </Text>
        
        <TextInput style={styles.query}
          value={this.state.query}
          placeholder='Search...'
          onChangeText={this.query_did_change.bind(this)}
        />
        
        <FlatList style={{width: '100%'}}
          onScroll={this.did_scroll.bind(this)}
          data={this.state.rows}
          renderItem={({item}) => {
            const {index, entries} = item
            const height = parseInt(entries[0].images.fixed_height.height)
            if (height * index - this.state.content_offset < -1000 ||
              height * index - this.state.content_offset > 1000)
            {
              return <View/>
            }
            
            return <View style={styles.images}>
              {entries.map((result, result_index) => (
                result.images ?
                <View key={result_index} style={{
                  width: parseInt(result.images.fixed_height.width) + 6,
                  height: parseInt(result.images.fixed_height.height) + 6,
                }}>
                  <TouchableHighlight
                    onLongPress={this.image_did_long_press.bind(this, result)}
                  >
                    <Image
                      source={{uri: result.images.fixed_height.url}}
                      style={{
                        alignSelf: 'center',
                        width: parseInt(result.images.fixed_height.width),
                        height: parseInt(result.images.fixed_height.height),
                      }}
                    />
                  </TouchableHighlight>
                </View>
                : null
              ))}
            </View>
          }}
        />
        
        <Modal isVisible={this.state.modal_visible}
          onBackdropPress={this.backdrop_did_press.bind(this)}
        >
          <View style={{ backgroundColor: '#fff' }}>
            <Button
              title='Copy URL'
              onPress={this.copy_did_press.bind(this)}
            />
          </View>
        </Modal>        
      </View>
    );
  }
  
  layout_did_change() {
    const rows = rower({
      results: _.filter(this.state.results, result => result.images),
      image_fn: result => result.images.fixed_height,
      // https://stackoverflow.com/questions/30203154/get-size-of-a-view-in-react-native
      container_width: Dimensions.get('window').width,
      padding: 6,
    })
    this.setState({rows: rows})
  }
  
  query_did_change(text) {
    this.setState({query: text})
    this.fetch(text)
  }
  
  fetch(query, offset) {
    offset = offset || 0
    if (offset && this.state.loaded_offsets[offset]) {
      return
    }
    
    this.state.loaded_offsets[offset] = true
    fetch(`https://api.giphy.com/v1/gifs/search?q=${query}&api_key=${Config.api_key}&offset=${offset}`)
    .then(response => response.json())
    .then(payload => {
      let results
      if (offset == 0) {
        results = payload.data
        this.setState({loaded_offsets: {}})
      } else {
        results = [...this.state.results, ...payload.data]
      }
      const rows = rower({
        results: _.filter(results, result => result.images),
        image_fn: result => result.images.fixed_height,
        container_width: Dimensions.get('window').width,
        padding: 6,
      })
      this.setState({
        results: results,
        rows: rows,
        query: query,
        offset: offset,
      })
    })
    .catch(response => {
      this.setState({
        error: response.message,
      })
    })
    this.setState({
      results: [...this.state.results, query],
    })
  }
  
  image_did_long_press(gif) {
    this.setState({modal_visible: true, gif: gif})
  }
  
  async copy_did_press() {
    await Clipboard.setString(this.state.gif.images.fixed_height.url)
    this.setState({modal_visible: false})
  }
  
  backdrop_did_press() {
    this.setState({modal_visible: false})
  }
  
  did_scroll({nativeEvent}) {
    if (isCloseToBottom(nativeEvent)) {
      this.fetch(this.state.query, this.state.results.length)
    }
    const {layoutMeasurement, contentOffset, contentSize} = nativeEvent
    this.setState({
      content_offset: contentOffset,
      content_size: contentSize,
      layout_measurement: layoutMeasurement,
    })
  }
  
  componentDidMount() {
    this.query_did_change('yay')
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  images: {
    backgroundColor: '#000',
    flex: 1, flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center',
  },
  
  header: {
    fontSize: 24,
  },
  
  query: {
    height: 50,
    backgroundColor: '#eee',
    borderColor: '#444',
    borderWidth: 1,
    margin: 3,
    padding: 4,
    fontSize: 20,
    width: '50%',
  },
});
