import Modal from 'react-native-modal'
import React from 'react';
import { Button, Clipboard, StyleSheet, Text, View } from 'react-native';
import {Image, TextInput, TouchableHighlight, ScrollView} from 'react-native'
import debounce from 'debounce'
import Config from './config'
import StatusBarBackground from './status-bar-background'

export default class App extends React.Component {
  constructor(props) {
    super(props)
    
    this.state = {
      query: '',
      results: [],
      modal_visible: false,
    }
    
    this.fetch = debounce(this.fetch, 1000)
  }
  
  render() {
    return (
      <View style={styles.container}>
      
        <StatusBarBackground style={{backgroundColor:'#191970'}}/>
        
        <Text style={styles.header}>
          Giphy Search
        </Text>
        
        <TextInput style={styles.query}
          value={this.state.query}
          placeholder='Search...'
          onChangeText={this.query_did_change.bind(this)}
        />
        
        <ScrollView style={{width: '100%'}}>
        <View style={styles.images}>
          {this.state.results.map((result, index) => (
            result.images ?
            <View key={index} style={{
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
        </ScrollView>
        
        <Modal isVisible={this.state.modal_visible}>
          <View style={{ backgroundColor: '#fff' }}>
            <Button
              title='Copy URL'
              onPress={this.copy_did_press.bind(this)}
              onBackdropPress={this.backdrop_did_press.bind(this)}
            />
          </View>
        </Modal>        
      </View>
    );
  }
  
  query_did_change(text) {
    this.setState({query: text})
    this.fetch(text)
  }
  
  fetch(query) {
    const offset = 0
    fetch(`https://api.giphy.com/v1/gifs/search?q=${query}&api_key=${Config.api_key}&offset=${offset}`)
    .then(response => response.json())
    .then(payload => {
      this.setState({
        results: payload.data,
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
