import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Image, TextInput} from 'react-native'
import debounce from 'debounce'
import Config from './config'

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
        <Text>
          Giphy Search
        </Text>
        
        <TextInput style={{height: 40}}
          placeholder='Search...'
          onChangeText={this.query_did_change.bind(this)}
        />
        
        {this.state.results.slice(0, 3).map((result, index) => (
          result.images ?
          <View key={index}>
            <Image
              source={{uri: result.images.fixed_height.url}}
              style={{
                width: parseInt(result.images.fixed_height.width),
                height: parseInt(result.images.fixed_height.height),
              }}
            />
          </View>
          : null
        ))}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
