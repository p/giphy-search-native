import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {TextInput} from 'react-native'
import debounce from 'debounce'

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
        
        {this.state.results.map((result, index) => (
          <Text key={index}>
            {result}
          </Text>
        ))}
      </View>
    );
  }
  
  query_did_change(text) {
    this.setState({query: text})
    this.fetch(text)
  }
  
  fetch(query) {
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
