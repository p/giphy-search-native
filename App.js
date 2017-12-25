import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
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
    }
    
    this.fetch = debounce(this.fetch, 1000)
  }
  
  render() {
    return (
      <View style={styles.container}>
      
        <StatusBarBackground style={{backgroundColor:'#191970'}}/>
        
        <Text>
          Giphy Search
        </Text>
        
        <TextInput style={{height: 40}}
          placeholder='Search...'
          onChangeText={this.query_did_change.bind(this)}
        />
        
        <ScrollView>
          {this.state.results.map((result, index) => (
            result.images ?
            <View key={index}>
              <TouchableHighlight
                onLongPress={this.image_did_long_press.bind(this)}
              >
                <Image
                  source={{uri: result.images.fixed_height.url}}
                  style={{
                    width: parseInt(result.images.fixed_height.width),
                    height: parseInt(result.images.fixed_height.height),
                  }}
                />
              </TouchableHighlight>
            </View>
            : null
          ))}
        </ScrollView>
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
  
  image_did_long_press() {
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
