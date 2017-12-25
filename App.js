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
        
        {this.state.query ?
          <Text>
            Gifs for {this.state.query}
          </Text>
        : null}
        
        {this.state.results.slice(0, 3).map((result, index) => (
          result.images ?
          <View key={index}>
            <Text>{result.images.fixed_height.url}</Text>
            <Image
              source={{uri: result.images.fixed_width.url}}
              style={{height: 200}}
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
